const express = require("express");
const mongoose = require("mongoose");
const Reminder = require("../models/reminderSchema");

const router = express.Router();

//route to retrieve all reminders for a user
router.get("/reminders/:userId", async (req, res) => {
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
router.post("/reminders", async (req, res) => {
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

module.exports = router;
