const cloudinary = require("cloudinary").v2;

const generatePdfUrl = (publicId) => {
    return cloudinary.url(publicId, {
        resource_type: "auto",
        flags: "attachment",
        format: "pdf",
    });
};

module.exports = generatePdfUrl;