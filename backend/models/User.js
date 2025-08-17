// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 60,
    },
    email: {
        type: String,
        required: true,
        unique: true, // No two users can have the same email
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        maxlength: 400,
    },
    role: {
        type: String,
        enum: ['Normal User', 'Store Owner', 'System Administrator'],
        default: 'Normal User',
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// This function runs automatically before a user document is saved.
// It hashes the password so we never store it as plain text.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// We add a method to our model to easily compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;