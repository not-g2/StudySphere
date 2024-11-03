const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer.middleware');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Route for uploading profile pictures
router.post('/upload/profile', upload.single('image'), async (req, res) => {
    try {
        const path = req.file.path;
        const result = await uploadToCloudinary(path, "profile-pictures"); // Store in 'profile-pictures' folder
        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ success: false, message: 'Failed to upload profile picture' });
    }
});

// Route for uploading course pictures
router.post('/upload/course', upload.single('image'), async (req, res) => {
    try {
        const path = req.file.path;
        const result = await uploadToCloudinary(path, "course-pictures"); // Store in 'course-pictures' folder
        res.status(200).json({
            success: true,
            message: 'Course picture uploaded successfully',
            data: result,
        });
    } catch (error) {
        console.error('Error uploading course picture:', error);
        res.status(500).json({ success: false, message: 'Failed to upload course picture' });
    }
});

module.exports = router;
