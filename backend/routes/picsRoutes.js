const express = require('express');
const router = express.Router();
const {upload} = require('../utils/cloudinary');
const { uploadToCloudinary } = require('../utils/cloudinary');
const User = require('../models/userModel');
// Route for uploading profile pictures
router.post('/upload/profile', upload.single('image'), async (req, res) => {
    try {
        const result = req.file; // Multer will give you the Cloudinary response in req.file
        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: {
                url: result.path, // or result.secure_url depending on your storage config
                publicId: result.filename, // or however you want to manage it
            },
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ success: false, message: 'Failed to upload profile picture' });
    }
});


module.exports = router;
