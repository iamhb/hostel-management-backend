const mongoose = require('mongoose');

const maintenanceRequestLogSchema = new mongoose.Schema({
    maintenanceRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceRequest', // Reference to the MaintenanceRequest model
        required: true,
    },
    logs: [
        {
            status: {
                type: String,
                enum: ['open', 'in progress', 'hold', 'resolved'], // Allowed statuses
                required: true,
            },
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff', // Reference to the Staff model
                default: null, // Empty on the first entry
            },
            staffComments: {
                type: String,
                default: '',
            },
            customerComments: {
                type: String,
                default: '',
            },
            assignedStaffId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff', // Reference to the Staff model for assignment
                default: null,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequestLog', maintenanceRequestLogSchema, 'maintenanceRequestLogs');