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

// Edit customers
router.post('/edit', async (req, res) => {
    try {
        const { id, name, age, adhar, address, mobile, email } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({ error: 'Customer ID is required.' });
        }

        // Validate optional fields
        const updateFields = {};
        if (name) updateFields.name = name;
        if (age) updateFields.age = age;
        if (adhar) updateFields.adhar = adhar;
        if (address) updateFields.address = address;
        if (mobile) updateFields.mobile = mobile;
        if (email) updateFields.email = email;

        // Update the customer document in the database
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // Returns the updated document
        );

        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        // Send the response
        res.status(200).json(updatedCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
