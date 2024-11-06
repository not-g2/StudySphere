const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Import User model
const authMiddleware = require("../middleware/auth"); // Middleware to authenticate users
const Course = require("../models/courseModel");
const Admin = require("../models/adminModel");

router.post("/create", authMiddleware, async (req, res) => {
    const { name, description, students } = req.body;
    try {
        const course = new Course({
            name,
            description,
            students,
        });
        await course.save();
        res.status(201).json({
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/:adminID", authMiddleware, async (req, res) => {
    const adminID = req.params.adminID;
    try {
        // Fetch the admin document
        const admin = await Admin.findById(adminID).populate("course");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Access the course list within the admin document
        const coursesList = admin.course;

        // Send response with the course list
        res.status(200).json({ message: "Courses by admin", coursesList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get courses" });
    }
});

router.get("/getcourse/:courseID", authMiddleware, async (req, res) => {
    const courseID = req.params.courseID;
    try {
        const course = await Course.findById(courseID);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course Found", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get course" });
    }
});

//The Backend guy will take care of it
// router.post("/create/chapter", authMiddleware, async(req, res) => {
//     const {chapterNo, glink, courseID} = req.body;
//     try {
//         const course = await Course.findByIdAndUpdate(courseID, )
//     }
//     catch(error) {
//         console.error(error);
//         res.status(500).json({message: "Failed to Upload Chapter"})
//     }
// })

module.exports = router;
