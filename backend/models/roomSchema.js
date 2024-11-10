const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    currentSession: { 
        type: String,
        enum: ['study', 'break'],
        default: 'study'
    },
    timerStatus: { 
        type: String, 
        enum: ['active', 'paused', 'ended'],
        default: 'paused'
    },
    sessionDuration: {
        study: { type: Number, default: 25 }, // in minutes
        break: { type: Number, default: 5 }
    },
    xpLeaderboard: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        xp: { type: Number, default: 0 }
    }]
});

const Room = mongoose.model('Room', roomSchema);
