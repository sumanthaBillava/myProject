const express = require("express");
const router = express.Router();
const EvaluationRequest = require("../models/EvaluationRequest");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Teacher sends evaluation request
router.post("/request", protect, authorizeRoles("TEACHING_STAFF"), async (req, res) => {
  try {
    const { subjectId } = req.body;

    const newRequest = await EvaluationRequest.create({
      teacherId: req.user._id,
      subjectId
    });

    res.status(201).json(newRequest);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// University Admin views all requests
router.get("/all", protect, authorizeRoles("UNIVERSITY_ADMIN"), async (req, res) => {
  try {
    const requests = await EvaluationRequest.find()
      .populate("teacherId", "name email")
      .populate("subjectId", "subjectName subjectCode");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or Reject request
router.put("/update/:id", protect, authorizeRoles("UNIVERSITY_ADMIN"), async (req, res) => {
  try {
    const { status } = req.body;

    const request = await EvaluationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.json({ message: "Request updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;