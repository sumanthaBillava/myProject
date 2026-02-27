const express = require("express");
const router = express.Router();
const EvaluationRequest = require("../models/EvaluationRequest");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Teacher sends request
router.post(
  "/request",
  protect,
  authorizeRoles("TEACHING_STAFF"),
  async (req, res) => {
    try {
      const { subjectId } = req.body;

      const existing = await EvaluationRequest.findOne({
        teacherId: req.user._id,
        subjectId
      });

      if (existing) {
        return res.status(400).json({
          message: "Already requested for this subject"
        });
      }

      const request = await EvaluationRequest.create({
        teacherId: req.user._id,
        subjectId,
        collegeId: req.user.collegeId
      });

      res.status(201).json(request);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// University Admin sees pending requests
router.get(
  "/pending",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const requests = await EvaluationRequest.find({ status: "PENDING" })
        .populate("teacherId", "name email")
        .populate("subjectId", "subjectName subjectCode");

      res.json(requests);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve request
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const request = await EvaluationRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = "APPROVED";
      await request.save();

      res.json({ message: "Request approved" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
// Reject request
router.put(
  "/reject/:id",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const request = await EvaluationRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = "REJECTED";
      await request.save();

      res.json({ message: "Request rejected" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
module.exports = router;