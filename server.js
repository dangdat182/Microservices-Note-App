const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const redisClient = require('./config/redis');
const noteRoutes = require('./routes/noteRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Static files
app.use(express.static('public'));

// Routes
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
