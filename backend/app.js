const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // Add booking routes
const { handleError } = require('./utils/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend server
  credentials: true, // Allow cookies with requests
}));

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api', userRoutes);  // User-related routes
app.use('/api', bookingRoutes);  // Booking-related routes

// Global error handling middleware
app.use((err, req, res, next) => {
  handleError(err, res);
});

module.exports = app;
