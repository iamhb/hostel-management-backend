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
        const rooms = await Room.find({ isActive: true });

        res.status(200).json({
            message: 'Rooms retrieved successfully.',
            rooms,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/edit', async (req, res) => {
    const { id, roomName, roomSize, bedSize, maxOccupancy, isAcAvailable, rentPerDay, isActive } = req.body;

    // Validate if the ID is provided
    if (!id) {
        return res.status(400).json({ error: "Room ID is required for editing." });
    }

    try {
        // Find the room by ID and update it with the provided details
        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            {
                roomName,
                roomSize,
                bedSize,
                maxOccupancy,
                isAcAvailable,
                rentPerDay,
                isActive,
            },
            { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators` ensures schema validation
        );

        if (!updatedRoom) {
            return res.status(404).json({ error: "Room not found with the provided ID." });
        }

        res.status(200).json({ message: "Room updated successfully.", updatedRoom });
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ error: "Internal Server Error" });
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
