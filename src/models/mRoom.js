let mongoose = require('mongoose');

let roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
    },
    roomSize: {
        type: String,
    },
    bedSize: {
        type: String,
    },
    maxOccupancy: {
        type: Number,
        required: true,
    },
    isAcAvailable: {
        type: Boolean,
        default: true,
    },
    rentPerDay: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

roomSchema.set('timestamps', true);

module.exports = mongoose.model('Room', roomSchema, 'rooms');
