const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authMiddleware = require('../middleware/auth');

// GET route to fetch top 10 users by auraPoints
router.get('/top-10-aura', authMiddleware,async (req, res) => {
    try {
        // Find users, sort by auraPoints in descending order, and limit to top 10
        const topUsers = await User.find({})
            .sort({ auraPoints: -1 })
            .limit(10)
            .select('name level'); // Select fields to display in the response

        res.status(200).json({
            message: 'Top 10 users based on auraPoints',
            users: topUsers
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error, could not retrieve top users' });
    }
});

module.exports = router;