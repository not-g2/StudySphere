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


// deleting an announcement
router.delete("/delete/:announcementId",authMiddleware,async(req,res)=>{
    try{
        const {announcementId}=req.params;
        const {courseId}=req.body;

        const announcement = await Announcement.findOne({ _id: announcementId, course: courseId });

        if(!announcement){
            return res.status(404).json({ message: "Announcement not found in this course" });
        }
        await Announcement.findByIdAndDelete(announcementId);

        res.status(200).json({ message: "Announcement deleted successfully" });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            msg : "Server Error"
        })
    }
})

module.exports = router;
