require("dotenv").config();
const express = require("express");
const cors = require("cors"); //we need cors to handle any Cross-Origin Resource Sharing errors we may come across
const connectDB = require("./config/db");
const passport = require("./config/passport");
const session = require("express-session");

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
const advancedAuthRoutes = require("./routes/advancedAuthRoutes");
const goalRoutes = require("./routes/goalRoutes");
const challengeRoute = require("./routes/challengeRoute");
const timeTableRoute = require("./routes/timeTableRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(advancedAuthRoutes);
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
//app.use("/api/submissions", submissionRoutes);
//app.use("/api/users", userRoutes);
app.use("/api/data", leaderboardRoutes);
app.use("/api/rewd", rewardRoutes);
app.use("/api/evnt", eventRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/challenge", challengeRoute);
app.use("/api/tt", timeTableRoute);
app.use("/api/reminder", reminderRoutes);
app.use("/api/attendance", attendanceRoutes);

require("./cron/cron");
app.listen(process.env.PORT, () => {
    console.log("server is running on port 8000");
});
