const express = require('express');
const User = require('../models/user');
const Booking = require('../models/booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware'); // Import roleMiddleware

const router = express.Router();

// Secret Key for JWT
const SECRET_KEY = process.env.JWT_SECRET || 'secret123';

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Booking route (requires provider role)
router.post('/book', authMiddleware, roleMiddleware(['provider']), async (req, res) => {
  const { serviceProviderId, service, date, time } = req.body;

  try {
    // Create a new booking
    const newBooking = new Booking({
      user: req.user.id,
      serviceProviderId,
      service,
      date,
      time,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Register a new user with role
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    console.log('Registering user with:', req.body); // Log the incoming request

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ firstName, lastName, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (requires authentication)
router.put('/profile/:id', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const { firstName, lastName, servicesOffered, availability, pricing } = req.body;

    console.log('Updating profile with:', req.body); // Log the incoming request

    let updatedFields = {
      firstName,
      lastName,
      servicesOffered,
      availability,
      pricing,
    };

    if (req.file) {
      updatedFields.profilePicture = `/uploads/${req.file.filename}`; // Ensure the correct path
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error); // Log the error
    res.status(500).json({ message: 'Error updating profile' });
  }
});


// Login a user and send role information
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: 'Login successful',
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      role: user.role,  // Send role information to frontend
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch the current logged-in user
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for the logged-in user (requires authentication)
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard access (requires admin role)
router.get('/admin/dashboard', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.status(200).json({ message: 'Admin dashboard content' });
});

// Provider dashboard access (requires provider role)
router.get('/provider/dashboard', authMiddleware, roleMiddleware(['provider']), (req, res) => {
  res.status(200).json({ message: 'Provider dashboard content' });
});

// Logout a user
router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.json({ message: 'Logout successful' });
});

module.exports = router;
