const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// Create new subject
router.post("/add", async (req, res) => {
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

    const newSubject = new Subject({
      subjectName,
      subjectCode,
      courseId,
      semesterNumber,
      maxInternal,
      maxExternal,
      questionPattern
    });

    await newSubject.save();

    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;