const express = require('express');
const Customer = require('../models/mCustomer'); 

const router = express.Router();

// Create Customer API
router.post('/create', async (req, res) => {
    try {
        const { name, age, adhar, address, mobile, email } = req.body;

        // Validate required fields
        if (!name || !age || !adhar || !address || !mobile || !email) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create a new Customer document
        const customer = new Customer({
            name,
            age,
            adhar,
            address,
            mobile,
            email,
        });

        // Save to the database
        const savedCustomer = await customer.save();

        // Send the response
        res.status(200).json(savedCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all customers API
router.post('/getAll', async (req, res) => {
    try {
        // Retrieve all customers from the database
        const customers = await Customer.find();

        // Send the response
        res.status(200).json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
