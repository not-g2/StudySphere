const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'my-profile',  // Folder for profile images
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage });

// Utility function to upload directly to Cloudinary without Multer
const uploadToCloudinary = async (filePath, folder = 'my-profile') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder: folder });
        return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

module.exports = { upload, uploadToCloudinary };
