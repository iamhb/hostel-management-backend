const express = require('express');
const router = express.Router();
const RoomAllocation = require('../models/mRoomAllocation');

// Create a new room allocation
router.post('/create', async (req, res) => {
    try {
        const { roomId, customerId, checkInDate, checkOutDate, status, occupancyCount } = req.body;

        // Validate input
        if (!roomId || !customerId || !checkInDate || !checkOutDate || !status || !occupancyCount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new room allocation record
        const newRoomAllocation = new RoomAllocation({
            roomId,
            customerId,
            checkInDate,
            checkOutDate,
            status,
            occupancyCount,
        });

        const savedRoomAllocation = await newRoomAllocation.save();

        return res.status(200).json({ message: 'Room allocation created successfully', data: savedRoomAllocation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
