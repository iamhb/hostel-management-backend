const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room', // Reference to the Room model
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    isSolved: {
        type: Boolean,
        default: false,
    },
    customerRating: {
        type: Number,
        min: 1,
        max: 5,
    },
    priorityLevel: {
        type: String,
        enum: ['High', 'Medium', 'Low'], // Only these values are allowed
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema, 'maintenanceRequests');