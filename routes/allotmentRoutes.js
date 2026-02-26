const express = require("express");
const router = express.Router();
const ExternalPaper = require("../models/ExternalPaper");
const EvaluationRequest = require("../models/EvaluationRequest");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// University Admin performs staff allotment
router.post(
    "/allot/:subjectId",
    protect,
    authorizeRoles("UNIVERSITY_ADMIN"),
    async (req, res) => {
        try {
            const { subjectId } = req.params;

            // Get all NOT_ASSIGNED papers
            const papers = await ExternalPaper.find({
                subjectId,
                evaluationStatus: "NOT_ASSIGNED"
            });

            if (papers.length === 0) {
                return res.status(400).json({ message: "No papers to assign" });
            }

            // Get approved evaluation requests
            const approvedRequests = await EvaluationRequest.find({
                subjectId,
                status: "APPROVED"
            }).populate("teacherId");

            const teacherIds = approvedRequests
                .filter(req => req.teacherId && req.teacherId.isApproved)
                .map(req => req.teacherId._id);

            if (teacherIds.length === 0) {
                return res.status(400).json({ message: "No eligible approved teachers found" });
            }
            // Distribute papers equally
            let teacherIndex = 0;

            for (let paper of papers) {
                paper.assignedTeacher = teacherIds[teacherIndex];
                paper.evaluationStatus = "ASSIGNED";
                await paper.save();

                teacherIndex = (teacherIndex + 1) % teacherIds.length;
            }

            res.json({ message: "Papers allotted successfully" });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;