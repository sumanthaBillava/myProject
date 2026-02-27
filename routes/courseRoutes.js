const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create new course (University Admin only)
router.post(
  "/add",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const { name } = req.body;

      const exists = await Course.findOne({ name });
      if (exists) {
        return res.status(400).json({
          message: "Course already exists"
        });
      }

      const newCourse = await Course.create({ name });

      res.status(201).json(newCourse);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all courses (protected)
router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;