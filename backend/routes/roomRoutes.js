const express = require('express');
const router = express.Router();
const Room = require('../models/roomSchema');
const User = require('../models/userModel');

// create a new study route 
router.post('/rooms', async (req, res) => {
    try {
        const { title, participants } = req.body;
        const room = new Room({
            title,
            participants,
            currentSession: 'study',
            timerStatus: 'paused',
            xpLeaderboard: participants.map(userId => ({ user: userId, xp: 0 }))
        });
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room' });
    }
});

// join an existing room
router.post('/rooms/join/:roomId', async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { userId } = req.body;
        const room = await Room.findById(roomId);

        if (room) {
            if (!room.participants.includes(userId)) {
                room.participants.push(userId);
                room.xpLeaderboard.push({ user: userId, xp: 0 });
            }
            await room.save();
            res.status(200).json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error joining room' });
    }
});

//Update the timer (start, pause, reset)
router.post('/rooms/:roomId/timer', async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { action } = req.body;

        const room = await Room.findById(roomId);

        if (!room) return res.status(404).json({ message: 'Room not found' });

        switch (action) {
            case 'start':
                room.timerStatus = 'active';
                break;
            case 'pause':
                room.timerStatus = 'paused';
                break;
            case 'reset':
                room.timerStatus = 'paused';
                room.currentSession = 'study';
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }

        await room.save();
        // Emit real-time updates using socket.io
        req.app.get('io').to(roomId).emit('timerStatusChanged', room.timerStatus);

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error updating timer status' });
    }
});
