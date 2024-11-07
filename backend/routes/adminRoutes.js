const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const authMiddleware = require("../middleware/auth");
const Announcement = require("../models/announcementSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const Assignment = require("../models/assignmentSchema");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const { uploadPDF } = require("../utils/cloudinaryConfigPdfs");
const mongoose = require('mongoose');

// Admins are hardcoded , we just need to verify them
// login endpoint (Works)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ msg: "Email and password are required!" });
        }

        // Find user by email
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials!" });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials!" });
        }

        // Generate JWT token
        const token = JWT.sign({ userID: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Send response
        res.status(200).json({
            msg: "Login successful",
            token,
            user: { id: user._id, email: user.email, isAdmin: true },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// log out endpoint (Works)
router.post("/logout", (req, res) => {
    try {
        // Inform the client to remove the token from storage
        res.status(200).json({
            msg: "Logout successful. Please clear the token on the client side.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// fetch admin courses (Works)
router.get("/fetch", authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.userID).populate("course");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({
            courses: admin.course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching admin data" });
    }
});

//admin posts an announcement (Works)
router.post("/post/announcement", authMiddleware, async (req, res) => {
    try {
        const { title, description, course } = req.body;
        // validate the input
        if (!title || !description || !course) {
            return res
                .status(400)
                .json({ msg: "Title, description, and course are required." });
        }

        // create an annoucement object
        const newannoucement = new Announcement({
            title,
            description,
            course,
            admin: req.user.userID,
        });

        await newannoucement.save();
        res.status(201).json({
            msg: "Announcement posted successfully",
            announcement: newannoucement,
        });
    } catch (error) {
        res.status(500).json({ msg: "Error posting announcement" });
    }
});

// admin uploads a new assignment
router.post(
    "/post/assgn",
    authMiddleware,
    uploadPDF.single("pdfFile"), // Use uploadPdf instead of pdfStorage
    async (req, res) => {
        try {
            const {
                title,
                description,
                course,
                dueDate,
                createdAt,
                createdBy,
            } = req.body;

            if (!title || !dueDate || !course) {
                return res.status(400).json({
                    message: "Title, due date, and course are required",
                });
            }

            // Check if PDF file was uploaded
            const pdfLink = req.file ? req.file.path : null;
            if (!pdfLink) {
                return res
                    .status(400)
                    .json({ message: "PDF file is required" });
            }

            // Check if the course exists in the database
            const courseExists = await Course.findById(course);
            if (!courseExists) {
                return res.status(404).json({ message: "Course not found" });
            }

            // Create a new assignment document
            const newAssignment = new Assignment({
                title,
                description,
                course,
                dueDate,
                createdBy,
                createdAt,
                pdfLink,
            });

            const savedAssignment = await newAssignment.save();
            res.status(201).json({
                message: "Assignment created successfully",
                assignment: savedAssignment,
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error",
                error: error.message,
            });
        }
    }
);



// marking attendance
router.post("/post/mark", authMiddleware, async (req, res) => {
    try {
        const { userId, courseId, date, status } = req.body;

        if (!userId || !courseId || !date || !status) {
            return res
                .status(400)
                .json({
                    message:
                        "User ID, course ID, date, and status are required",
                });
        }

        // Check if the student is enrolled in the specified course
        const course = await Course.findById(courseId).populate("students");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const isEnrolled = course.students.some(
            (student) => student._id.toString() === userId
        );
        if (!isEnrolled) {
            return res
                .status(400)
                .json({ message: "Student is not enrolled in this course" });
        }

        // Find the user and check for existing attendance for the same course and date
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const alreadyMarked = user.attendance.some(
            (record) =>
                record.courseId.toString() === courseId &&
                record.date.toDateString() === new Date(date).toDateString()
        );

        if (alreadyMarked) {
            return res
                .status(400)
                .json({
                    message:
                        "Attendance for this course and date is already marked",
                });
        }

        // Add the attendance record for the specified course and date
        user.attendance.push({ courseId, date, status });
        await user.save();

        res.status(200).json({
            message: `Student marked as ${status} for course`,
            user,
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

//summary on attendance
router.get("/summary/:userId", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate(
            "attendance.courseId",
            "name"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Group attendance by course
        const attendanceSummary = user.attendance.reduce((summary, record) => {
            const courseName = record.courseId.name;
            if (!summary[courseName]) {
                summary[courseName] = [];
            }
            summary[courseName].push({
                date: record.date,
                status: record.status,
            });
            return summary;
        }, {});

        res.status(200).json({
            name: user.name,
            attendance: attendanceSummary,
        });
    } catch (error) {
        console.error("Error fetching user attendance:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userID; 
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Invalid user ID format" });
        }
        const admin = await Admin.findById(req.user.userID).select(
            "name email"
        );

        if (!admin) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
});
module.exports = router;
