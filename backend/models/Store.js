// backend/models/Store.js

const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    address: {
        type: String,
        required: true,
        maxlength: 400,
    },
    // We will add ratings functionality here later
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;