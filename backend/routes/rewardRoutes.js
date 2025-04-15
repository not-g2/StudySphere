const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Reward = require("../models/rewardSchema");
const User = require("../models/userModel");
const { upload } = require("../utils/cloudinary");
const crypto = require("crypto");

// create a reward
router.post("/rewards", authMiddleware,upload.single("picture"), async (req, res) => {
    try {
        const {name,reqPoints} = req.body;
        
        if(!name || !reqPoints){
            return res.status(400).json({
                message : "Please give the name and required points for the reward"
            })
        }

        const picture = req.file.path || null;

        const reward = new Reward({
            name,
            reqPoints,
            picture
        })

        await reward.save();

        return res.status(200).json({
            message : "reward saved successfully!"
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating reward" });
    }
});

//Get All Active Rewards
router.get("/rewards", authMiddleware, async (req, res) => {
    try {
        const rewards = await Reward.find();
        res.status(200).json({ rewards });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Error fetching rewards" 
        });
    }
});

//Get Reward by ID
router.get("/rewards/:id", async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id);
        if (!reward) return res.status(404).json({ error: "Reward not found" });
        res.status(200).json({ reward });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching reward" });
    }
});

// //Update a Reward
// router.put("/rewards/:id", async (req, res) => {
//     try {
//         const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });
//         if (!reward) return res.status(404).json({ error: "Reward not found" });
//         res.status(200).json({
//             message: "Reward updated successfully",
//             reward,
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Error updating reward" });
//     }
// });

// delete a reward
router.delete("/rewards/:id", async (req, res) => {
    try {
        const reward = await Reward.findByIdAndDelete(req.params.id);
        if (!reward) return res.status(404).json({ error: "Reward not found" });
        res.status(200).json({ message: "Reward deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting reward" });
    }
});

// redeem a reward
router.post("/rewards/redeem/:id", async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id);
        if (!reward) return res.status(404).json({ error: "Reward not found" });

        // Fetch user and validate auraPoints (assuming user ID in request body)
        const user = await User.findById(req.body.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.auraPoints < reward.reqPoints) {
            return res.status(400).json({
                error: "Not enough aura points to redeem this reward",
            });
        }

        // Deduct aura points and update user rewards
        user.auraPoints -= reward.reqPoints;
        //user.rewards.push(reward._id);
        //user.rewards.rewardId = reward._id;
        
        // calculating the user specific redeem code
        const hashInput = `${user._id}${reward._id}${Date.now()}`;
        const hash = crypto
                    .createHash("sha256")
                    .update(hashInput)
                    .digest("hex");
        //user.rewards.redeemCode = hash.slice(0,8);
        user.rewards.push({
            rewardId : reward._id,
            redeemCode : hash.slice(0,8)
        })
        await user.save();

        res.status(200).json({
            message: "Reward redeemed successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ error: "Error redeeming reward" });
    }
});

module.exports = router;
