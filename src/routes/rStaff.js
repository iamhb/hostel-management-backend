const express = require('express');
const Staff = require('../models/mStaff');

const router = express.Router();

// Create Staff API (POST)
router.post('/create', async (req, res) => {
    try {
        const { name, age, adhar, address, mobile, email, isActive } = req.body;

        // Validate required fields
        if (!name || !age || !adhar || !address || !mobile || !email) {
            return res.status(400).json({ error: 'All fields except password are required.' });
        }

        // Set default password
        const password = "Welcome@123";

        // Create a new Staff document
        const staff = new Staff({
            name,
            age,
            adhar,
            address,
            mobile,
            email,
            isActive,
            password,
        });

        // Save to the database
        const savedStaff = await staff.save();

        // Send the response
        res.status(200).json(savedStaff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all staff API (GET)
router.post('/getAll', async (req, res) => {
    try {
        // Retrieve all staff from the database
        const staffMembers = await Staff.find({},{password:0});

        // Send the response
        res.status(200).json(staffMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Change password API 
router.post('/changePassword', async (req, res) => {
    try {
        const { id, oldPassword, newPassword } = req.body;

        // Validate the input
        if (!id || !oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Staff ID, old password, and new password are required.' });
        }

        // Find the staff member by ID
        const staff = await Staff.findById(id);

        // Check if staff exists
        if (!staff) {
            return res.status(404).json({ error: 'Staff not found.' });
        }

        // Check if the old password matches
        if (staff.password !== oldPassword) {
            return res.status(400).json({ error: 'Old password is incorrect.' });
        }

        // Update the password
        staff.password = newPassword;

        // Save the updated staff document
        const updatedStaff = await staff.save();

        // Send the response
        res.status(200).json({
            message: 'Password updated successfully.',
            staff: updatedStaff,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
