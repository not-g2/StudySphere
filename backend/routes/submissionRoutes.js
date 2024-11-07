const express = require('express');
const router =  express.Router();
const Submission = require('../models/submissionSchema');
const Assignment = require('../models/assignmentSchema');
const User = require('../models/userModel');

// route for submitting an assignment
router.post('/submit',async(req,res)=>{
    const { assignmentId, studentId, fileLink } = req.body;

    try {
        // Check if the assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

        // Check if the student exists
        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        // Create a new submission
        const submission = new Submission({
            assignmentId,
            studentId,
            fileLink,
            status: 'submitted',
        });
        await submission.save();

        res.status(201).json({ message: 'Submission successful', submission });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// route for fetching all submissions for a specific assignment
router.get('/assignment/:id/submissions', async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.id })
            .populate({ path: 'studentId', select: 'name' });

        if (!submissions.length) return res.status(404).json({ error: 'No submissions found for this assignment' });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for marking a submission as checked by adding feedback
router.put('/submission/:id/feedback', async (req, res) => {
    const { feedback, grade } = req.body; // Feedback and optional grade

    try {
        // Find the submission by ID
        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ error: 'Submission not found' });

        // Update the submission with feedback and optionally grade
        submission.feedback = feedback;
        if (grade !== undefined) {
            submission.grade = grade;
            submission.status = 'graded'; // Optionally update status if graded
        }
        
        await submission.save();

        res.status(200).json({ message: 'Feedback added successfully', submission });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;