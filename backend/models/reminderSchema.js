const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    startdate: {
        type: Date,
    },

    enddate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp when the reminder was created
    },
});

// Create a model based on the schema
const reminderRoutes = mongoose.model("Reminder", ReminderSchema);

module.exports = reminderRoutes;
