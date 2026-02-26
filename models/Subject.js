const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true
    },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    maxInternal: {
      type: Number,
      required: true
    },
    maxExternal: {
      type: Number,
      required: true
    },
    questionPattern: [
      {
        questionNumber: Number,
        maxMarks: Number
      }
    ],
    resultPublished: {
  type: Boolean,
  default: false
},
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Subject", subjectSchema);