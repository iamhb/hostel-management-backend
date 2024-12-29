const express = require('express');
const mMaintenanceRequestLog = require('../models/mMaintenanceRequestLog');
const mRoom = require('../models/mRoom');
const mRoomAllocation = require('../models/mRoomAllocation');
const _ = require('lodash');
const router = express.Router();


// Get maitenance request status count
router.post('/maintenanceStatusCount', async (req, res) => {
    try {
        let chartData = [
            ["Status", "Count"],
        ]
        /**
         * [
            ["Status", "Count"],
            ["Pending", 10],
            ["In Progress", 5],
            ["Resolved", 15],
        ];
         */

        const maintenanceRequest = await mMaintenanceRequestLog.find({}, {}, { lean: true });
        let recentLog = [];

        maintenanceRequest.forEach(eachMaintenanceRequest => {
            const logs = _.orderBy(eachMaintenanceRequest['logs'], 'createdAt', 'desc');
            recentLog.push(logs[0]);
        });
        const grpdRecentLogByStatus = _.groupBy(recentLog, 'status');

        Object.keys(grpdRecentLogByStatus).forEach(eachStatus => {
            chartData.push(
                [eachStatus.toLocaleUpperCase(), grpdRecentLogByStatus[eachStatus].length],
            )
        });

        res.status(200).send({
            // message: 'Rooms retrieved successfully.',
            chartData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Get all rooms booking status
router.post('/roomBookingCount', async (req, res) => {
    try {
        let chartData = [
            ["Status", "Count"],
        ];

        let allocationStatus = [];
        /**
         * [
            ["Status", "Count"],
            ["Pending", 10],
            ["In Progress", 5],
            ["Resolved", 15],
        ];
         */

        // Fetch all rooms
        const rooms = await mRoom.find({}, {}, { lean: true });
        const roomAllocationList = await mRoomAllocation.find({}, {}, { lean: true });

        const grpdAllocationByRoomId = _.groupBy(roomAllocationList, 'roomId');
        rooms.forEach(eachRoom => {
            eachRoom['allocation'] = {};
            let eachRoomsAllocation = grpdAllocationByRoomId[eachRoom._id];
            if (eachRoomsAllocation && eachRoomsAllocation.length) {
                eachRoomsAllocation = _.orderBy(eachRoomsAllocation, '_id');
                eachRoom['allocation'] = eachRoomsAllocation[0];

                const { status } = eachRoomsAllocation[0];
                allocationStatus.push({ status })

            } else {
                allocationStatus.push({
                    'status': 'open',
                });
            }
        });

        const grpdByStatus = _.groupBy(allocationStatus, 'status');

        Object.keys(grpdByStatus).forEach(eachStatus => {
            chartData.push(
                [eachStatus.toLocaleUpperCase(), grpdByStatus[eachStatus].length],
            )
        });

        res.status(200).send({
            chartData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


router.post('/roomCategoryCount', async (req, res) => {
    /**
     * [
        ["Status", "Count"],
        ["Pending", 10],
        ["In Progress", 5],
        ["Resolved", 15],
    ];
    */
    try {
        let chartData = [
            ["Status", "Count"],
        ];

        let allocationStatus = [];
        const rooms = await mRoom.find({}, {}, { lean: true });
        const grpdRoomsByRoomSize = _.groupBy(rooms, 'roomSize');

        Object.keys(grpdRoomsByRoomSize).forEach(eachRoomSize => {
            chartData.push(
                [eachRoomSize.toLocaleUpperCase(), grpdRoomsByRoomSize[eachRoomSize].length],
            )
        });

        res.status(200).send({
            chartData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/revenue', async (req, res) => {
    try {
        const chartData = [
            ["Category", "Amount"],
            ["Rent", 5000],
            ["Utilities", 1500],
            ["Additional Charges", 700],
        ];
        res.status(200).send({
            chartData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});



module.exports = router;
