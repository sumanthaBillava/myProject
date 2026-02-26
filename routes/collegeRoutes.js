const express = require("express");
const router = express.Router();
const College = require("../models/College");

// Add new college
router.post("/add", async (req, res) => {
  try {
    const { collegeName, collegeCode } = req.body;

    const newCollege = new College({
      collegeName,
      collegeCode
    });

    await newCollege.save();

    res.status(201).json(newCollege);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all colleges
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;