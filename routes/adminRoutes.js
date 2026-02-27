const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
// Get all pending users (teachers or students)
router.get(
  "/pending",
  protect,
  authorizeRoles("COLLEGE_ADMIN"),
  async (req, res) => {
    try {

      // req.user comes from protect middleware
      const collegeId = req.user.collegeId;

      const pendingUsers = await User.find({
        isApproved: false,
        collegeId: collegeId,
        role: { $in: ["STUDENT", "TEACHING_STAFF"] }
      });

      res.json(pendingUsers);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Approve user
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("COLLEGE_ADMIN"),
  async (req, res) => {
    try {

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Security check
      if (user.collegeId.toString() !== req.user.collegeId.toString()) {
        return res.status(403).json({ message: "Not authorized for this user" });
      }

      user.isApproved = true;
      await user.save();

      res.json({ message: "User approved successfully" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Reject user (delete)
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("COLLEGE_ADMIN"),
  async (req, res) => {
    try {

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Security check
      if (user.collegeId.toString() !== req.user.collegeId.toString()) {
        return res.status(403).json({ message: "Not authorized for this user" });
      }

      user.isApproved = true;
      await user.save();

      res.json({ message: "User approved successfully" });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
// Get all college admins (University Admin only)
router.get(
  "/college-admins",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const admins = await User.find({ role: "COLLEGE_ADMIN" })
        .populate("collegeId", "collegeName");

      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Create college admin (University Admin only)
router.post(
  "/create-college-admin",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      const { name, email, password, collegeId } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const admin = await User.create({
        name,
        email,
        password,
        role: "COLLEGE_ADMIN",
        collegeId,
        isApproved: true
      });

      res.status(201).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete college admin
router.delete(
  "/college-admin/:id",
  protect,
  authorizeRoles("UNIVERSITY_ADMIN"),
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "College Admin deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
module.exports = router;