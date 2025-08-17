// backend/routes/storeRoutes.js

const express = require('express');
const router = express.Router();
const { createStore } = require('../controllers/storeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Only a logged-in System Administrator can access this route
router.route('/').post(protect, admin, createStore);

module.exports = router;