const express = require('express');
const mMaintenanceRequest = require('../models/mMaintenanceRequest');
const mMaintenanceRequestLog = require('../models/mMaintenanceRequestLog');
const mStaff = require('../models/mStaff');
const mRoom = require('../models/mRoom');
const _ = require('lodash');

const router = express.Router();


router.post('/create', async (req, res) => {
    try {
        const { roomId, reason, priorityLevel, staffId, category } = req.body;

        if (!roomId || !reason || !priorityLevel || !staffId) {
            return res.status(400).json({ message: 'roomId, reason, and priorityLevel are required' });
        }

        const newRequest = await mMaintenanceRequest.create({
            roomId,
            reason,
            priorityLevel,
            staffId,
            category
        });

        res.status(201).json({ message: 'Maintenance request submitted successfully', request: newRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/assignToStaff', async (req, res) => {
    try {
        const { maintenanceRequestId } = req.body;
        const { assignedStaffId, respondedBy } = req.body.logs[0];

        if (!maintenanceRequestId) {
            return res.status(400).json({ message: 'maintenanceRequestId is required' });
        }

        let logEntry = {
            status: 'in progress',
        };

        if (assignedStaffId) {
            logEntry['assignedStaffId'] = assignedStaffId;
        }

        if (respondedBy) {
            logEntry['respondedBy'] = respondedBy;
        }

        const updatedLog = await mMaintenanceRequestLog.findOneAndUpdate(
            { maintenanceRequestId },
            { $push: { logs: logEntry } },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: 'Task assigned successfully', log: updatedLog });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/logs/update', async (req, res) => {
    try {
        const { maintenanceRequestId, status, respondedBy, staffComments } = req.body;

        if (!maintenanceRequestId) {
            return res.status(400).json({ message: 'maintenanceRequestId is required' });
        }

        const logEntry = {
            status,
            respondedBy,
            staffComments,
        };

        const updatedLog = await mMaintenanceRequestLog.findOneAndUpdate(
            { maintenanceRequestId },
            { $push: { logs: logEntry } },
            { new: true }
        );

        res.status(200).json({ message: 'Request status updated successfully', log: updatedLog });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/reports', async (req, res) => {
    try {
        const requests = await mMaintenanceRequest.find();
        // .populate('logs');

        const report = requests.map(request => ({
            roomId: request.roomId,
            reason: request.reason,
            priorityLevel: request.priorityLevel,
            isSolved: request.isSolved,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            // logs: request.logs,
        }));

        res.status(200).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/getMaintaice', async (req, res) => {
    let staffIds = [];
    let roomIds = [];
    try {
        const requests = await mMaintenanceRequest.find().lean();

        requests.forEach((each) => {
            staffIds.push(each.staffId);
            roomIds.push(each.roomId);
        });

        const staffDetails = await mStaff.find(
            { _id: { $in: staffIds } },
            { name: 1 },
            { lean: true }
        );
        const roomDetails = await mRoom.find(
            { _id: { $in: roomIds } },
            { roomName: 1 },
            { lean: true }
        );


        const grpdStaffsById = _.groupBy(staffDetails, '_id');
        const grpdRoomsById = _.groupBy(roomDetails, '_id');

        requests.forEach(eachMaintenanceRequest => {

            eachMaintenanceRequest['roomName'] = '';
            if (grpdRoomsById[eachMaintenanceRequest.roomId] && grpdRoomsById[eachMaintenanceRequest.roomId].length) {
                eachMaintenanceRequest['roomName'] = grpdRoomsById[eachMaintenanceRequest.roomId][0]['roomName'];
            }

            eachMaintenanceRequest['staffName'] = '';
            if (grpdStaffsById[eachMaintenanceRequest.staffId] && grpdStaffsById[eachMaintenanceRequest.staffId].length) {
                eachMaintenanceRequest['staffName']= grpdStaffsById[eachMaintenanceRequest.staffId][0]['name'];
            }
        });


        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;