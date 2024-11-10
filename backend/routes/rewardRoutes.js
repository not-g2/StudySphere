const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Reward = require('../models/rewardSchema');
const User = require('../models/userModel');
// create a reward
router.post('/rewards',authMiddleware, async (req, res) => {
    try {
        const reward = new Reward(req.body); // give values to all the parameters in the rewardSchema
        await reward.save();
        res.status(201).json({ message: 'Reward created successfully', reward });
    } catch (error) {
        res.status(500).json({ error: 'Error creating reward' });
    }
});

//Get All Active Rewards
router.get('/rewards',authMiddleware, async (req, res) => {
    try {
        const filter = { isActive: true };
        if (req.query.type) filter.type = req.query.type;
        const rewards = await Reward.find(filter);
        res.status(200).json({ rewards });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rewards' });
    }
});

//Get Reward by ID
router.get('/rewards/:id', async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id);
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json({ reward });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reward' });
    }
});

//Update a Reward
router.put('/rewards/:id', async (req, res) => {
    try {
        const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json({ message: 'Reward updated successfully', reward });
    } catch (error) {
        res.status(500).json({ error: 'Error updating reward' });
    }
});

// delete a reward
router.delete('/rewards/:id', async (req, res) => {
    try {
        const reward = await Reward.findByIdAndDelete(req.params.id);
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting reward' });
    }
});

// redeema reward
router.post('/rewards/redeem/:id', async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id);
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        
        // Fetch user and validate auraPoints (assuming user ID in request body)
        const user = await User.findById(req.body.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.auraPoints < reward.reqPoints) {
            return res.status(400).json({ error: 'Not enough aura points to redeem this reward' });
        }
        
        // Deduct aura points and update user rewards
        user.auraPoints -= reward.reqPoints;
        user.rewards.push(reward._id);
        await user.save();

        res.status(200).json({ message: 'Reward redeemed successfully', user ,
            coupon_id : 'X9A7YZ3P2W'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error redeeming reward' });
    }
});

module.exports = router;
