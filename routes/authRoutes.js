const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// Register User
router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            collegeId,
            registrationNumber,
            subjectsHandling
        } = req.body;

        const userExists = await User.findOne({ email });
        if (role === "STUDENT" && !registrationNumber) {
            return res.status(400).json({ message: "Registration number is required for students" });
        }

        if (role !== "STUDENT" && registrationNumber) {
            return res.status(400).json({ message: "Only students can have registration number" });
        }
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        

        const user = await User.create({
            name,
            email,
            password,
            role,
            collegeId,
            registrationNumber,
            subjectsHandling
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            registrationNumber: user.registrationNumber,
            role: user.role,
            isApproved: user.isApproved,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && await user.matchPassword(password)) {

            if (
                (user.role === "TEACHING_STAFF" || user.role === "STUDENT") &&
                !user.isApproved
            ) {
                return res.status(403).json({ message: "Account not approved yet" });
            }
            console.log("Login successful for user:", user.email);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                registrationNumber: user.registrationNumber,
                role: user.role,
                isApproved: user.isApproved,
                token: generateToken(user._id)
            });

        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
}
});



module.exports = router;