const jwt = require('jsonwebtoken');
const { secretKey, jwtExpiry } = require('../config');
const userService = require('../services/userService');
const { BadRequestError, InternalServerError } = require('../utils/errorHandler');

// Register user
exports.register = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Login user and set JWT
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email, password);

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: jwtExpiry });

    // Set token in cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600 * 1000 });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Get logged in user
exports.getUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new BadRequestError('User not logged in');
    }

    const decoded = jwt.verify(token, secretKey);
    const user = await userService.getUserById(decoded.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Logged out successfully' });
};
