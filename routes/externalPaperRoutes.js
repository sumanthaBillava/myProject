const express = require("express");
const router = express.Router();
const ExternalPaper = require("../models/ExternalPaper");
const User = require("../models/User");
const Subject = require("../models/Subject");
const upload = require("../middleware/uploadMiddleware");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// University Admin uploads external paper
router.post(
  "/upload",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { registrationNumber, subjectId } = req.body;

      const student = await User.findOne({ registrationNumber });

      if (!student || student.role !== "STUDENT") {
        return res.status(404).json({ message: "Student not found" });
      }

      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "PDF file is required" });
      }

      const paper = await ExternalPaper.create({
        registrationNumber,
        studentId: student._id,
        subjectId,
        pdfPath: req.file.path
      });

      res.status(201).json(paper);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;