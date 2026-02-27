const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const internalMarkRoutes = require("./routes/internalMarkRoutes");
const externalPaperRoutes = require("./routes/externalPaperRoutes");
const allotmentRoutes = require("./routes/allotmentRoutes");
const teacherEvaluationRoutes = require("./routes/teacherEvaluationRoutes");
const resultRoutes = require("./routes/resultRoutes");
const evaluationRequestRoutes = require("./routes/evaluationRequestRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/internal-marks", internalMarkRoutes);
app.use("/api/external-papers", externalPaperRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/allotment", allotmentRoutes);
app.use("/api/teacher", teacherEvaluationRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/evaluation-requests", evaluationRequestRoutes);




app.get("/", (req, res) => {
  res.send("Online Evaluation System API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});