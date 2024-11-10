const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignmentSchema');
const User = require('../models/userModel'); // Assuming you have a User model to store student details
const rewardfunc = require('../utils/rewardFunc'); // Import the reward function
const authMiddleware = require('../middleware/auth');

// Route to trigger the challenge for a random assignment
router.get('/challenge',authMiddleware, async (req, res) => {
    try {
        // 1. Select a random assignment from the database
        const assignments = await Assignment.find({});
        const randomAssignment = assignments[Math.floor(Math.random() * assignments.length)];

        // 2. Simulate today's midnight (dueDate as today at midnight)
        const now = new Date();
        const midnight = new Date(now.setHours(24, 0, 0, 0)); // Setting time to midnight

        // 3. Assume student has submitted the assignment
        const submissionDate = req.query.submissionDate || new Date(); // Assume current time if not provided

        // 4. Calculate the bonus points using the reward function
        const bonusPoints = rewardfunc(midnight, submissionDate);

        // 5. Update the student's points (assuming you have a 'points' field in User schema)
        await User.findByIdAndUpdate(req.user.userID, {
            $inc: { auraPoints : bonusPoints }, // Increment student's points by the calculated bonus
            $inc : {xp : bonusPoints}
        });

        // 6. Send the response back with the random assignment and bonus points awarded
        res.status(200).json({
            assignment: randomAssignment,
            bonusPoints
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate the challenge or update points' });
    }
});

module.exports = router;