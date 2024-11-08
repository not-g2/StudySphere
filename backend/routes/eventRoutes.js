const express = require("express");
const router = express.Router();
const Event = require("../models/eventSchema"); // Adjust path as needed
const authMiddleware = require("../middleware/auth");

// ASK THE FRONTEND DUDES IF THEY WANT TO USE AUTHMIDDLEWARE
// Route to fetch all events
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// Route to create a new event
router.post("/events", async (req, res) => {
    const { title, start, end, description, allDay } = req.body;
    try {
        const event = new Event({ title, start, end, description, allDay });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: "Failed to create event" });
    }
});

// Route to update an existing event
router.put("/events/:id", async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Failed to update event" });
    }
});

// Route to delete an event
router.delete("/events/:id", async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete event" });
    }
});

module.exports = router;
