const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  // Import User model
const { upload } = require('../utils/cloudinary');  // Cloudinary setup for image upload
const authMiddleware = require('../middleware/auth');  // Middleware to authenticate users

// Get user profile by user ID
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userID).select('name email phoneNumber image streakCount');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});


router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, image, phoneNumber } = req.body;

        // Create an update object only with fields that are provided
        let updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (image !== undefined) updateFields.image = image;
        if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;

        // Check if there are any fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: 'No fields provided to update' });
        }

        const updatedProfile = await User.findByIdAndUpdate(
            req.user.userID,
            { $set: updateFields },
            { new: true }
        ).select('name image phoneNumber');

        res.json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});


// Upload profile picture
router.post('/profile/upload', authMiddleware, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user.userID);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.profilePic = req.file.path;  
        user.image.url = req.file.path;
        await user.save();

        res.status(200).json({ msg: 'Profile picture updated', profilePic: user.profilePic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
