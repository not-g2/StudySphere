const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Assignment = require("../models/assignmentSchema");
const Submission = require("../models/submissionSchema");
const authMiddleware = require('../middleware/auth');

// Route to fetch all deadlines (assignment due dates) for a specific user
router.get("/:userId/deadlines",authMiddleware, async (req, res) => {
    try {
        // Find the user by ID and populate the courses field
        const user = await User.findById(req.params.userId).populate("courses");

        if (!user) return res.status(404).json({ error: "User not found" });

        // Find all assignments that belong to the user's courses
        let allDeadlines = await Assignment.find({
            course: { $in: user.courses }, // Get assignments where the course is in the user's courses array
        }).populate('course');

        let userSubmissions = await Submission.find({studentId : user._id}).select('assignmentId');
        userSubmissions = new Set(userSubmissions.map(item => item.assignmentId.toString()));

        // fetch only deadlines for which user has not submitted an assignment yet
        const deadlines = [];
        for(const assignment of allDeadlines){
            if(userSubmissions.has(assignment._id.toString())){
                continue;
            }
            deadlines.push(assignment);
        }

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

// Get auraPoints and level of the authenticated user
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Fetch the user from the database using the userID from the JWT token
        const user = await User.findById(req.user.userID).select('xp level auraPoints'); // Select only auraPoints and level fields

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Return the auraPoints and level
        res.status(200).json({
            xp: user.xp,
            level: user.level,
            auraPoints: user.auraPoints
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
