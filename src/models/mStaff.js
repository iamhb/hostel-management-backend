let mongoose = require('mongoose');

let staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18, // Assuming minimum age requirement is 18
    },
    adhar: {
        type: String,
        required: true,
        unique: true, // Assuming the Adhar number should be unique
    },
    address: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Assuming mobile number is a 10-digit number
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        default: true,
    }
});

staffSchema.set('timestamps', true);

module.exports = mongoose.model('Staff', staffSchema, 'staff');
