const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        registrationNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["UNIVERSITY_ADMIN", "COLLEGE_ADMIN", "TEACHING_STAFF", "STUDENT"],
            required: true
        },
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College"
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        subjectsHandling: [
            {
                subjectId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject"
                },
                courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course"
                },
                semesterNumber: Number
            }
        ]
    },
    {
        timestamps: true
    }
);

// Password Hashing Before Saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password Method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);