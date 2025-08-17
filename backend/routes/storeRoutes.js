// backend/routes/storeRoutes.js

const express = require('express');
const router = express.Router();
// UPDATE THE IMPORT
const { createStore, getStores, createStoreRating } = require('../controllers/storeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createStore)
  .get(protect, getStores);

// NEW ROUTE for submitting/updating a rating for a specific store
router.route('/:id/ratings').post(protect, createStoreRating);

module.exports = router;