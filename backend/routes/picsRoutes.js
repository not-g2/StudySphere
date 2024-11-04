const express = require('express');
const router = express.Router();
const {upload} = require('../utils/cloudinary');  // Import upload middleware
const User = require('../models/userModel');
const authMiddleware = require('../middleware/auth');  // Middleware to authenticate users

// Upload profile picture
router.post('/profile/upload', authMiddleware, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user.userID);
        if (!user) {
            console.log(req.user.userID);
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update the user's profilePic field with the Cloudinary URL
        user.profilePic = req.file.path;  // Multer provides `req.file.path` after successful upload
        await user.save();

        res.json({ msg: 'Profile picture updated successfully', profilePic: user.profilePic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
