const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { BadRequestError, InternalServerError } = require('../utils/errorHandler');

// Create a new user
exports.createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

// Get user by email and validate password
exports.getUserByEmail = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new BadRequestError('Invalid password');
  }

  return user;
};

// Get user by ID
exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError('User not found');
  }
  return user;
};
