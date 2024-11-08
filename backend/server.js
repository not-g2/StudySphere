require("dotenv").config();
const express = require("express");
const cors = require("cors"); //we need cors to handle any Cross-Origin Resource Sharing errors we may come across

const uploadPicRoutes = require("./routes/picsRoutes");
const authRoutes = require("./routes/authRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userRoutes = require("./routes/userRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const eventRoutes = require("./routes/eventRoutes");
const connectDB = require("./config/db");

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/images", uploadPicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/desc", userProfileRoutes); // desc is for description
app.use("/api/assgn", assignmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/adminauth/", adminRoutes);
app.use("/api/announce", announcementRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chapter", chapterRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/data", leaderboardRoutes);
app.use("/api/rewd", rewardRoutes);
app.use("/api/evnt", eventRoutes);

require("./cron/cron");
app.listen(8000, () => {
    console.log("server is running on port 8000");
});
