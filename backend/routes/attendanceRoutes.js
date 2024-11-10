const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const authMiddleware = require("../middleware/auth");

router.get("/breakdown/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate(
            "attendance.courseId"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const attendanceByCourse = {};

        user.attendance.forEach((record) => {
            const { courseId, status } = record;

            if (!attendanceByCourse[courseId]) {
                attendanceByCourse[courseId] = {
                    totalClasses: 0,
                    attendedClasses: 0,
                    courseName: courseId.name,
                };
            }
            attendanceByCourse[courseId].totalClasses += 1;

            if (status === "present") {
                attendanceByCourse[courseId].attendedClasses += 1;
            }
        });

        const attendancePercentageByCourse = Object.keys(
            attendanceByCourse
        ).map((courseId) => {
            const courseData = attendanceByCourse[courseId];
            const percentage =
                courseData.totalClasses === 0
                    ? 0
                    : (courseData.attendedClasses / courseData.totalClasses) *
                      100;

            return {
                courseName: courseData.courseName,
                attendancePercentage: percentage.toFixed(2),
                totalClasses: courseData.totalClasses,
                attendedClasses: courseData.attendedClasses,
            };
        });

        return res
            .status(200)
            .json({ attendanceByCourse: attendancePercentageByCourse });
    } catch (error) {
        console.error("Error fetching user attendance:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
