const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// configuring the cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'my-profile', // Folder in Cloudinary where images will be stored
        allowed_formats: ['jpg', 'png', 'jpeg'], // Specify allowed formats
    },
});

const upload = multer({ storage: storage });

module.exports = upload;