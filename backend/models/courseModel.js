const mongoose = require("mongoose");
const crypto = require("crypto");

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    section: { type: String },
    description: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
    createdAt: { type: Date, default: Date.now },
    coursePic: {
        publicId: {
            type: String,
            //required: true,
        },
        url: {
            type: String,
            //required: true,
        },
    },
    courseCode: { type: String, unique: true }, // This is the field you're setting
});

// Ensure you're modifying the correct field name (courseCode)
CourseSchema.pre("save", function (next) {
    if (!this.courseCode) {
        // Corrected to courseCode here
        const hashInput = `${this._id}${this.createdAt}`;
        const hash = crypto
            .createHash("sha256")
            .update(hashInput)
            .digest("hex");
        this.courseCode = hash.slice(0, 8); // Take the first 8 characters of the hash
    }
    next(); // Don't call this.save() here!
});

module.exports = mongoose.model("Course", CourseSchema);
