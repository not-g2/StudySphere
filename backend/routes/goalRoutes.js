const express = require("express");
const router = express.Router();
const Goal = require('../models/goalModel');
const authMiddleware = require('../middleware/auth');

// Route to create a new goal
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const newGoal = new Goal({
            title,
            description,
            user: req.user.userID,  // Use userID from the authenticated user
            dueDate,
            status: 'pending',
        });

        const savedGoal = await newGoal.save();
        res.status(200).json(savedGoal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create goal' });
    }
});

// Route to get all goals for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.userID });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
});

// Route to update a goal by ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: id, user: req.user.userID },
            updates,
            { new: true }
        );

        if (!updatedGoal) return res.status(404).json({ error: 'Goal not found' });

        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update goal' });
    }
});

// Route to delete a goal by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGoal = await Goal.findOneAndDelete({ _id: id, user: req.user.userID });

        if (!deletedGoal) return res.status(404).json({ error: 'Goal not found' });

        res.status(200).json({ msg: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete goal' });
    }
});

module.exports = router;