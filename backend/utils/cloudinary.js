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


//this function uploads the image it receives from the frontend to Cloudinary (specifically to the my-profile folder, so that the images stay in one place) through the cloudinary.uploader.upload() method, and then returns a secure_url (a CDN link to that image), and a public_id.
const uploadToCloudinary = async (path, folder = "my-profile") => {
    try {
      const data = await cloudinary.uploader.upload(path, { folder: folder });
      return { url: data.secure_url, publicId: data.public_id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  module.exports = { uploadToCloudinary }