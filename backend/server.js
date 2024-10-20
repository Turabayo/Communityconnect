const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // Add booking routes
const { handleError } = require('./utils/errorHandler');
const http = require('http');
const { Server } = require('socket.io'); // Import Socket.io

require('dotenv').config();

// Initialize the express app
const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io integration
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend port
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend port
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));  // Serve uploaded images

// Routes
app.use('/api', userRoutes);  // User-related routes
app.use('/api', bookingRoutes);  // Booking-related routes

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Listen for messages sent from the client
  socket.on('chat message', (messageData) => {
    io.emit('chat message', messageData); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  handleError(err, res);
});

// Connect to MongoDB
const PORT = process.env.PORT || 8081;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/CommunityConnect';  // Use correct DB name

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
