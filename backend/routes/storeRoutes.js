// backend/routes/storeRoutes.js

const express = require('express');
const router = express.Router();
// UPDATE THE IMPORT
const { createStore, getStores } = require('../controllers/storeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Chaining the route handlers for the same endpoint '/'
router.route('/')
  .post(protect, admin, createStore) // POST is for creating (Admin only)
  .get(protect, getStores);         // GET is for fetching (Any logged-in user)

module.exports = router;