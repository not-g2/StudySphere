const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
    name: { type: String },
    reqPoints: { type: Number }, // number of aura points required to redeem the reward
    criteria: { type: String }, // this will tell abt the reward (like u achieved a badge becuse of consistently attending classes for 2 weeks ),
    type: {
        type: String,
        enum: ["virtual", "real-world"],
    },
    details: {
        // fields for virtual rewards (i.e. achievement)
        achievementType: {
            type: String,
            enum: ["achievement", "badge"],
            required: function () {
                return this.type === "virtual";
            },
        },

        // Fields for Real-world Rewards
        rewardType: {
            type: String,
            enum: ["discount", "campusEventAccess", "studyResource"],
            required: function () {
                return this.type === "real-world";
            },
        },
        accessDetails: {
            // could contain links, event codes, or descriptions for real-world rewards.
            type: String,
            default: "",
        },
    },
    expirationDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    picture: String,
});
module.exports = mongoose.model("Reward", rewardSchema);
