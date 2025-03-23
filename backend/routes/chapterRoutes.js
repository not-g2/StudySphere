const express = require("express");
const authMiddleware = require("../middleware/auth");
const { uploadPDF } = require("../utils/cloudinaryConfigPdfs");
const chapterModel = require("../models/chapterSchema"); // Import your model
const router = express.Router();
const generatePdfUrl = require("../utils/pdflinkhelper");
const axios = require("axios");

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
        const chapters = await chapterModel
            .find({ course: courseID })
            .select("title _id createdAt");

        res.status(200).json(chapters);
    } catch (error) {
        console.error("Error fetching chapters:", error);
        res.status(500).json({
            message: "An error occurred while fetching chapters.",
        });
    }
});

router.get("/pdf/:chapterID", async (req, res) => {
    const { chapterID } = req.params;

    try {
        // Fetch the chapter from the database
        const chapter = await chapterModel.findById(chapterID);
        console.log(chapter, chapterID);
        if (!chapter || !chapter.chapterPdf) {
            return res.status(404).json({ message: "PDF not found." });
        }
        console.log("Fetching PDF from URL:", chapter.pdfUrl);

        const response = await axios({
            url: chapter.chapterPdf,
            method: "GET",
            responseType: "stream",
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${chapterID}.pdf"`
        );
        response.data.pipe(res);
    } catch (error) {
        console.error("Error fetching PDF:", error.message);
        res.status(500).json({ message: "Failed to retrieve the PDF." });
    }
});

module.exports = router;
