// this is just for the creation of challenges
// submissions to the challenges will also be in the submissionRoutes
const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignmentSchema.js');
const User = require('../models/userModel'); 
const rewardfunc = require('../utils/rewardFunc'); // Import the reward function
const authMiddleware = require('../middleware/auth');

// Route to trigger the challenge for a random assignment
router.get('/challenge',authMiddleware, async (req, res) => {
    try {
        // 1. Select a random assignment from the database
        const assignments = await Assignment.find({});
        const randomAssignment = assignments[Math.floor(Math.random() * assignments.length)];

        // 2. Set deadline 12 hours from now
        const currDate = new Date();
        const deadLineDate = new Date(currDate);
        deadLineDate.setHours(deadLineDate.getHours()+12);

        res.status(200).json({
            assignment : randomAssignment,
            deadline : deadLineDate
        });

        // 3-a. The student already submitted this assignment , in that case assign him the maximum scorable points


        // // 3. Assume student has submitted the assignment
        // const submissionDate = req.query.submissionDate || new Date(); // Assume current time if not provided

        // // 4. Calculate the bonus points using the reward function
        // const bonusPoints = rewardfunc(midnight, submissionDate);

        // // 5. Update the student's points (assuming you have a 'points' field in User schema)
        // await User.findByIdAndUpdate(req.user.userID, {
        //     $inc: { auraPoints : bonusPoints }, // Increment student's points by the calculated bonus
        //     $inc : {xp : bonusPoints}
        // });

        // // 6. Send the response back with the random assignment and bonus points awarded
        // res.status(200).json({
        //     assignment: randomAssignment,
        //     bonusPoints
        // });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate the challenge or update points' });
    }
});

module.exports = router;