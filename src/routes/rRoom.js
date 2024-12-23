const express = require('express');
const Room = require('../models/mRoom');

const router = express.Router();

// Create Room API (POST)
router.post('/create', async (req, res) => {
    try {
        const { roomName, roomSize, bedSize, maxOccupancy, isAcAvailable, rentPerDay, isActive } = req.body;

        // Validate required fields
        if (!roomName || !maxOccupancy || !rentPerDay) {
            return res.status(400).json({ error: 'Room name, maximum occupancy, and rent per day are required.' });
        }

        // Create a new room
        const room = new Room({
            roomName,
            roomSize,
            bedSize,
            maxOccupancy,
            isAcAvailable,
            rentPerDay,
            isActive,
        });

        // Save the room in the database
        const savedRoom = await room.save();

        res.status(200).json({
            message: 'Room created successfully.',
            room: savedRoom,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get All Rooms API (GET)
router.post('/getAll', async (req, res) => {
    try {
        // Fetch all rooms
        const rooms = await Room.find();

        res.status(200).json({
            message: 'Rooms retrieved successfully.',
            rooms,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Deactivate Room API (POST)
router.post('/deactivate', async (req, res) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({ message: 'Room ID is required' });
        }

        // Find the room and update its isActive field to false
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { isActive: false },
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({
            message: 'Room deactivated successfully',
            room: updatedRoom,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
