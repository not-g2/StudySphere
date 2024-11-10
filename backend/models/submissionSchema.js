const mongoose = require("mongoose");

// this will store the details of the submissions that students make to an assignment
const SubmissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    }, // Link to the original assignment
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        
    }, // Student ID
    submittedDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["pending", "submitted", "graded"],
        default: "submitted",
    },
    grade: { type: Number }, // Optional grading field (this will be out of 100)
    feedback: { type: String }, // Feedback given by professor
    fileLink: { type: String }, // Link to the student’s submitted file
    submissionDate: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Submission", SubmissionSchema);
