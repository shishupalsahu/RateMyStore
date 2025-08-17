// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connection established successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RateMyStore API!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
});