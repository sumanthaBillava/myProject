const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Create new course
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;

    const newCourse = new Course({ name });
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;