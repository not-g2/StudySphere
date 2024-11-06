const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const Holiday = require('../models/holidayDayModel');

cron.schedule('0 0 * * *', async () => {
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
        const courses = await Course.find().populate('students');

        for (const course of courses) {
            for (const student of course.students) {
                const user = await User.findById(student._id);

                const hasAttendanceToday = user.attendance.some(record =>
                    record.courseId.toString() === course._id.toString() &&
                    record.date.toDateString() === today.toDateString()
                );

                if (!hasAttendanceToday) {
                    user.attendance.push({ courseId: course._id, date: today, status: 'absent' });
                    await user.save();
                }
            }
        }

        console.log("Daily cron job completed: Unmarked students in each course have been marked as absent.");
    } catch (error) {
        console.error("Error in daily attendance cron job:", error);
    }
});