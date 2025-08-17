// backend/models/Store.js

const mongoose = require('mongoose');

// NEW: Define a schema for individual ratings
const ratingSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Creates a reference to the User model
    },
  },
  {
    timestamps: true,
  }
);

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
    // NEW: Add fields to store and calculate ratings
    ratings: [ratingSchema],
    numRatings: {
        type: Number,
        required: true,
        default: 0,
    },
    averageRating: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;