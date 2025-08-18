// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
// We have not created the admin or owner routes yet, so they are removed for now.

const app = express();

// --- IMPORTANT: CORS CONFIGURATION ---
// This tells the backend to allow requests from your frontend's origin.
// If you are using Live Server, the origin might be http://127.0.0.1:5500
// If you are using `serve`, it might be http://localhost:3000
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], // Add both common origins
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
// --- END OF CORS CONFIGURATION ---

app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connection established successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RateMyStore API!' });
});

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
// We will add the admin and owner routes back later when we build them.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
});