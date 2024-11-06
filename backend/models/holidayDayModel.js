const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    description: { type: String }  // Optional, for descriptions like "Christmas"
});

module.exports = mongoose.model('Holiday', HolidaySchema);
