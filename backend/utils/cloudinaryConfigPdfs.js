const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for PDF uploads
const pdfStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pdfs',
        allowed_formats: ['pdf'],
        resource_type: 'raw', // Treat as generic files
    },
});

// Multer instance for handling PDF uploads
const uploadPDF = multer({ storage: pdfStorage });

module.exports = { cloudinary, uploadPDF };
