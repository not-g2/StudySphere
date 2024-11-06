const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Announcement = require("../models/announcementSchema");

router.get("/:courseID", authMiddleware, async (req, res) => {
    try {
        const announcements = await Announcement.find({
            course: req.params.courseID,
        });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch announcements" });
    }
});

module.exports = router;
