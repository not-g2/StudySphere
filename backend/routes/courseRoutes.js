const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Import User model
const authMiddleware = require("../middleware/auth"); // Middleware to authenticate users
const Course = require("../models/courseModel");
const Admin = require("../models/adminModel");
const Assignment = require("../models/assignmentSchema");
const Chapter = require("../models/chapterSchema");
const Announcement = require("../models/announcementSchema");
const Notification = require("../models/notificationSchema");
const Submission = require("../models/submissionSchema");

router.post("/fetchcoursecode/:courseid/:adminId",authMiddleware,async(req,res)=>{
    try{
        const {courseid,adminId}=req.params;
        
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const course = await Course.findById(courseid);
        if(!course){
            return res.status(404).json({
                message : "course not found"
            })
        }

        return res.status(200).json({
            coursecode : course.courseCode
        })

    }catch(error){
        console.error(error);
        return res.status(401).json({
            message : "course not found"
        })
    }
})

router.post("/create/:adminId", authMiddleware, async (req, res) => {
    const { name, description, students } = req.body;
    try {
        const course = new Course({
            name,
            description,
            students,
            //courseCode
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

// route to delete a course
router.delete("/deletecourse/:adminId/:courseId",authMiddleware,async(req,res)=>{
    try{
        const {adminId,courseId} = req.params;

        const admin = await Admin.findOne({
            _id : adminId,
            course : courseId
        })

        if(!admin){
            return res.status(400).json({
                message : "Admin with given course not found."
            })
        }

        // remove the course from the admin's course
        await Admin.updateOne(
            {_id : adminId, course : courseId},
            {$pull : {course : courseId}}
        )

        // remove all students from the course
        await User.updateMany(
            {courses : courseId},
            {$pull : {courses : courseId}}
        )

        // remove all the chapters from the course
        await Chapter.deleteMany(
            {course : courseId}
        )

        // remove all associated announcements for the course
        await Announcement.deleteMany(
            {course : courseId}
        )

        // remove all assignments from that course
        // each submission is linked to an assignment , so we need to delete the associated submissions as well
        const assignments = await Assignment.find({course : courseId});

        const assignmentids = assignments.map(a => a._id);

        await Submission.deleteMany(
            {assignmentId : {$in : assignmentids}}
        )

        // now delete all the assignments for the course
        await Assignment.deleteMany(
            {course : courseId}
        )

        // now that all dependecies are deleted , we can delete the course now
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            message : "Given course is successfully deleted!"
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
})

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
router.get("/:courseId/students", authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate({
            path: "students",
            select: "name",
        }); // '_id' is included by default

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Format each student with both '_id' and 'name'
        const studentData = course.students.map((student) => ({
            _id: student._id,
            name: student.name,
        }));

        res.status(200).json({ students: studentData });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to fetch all assignments for a particular course
router.get("/:courseId/assignments", async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find all assignments where the course field matches the courseId
        const assignments = await Assignment.find({ course: courseId }).select(
            "dueDate description"
        );

        // Check if any assignments were found
        if (!assignments || assignments.length === 0) {
            return res
                .status(404)
                .json({ error: "No assignments found for this course" });
        }

        res.status(200).json({ assignments });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//add a student to a Course
router.put("/add-course", async (req, res) => {
    try {
        const { studentId, courseCode } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        if (!courseCode) {
            return res.status(400).json({ message: "Course Code is required" });
        }

        const course = await Course.findOne({ courseCode: courseCode });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.students.includes(studentId)) {
            return res.status(400).json({
                message: "Student is already enrolled in this course",
            });
        }

        course.students.push(studentId);

        await course.save();

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        await Notification.updateOne(
            {user : student._id},
            {$push : {notifList : {content : `You have been added to  ${course.name} course`}}},
            {new : true,upsert : true}
        )

        student.courses.push(course._id);
        await student.save();

        res.status(200).json({ message: "Student added to course", course });
    } catch (err) {
        console.error("Error adding student to course:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/fetchcoursecode/:courseid/:adminId",authMiddleware,async(req,res)=>{
    try{
        const {courseid,adminId}=req.params;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const course = await Course.findById(courseid);
        if(!course){
            return res.status(404).json({
                message : "course not found"
            })
        }

        return res.status(200).json({
            coursecode : course.courseCode
        })

    }catch(error){
        console.error(error);
        return res.status(401).json({
            message : "course not found"
        })
    }
})

module.exports = router;
