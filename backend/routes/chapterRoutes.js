const express = require("express");
const authMiddleware = require("../middleware/auth");
const { uploadPDF } = require("../utils/cloudinaryConfigPdfs");
const chapterModel = require("../models/chapterSchema"); // Import your model
const router = express.Router();
const generatePdfUrl = require("../utils/pdflinkhelper");

router.post(
    "/create",
    authMiddleware,
    uploadPDF.single("pdfFile"),
    async (req, res) => {
        const { title, courseID } = req.body;

        try {
            if (!req.file || !req.file.path) {
                return res.status(400).json({ message: "PDF upload failed." });
            }

            const newChapter = new chapterModel({
                title,
                course: courseID,
                chapterPdf: req.file.path,
            });

            await newChapter.save();

            res.status(201).json({
                message: "Chapter saved successfully.",
                chapter: newChapter,
            });
        } catch (error) {
            console.error("Error saving chapter:", error);
            res.status(500).json({
                message: "An error occurred while saving the chapter.",
            });
        }
    }
);

router.get("/get/:courseID", authMiddleware, async (req, res) => {
    try {
        const { courseID } = req.params;
        const chapters = await chapterModel.find({ course: courseID });
        const chaptersWithPdfUrl = chapters.map((chapter) => {
            const pdfUrl = generatePdfUrl(`pdfs/${chapter._id}`);
            return {
                ...chapter.toObject(),
                pdfUrl,
            };
        });

        res.status(200).json(chaptersWithPdfUrl);
    } catch (error) {
        console.error("Error fetching chapters:", error);
        res.status(500).json({
            message: "An error occurred while fetching chapters.",
        });
    }
});

module.exports = router;
