// this will include submissions to the normal assignments , and also the submissions to the assignments as a challenege
const express = require("express");
const router = express.Router();
const Submission = require("../models/submissionSchema");
const Assignment = require("../models/assignmentSchema");
const User = require("../models/userModel");
const rewardfunc = require("../utils/rewardFunc");
const authMiddleware = require("../middleware/auth");
const { uploadPDF } = require("../utils/cloudinaryConfigPdfs");

// route for submitting an assignment
router.post(
    "/submit",
    authMiddleware,
    uploadPDF.single("pdfFile"),
    async (req, res) => {
        const { assignmentId, studentId } = req.body;

        try {
            // Check if the assignment exists
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment)
                return res.status(404).json({ error: "Assignment not found" });

            // Check if the student exists
            const student = await User.findById(studentId);
            if (!student)
                return res.status(404).json({ error: "Student not found" });

            student.auraPoints += rewardfunc(assignment.dueDate, Date.now());
            student.xp += rewardfunc(assignment.dueDate, Date.now());

            // calculate next level threshold
            const nextLevelPoints = 100 * (student.level + 1) ** 2;

            // Check if user qualifies for a level up
            if (student.xp >= nextLevelPoints) {
                student.level += 1; // Level up
                console.log(
                    `Congratulations! ${student.name} reached Level ${student.level}`
                );
            }

            // save the changes
            await student.save();

            const pdfLink = req.file ? req.file.path : null;
            if (!pdfLink) {
                return res
                    .status(400)
                    .json({ message: "PDF file is required" });
            }

            // Create a new submission
            const submission = new Submission({
                assignmentId,
                studentId,
                fileLink: pdfLink,
                status: "submitted",
            });
            await submission.save();

            res.status(201).json({
                message: "Submission successful",
                submission,
            });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

// route for fetching all submissions for a specific assignment (will return the name of the students who have submitted the given assignment)
router.get("/assignment/:id/submissions", async (req, res) => {
    try {
        const submissions = await Submission.find({
            assignmentId: req.params.id,
        }).populate({
            path: "studentId",
            select: "name",
        });

        if (!submissions.length) {
            return res.status(404).json({
                error: "No submissions found for this assignment",
            });
        }

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route for marking a submission as checked by adding feedback
router.put("/submission/:id/feedback", async (req, res) => {
    const { studentId, assignmentId, feedback, grade } = req.body; // Feedback and optional grade

    try {
        // Find the submission by ID
        const submission = await Submission.findById(req.params.id);
        if (!submission)
            return res.status(404).json({ error: "Submission not found" });

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment)
            return res.status(404).json({ error: "Assignment not found" });
        const student = await User.findById(studentId);
        if (!student)
            return res.status(404).json({ error: "Student not found" });

        // Update the submission with feedback and optionally grade
        submission.feedback = feedback;
        if (grade !== undefined) {
            submission.grade = grade;
            // Optionally update status if graded
        }
        submission.status = "graded";
        student.auraPoints += rewardfunc(
            assignment.dueDate,
            submission.submissionDate
        );
        student.xp += rewardfunc(assignment.dueDate, submission.submissionDate);
        // calculate next level threshold
        const nextLevelPoints = 100 * (student.level + 1) ** 2;

        // Check if user qualifies for a level up
        if (student.xp >= nextLevelPoints) {
            student.level += 1; // Level up
            student.xp = 0; // reset the xp every level
            console.log(
                `Congratulations! ${student.name} reached Level ${student.level}`
            );
        }

        // save the changes
        await student.save();

        await submission.save();

        res.status(200).json({
            message: "Feedback added successfully",
            submission,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// get all the submissions done by a student
router.get("/submissions/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        const submissions = await Submission.find({ studentId }).populate(
            "assignmentId"
        );

        if (!submissions) {
            return res
                .status(404)
                .json({ message: "No submissions found for this student." });
        }

        // take care of the null condition

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error retrieving submissions:", error);
        res.status(500).json({
            message: "Server error, please try again later.",
        });
    }
});

// routes to handle submissions for challenge
router.get("/challenge_submission/:studentId/:assgn_id", async (req, res) => {
    //
    const { studentId, assgn_id } = req.params;

    const submission = await Submission.find({ studentId }).populate(
        "assignmentId"
    );

    submission.forEach((item) => {
        if (item._id == assgn_id) {
            // the student already submitted this assignment
        }
    });
});

module.exports = router;
