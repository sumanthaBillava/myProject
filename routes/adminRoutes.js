const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
// Get all pending users (teachers or students)
router.get("/pending", protect, authorizeRoles("COLLEGE_ADMIN"), async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve user
router.put("/approve/:id", protect, authorizeRoles("COLLEGE_ADMIN"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject user (delete)
router.delete("/reject/:id", protect, authorizeRoles("COLLEGE_ADMIN"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;