const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pdfStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pdfs',  // Folder for PDFs
        allowed_formats: ['pdf'],
        resource_type: 'raw',  // Treat as generic files
    },
});

const uploadPdf = multer({ storage: pdfStorage });

module.exports = { cloudinary, uploadPdf };
