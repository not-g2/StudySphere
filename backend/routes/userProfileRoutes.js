// routes/userProfileRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');  // Import configured upload middleware
const User = require('../models/userModel');
const authMiddleware = require('../middleware/auth');  // Middleware to authenticate users

// Upload profile picture
router.post('/profile/upload', authMiddleware, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Save the Cloudinary URL to the user's profilePic field in DB
        user.profilePic = req.file.path;  // After Multer processes, req.file.path contains Cloudinary URL
        await user.save();

        res.json({ msg: 'Profile picture updated successfully', profilePic: user.profilePic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
