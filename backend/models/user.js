const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Add 'admin' to the role enum and ensure default role is set to 'consumer'
  role: { 
    type: String, 
    enum: ['provider', 'consumer', 'admin'],  // Add 'admin' role
    required: true, 
    default: 'consumer'  // Set a default role if not provided
  },

  servicesOffered: { type: String },  // Services field
  availability: { type: String },  // Availability field
  pricing: { type: Number },  // Pricing field
  location: { type: String },  // Location for service providers
  profilePicture: { type: String, default: '/uploads/default-avatar.png' }  // Profile picture
});

// Encrypt the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
