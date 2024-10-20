const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // The consumer making the booking
  serviceProviderId: { type: String, required: true },  // Service provider ID
  service: { type: String, required: true },  // The service being booked
  date: { type: String, required: true },  // Date of the booking
  time: { type: String, required: true },  // Time of the booking
  createdAt: { type: Date, default: Date.now },  // Date when the booking was created
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
