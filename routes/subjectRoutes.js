const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create new subject (University Admin only)
router.post(
  "/add",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const {
        subjectName,
        subjectCode,
        courseId,
        semesterNumber,
        maxInternal,
        maxExternal,
        questionPattern
      } = req.body;

      // Prevent duplicate subject code in same course & semester
      const existing = await Subject.findOne({
        subjectCode,
        courseId,
        semesterNumber
      });

      if (existing) {
        return res.status(400).json({
          message: "Subject already exists for this course and semester"
        });
      }

      const newSubject = await Subject.create({
        subjectName,
        subjectCode,
        courseId,
        semesterNumber,
        maxInternal,
        maxExternal,
        questionPattern
      });

      res.status(201).json(newSubject);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get subjects by course and semester
router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const { courseId, semesterNumber } = req.query;

      const filter = {};

      if (courseId) filter.courseId = courseId;
      if (semesterNumber) filter.semesterNumber = semesterNumber;

      const subjects = await Subject.find(filter)
        .populate("courseId", "courseName");

      res.json(subjects);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;