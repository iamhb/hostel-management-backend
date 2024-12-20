
let mongoose = require('mongoose');

let customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    adhar: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
});

customerSchema.set('timestamps', true);

module.exports = mongoose.model('Customer', customerSchema, 'customers');
