const express = require("express");
const router = express.Router();
const Assignment = require("../models/assignmentSchema");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");

// Route 1: Create a New Assignment (Works)
router.post("/", authMiddleware, async (req, res) => {
    const { title, description, course, dueDate } = req.body;
    // console.log(title);
    // console.log(description);
    // console.log(course);
    // console.log(dueDate);
    try {
        const assignment = new Assignment({
            title,
            description,
            course: new mongoose.Types.ObjectId(course), //Just for Testing
            dueDate,
        });
        await assignment.save();
        res.status(201).json({
            message: "Assignment created successfully",
            assignment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

//Works
router.get("/func", authMiddleware, async (req, res) => {
    try {
        // Fetch assignments, only selecting the `dueDate` field, and sort by `dueDate` in ascending order
        const assignments = await Assignment.find({}).sort({
            dueDate: 1,
        });

        // Return the sorted array of due dates
        res.json({ assignments });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch due dates' });
      }
})

// Route 2: Get All Assignments for a Course
router.get('/course/:courseId', async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route 3: Update Assignment Status(Works)
router.put("/:id/status", async (req, res) => {
    const { status } = req.body;
    //console.log(req.params);
    try {
        const assignment = await Assignment.findOneAndUpdate(
            { _id: req.params.id },
            {
                status,
            }
        );
        res.json({ message: "Assignment status updated", assignment }); //This supposedly has the unupdated Assignment
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Route 4: Approve Assignment by Professor(Works)
router.put("/:id/approve", async (req, res) => {
    try {
        const assignment = await Assignment.findOneAndUpdate(
            { _id: req.params.id },
            { profApproval: true },
            { new: true }
        );
        res.json({ message: "Assignment approved by professor", assignment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Route 5: Update Assignment Details(Works)
router.put("/:id", async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ message: "Assignment updated", assignment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Route 6: Delete an Assignment(Works)
router.delete("/:id", async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
