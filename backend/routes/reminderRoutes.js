const express = require("express");
const mongoose = require("mongoose");
const Reminder = require("../models/reminderSchema");
const authMiddleware = require("../middleware/auth")
const router = express.Router();

//route to retrieve all reminders for a user
router.get("/reminders/:userId",authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const reminders = await Reminder.find({ userId });
        res.status(200).json(reminders);
    } catch (err) {
        console.error("Error fetching reminders:", err);
        res.status(500).json({ message: "Server error" });
    }
});

//route to create a new reminder
router.post("/reminders",authMiddleware, async (req, res) => {
    try {
        const { userId, name, description, startdate, enddate } = req.body;

        const newReminder = new Reminder({
            userId,
            name,
            description,
            startdate,
            enddate,
        });
        await newReminder.save();
        res.status(201).json(newReminder);
    } catch (err) {
        console.error("Error creating reminder:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// route to delete a reminder (works , checked on postman)
router.delete("/delreminder/:reminderid",authMiddleware,async(req,res)=>{
    try{
        const {reminderid} = req.params;
        
        const reminder = await Reminder.findOneAndDelete({
            _id : reminderid , userId : req.user.userID
        });
        if(!reminder){
            return res.status(404).json({
                message : "Reminder does not exist!"
            })
        }
        return res.status(200).json({
            message : "Reminder successfully deleted"
        })

    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

module.exports = router;
