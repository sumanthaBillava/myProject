const mongoose = require("mongoose");

const externalPaperSchema = new mongoose.Schema(
    {
        registrationNumber: {
            type: String,
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },
        pdfPath: {
            type: String,
            required: true
        },
        assignedTeacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        evaluationStatus: {
            type: String,
            enum: ["NOT_ASSIGNED", "ASSIGNED", "EVALUATED"],
            default: "NOT_ASSIGNED"
        },
        externalMarks: {
            type: Number,
            default: 0
        }, 
        questionMarks: [
            {
                questionNumber: Number,
                marksAwarded: Number
            }
        ],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ExternalPaper", externalPaperSchema);