const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const ExternalPaper = require("../models/ExternalPaper");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const InternalMark = require("../models/InternalMark");

// University Admin publishes result for subject
router.put(
  "/publish/:subjectId",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const { subjectId } = req.params;

      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      // Check if all papers are evaluated
      const pending = await ExternalPaper.find({
        subjectId,
        evaluationStatus: { $ne: "EVALUATED" }
      });

      if (pending.length > 0) {
        return res.status(400).json({
          message: "Cannot publish. Some papers are not evaluated yet."
        });
      }

      subject.resultPublished = true;
      await subject.save();

      res.json({ message: "Result published successfully" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);



// Student views result
router.get(
  "/my-results/:subjectId",
  protect,
  authorizeRoles("STUDENT"),
  async (req, res) => {
    try {
      const { subjectId } = req.params;

      const subject = await Subject.findById(subjectId);
      if (!subject || !subject.resultPublished) {
        return res.status(403).json({ message: "Result not published yet" });
      }

      const internal = await InternalMark.findOne({
        studentId: req.user._id,
        subjectId
      });

      const external = await ExternalPaper.findOne({
        studentId: req.user._id,
        subjectId
      });

      const internalMarks = internal ? internal.marks : 0;
      const externalMarks = external ? external.externalMarks : 0;

      const total = internalMarks + externalMarks;

      res.json({
        subject: subject.subjectName,
        internalMarks,
        externalMarks,
        total
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;