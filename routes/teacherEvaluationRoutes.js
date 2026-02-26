const express = require("express");
const router = express.Router();
const ExternalPaper = require("../models/ExternalPaper");
const Subject = require("../models/Subject");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Teacher sees assigned papers
router.get(
  "/assigned",
  protect,
  authorizeRoles("TEACHING_STAFF"),
  async (req, res) => {
    try {
      const papers = await ExternalPaper.find({
        assignedTeacher: req.user._id,
        evaluationStatus: "ASSIGNED"
      }).populate("subjectId", "subjectName subjectCode");

      res.json(papers);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Teacher evaluates paper
router.put(
  "/evaluate/:paperId",
  protect,
  authorizeRoles("TEACHING_STAFF"),
  async (req, res) => {
    try {
      const { questionMarks } = req.body;

      const paper = await ExternalPaper.findById(req.params.paperId)
        .populate("subjectId");

      if (!paper) {
        return res.status(404).json({ message: "Paper not found" });
      }

      if (paper.assignedTeacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not your assigned paper" });
      }

      let total = 0;

      // Validate against subject question pattern
      for (let q of questionMarks) {
        const pattern = paper.subjectId.questionPattern.find(
          p => p.questionNumber === q.questionNumber
        );

        if (!pattern) {
          return res.status(400).json({ message: "Invalid question number" });
        }

        if (q.marksAwarded > pattern.maxMarks) {
          return res.status(400).json({
            message: `Marks exceed max for question ${q.questionNumber}`
          });
        }

        total += q.marksAwarded;
      }

      paper.questionMarks = questionMarks;
      paper.externalMarks = total;
      paper.evaluationStatus = "EVALUATED";

      await paper.save();

      res.json({ message: "Paper evaluated successfully", total });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;