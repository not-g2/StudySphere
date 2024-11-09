const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Assignment = require("../models/assignmentSchema");

// Route to fetch all deadlines (assignment due dates) for a specific user
router.get("/:userId/deadlines", async (req, res) => {
    try {
        // Find the user by ID and populate the courses field
        const user = await User.findById(req.params.userId).populate("courses");

        if (!user) return res.status(404).json({ error: "User not found" });

        // Find all assignments that belong to the user's courses
        const deadlines = await Assignment.find({
            course: { $in: user.courses }, // Get assignments where the course is in the user's courses array
        })
            .select("title dueDate course")
            .populate("course", "name");

        // Send back the deadlines in a structured format
        res.status(200).json({
            deadlines: deadlines.map((deadline) => ({
                assignmentTitle: deadline.title,
                dueDate: deadline.dueDate,
                courseName: deadline.course.name,
            })),
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
