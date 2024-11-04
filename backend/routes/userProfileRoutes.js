const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  // Import User model
const { upload } = require('../utils/cloudinary');  // Cloudinary setup for image upload
const authMiddleware = require('../middleware/auth');  // Middleware to authenticate users

// Get user profile by user ID
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email phone');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Update user profile details
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, bio, course, year } = req.body;
        const updatedProfile = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { name, bio, course, year } },
            { new: true }
        ).select('-password'); // Exclude password field

        res.json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Upload profile picture
router.post('/profile/upload', authMiddleware, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.profilePic = req.file.path;  // Assuming `upload.single()` has set the path
        await user.save();

        res.json({ msg: 'Profile picture updated', profilePic: user.profilePic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
