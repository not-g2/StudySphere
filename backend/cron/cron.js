const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Holiday = require("../models/holidayDayModel");

cron.schedule("0 0 * * *", async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today's date

        // Check if today is a holiday
        const isHoliday = await Holiday.exists({ date: today });
        if (isHoliday) {
            console.log("Today is a holiday. Skipping attendance marking.");
            return;
        }

        // If not a holiday, proceed with marking absent for unmarked students
        const courses = await Course.find().populate("students");

        for (const course of courses) {
            for (const student of course.students) {
                const user = await User.findById(student._id);

                const hasAttendanceToday = user.attendance.some(
                    (record) =>
                        record.courseId.toString() === course._id.toString() &&
                        record.date.toDateString() === today.toDateString()
                );

                if (!hasAttendanceToday) {
                    user.attendance.push({
                        courseId: course._id,
                        date: today,
                        status: "absent",
                    });
                    await user.save();
                }
            }
        }

        console.log(
            "Daily cron job completed: Unmarked students in each course have been marked as absent."
        );
    } catch (error) {
        console.error("Error in daily attendance cron job:", error);
    }
});

cron.schedule("*/10 * * * *", async () => {
    // Runs every 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
    const now = new Date(); // Current time

    // Find users and count recent "present" attendance records in the last 10 minutes
    const users = await User.aggregate([
        {
            $unwind: "$attendance", // Flatten the attendance array
        },
        {
            $match: {
                "attendance.status": "present", // Filter for "present" status
                "attendance.date": { $gte: tenMinutesAgo, $lte: now }, // Filter for attendance within the last 10 minutes
            },
        },
        {
            $group: {
                _id: "$_id", // Group by user ID
                name: { $first: "$name" }, // Get the user name
                attendanceCount: { $sum: 1 }, // Count the number of "present" records
            },
        },
    ]);

    users.forEach((user) => {
        console.log(
            `User ${user.name} (ID: ${user._id}) has ${user.attendanceCount} "present" records in the last 10 minutes.`
        );
    });
});
