const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/booking');
const router = express.Router();

// Create a new booking
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { serviceProviderId, service, date, time } = req.body;

    const booking = new Booking({
      user: req.user.id,  // Current logged-in user is the consumer
      serviceProviderId,  // Service provider ID
      service,
      date,
      time,
    });

    await booking.save();

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for the logged-in service provider
router.get('/bookings/provider', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ serviceProviderId: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for the logged-in consumer
router.get('/bookings/consumer', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
