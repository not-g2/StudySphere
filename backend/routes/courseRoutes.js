const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Import User model
const authMiddleware = require("../middleware/auth"); // Middleware to authenticate users
const Course = require("../models/courseModel");
const Admin = require("../models/adminModel");

router.post("/create/:adminId", authMiddleware, async (req, res) => {
    const { name, description, students } = req.body;
    try {
        const course = new Course({
            name,
            description,
            students,
        });
        await course.save();
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.course.push(course._id);
        await admin.save();

        res.status(201).json({
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// courses that the admin has
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

// courses joined by a student
router.get("/student/:id", authMiddleware, async (req, res) => {
    const userID = req.params.id;
    try {
        const user = await User.findById(userID).populate("courses");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const coursesList = user.courses;

        res.status(200).json({
            message: "Courses joined by student",
            coursesList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get courses" });
    }
});

// checking if a course exists or not
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

// Route to get all student names in a specific course
router.get('/:courseId/students', async (req, res) => {
    try {
        // Find the course by ID and populate the 'students' field, only selecting the 'name' field of each student
        const course = await Course.findById(req.params.courseId)
            .populate({ path: 'students', select: 'name' });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Extract the student names
        const studentNames = course.students.map(student => student.name);

        res.status(200).json({ students: studentNames });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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
