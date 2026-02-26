const express = require("express");
const router = express.Router();
const InternalMark = require("../models/InternalMark");
const User = require("../models/User");
const Subject = require("../models/Subject");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Upload internal marks (Teacher only)
router.post("/upload", protect, authorizeRoles("TEACHING_STAFF"), async (req, res) => {
  try {
    const { registrationNumber, subjectId, marks } = req.body;

    // Find student by registration number
    const student = await User.findOne({ registrationNumber });

    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Validate marks
    if (marks > subject.maxInternal) {
      return res.status(400).json({ message: "Marks exceed maximum internal marks" });
    }

    // Check if mark already exists (prevent duplicate entry)
    const existingMark = await InternalMark.findOne({
      studentId: student._id,
      subjectId
    });

    if (existingMark) {
      existingMark.marks = marks;
      await existingMark.save();
      return res.json({ message: "Marks updated successfully" });
    }

    // Create new internal mark
    const internalMark = await InternalMark.create({
      studentId: student._id,
      subjectId,
      marks,
      uploadedBy: req.user._id
    });

    res.status(201).json(internalMark);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;