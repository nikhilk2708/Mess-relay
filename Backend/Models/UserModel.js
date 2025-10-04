// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    enum: ['student', 'accountant', 'chief-warden'],
    required: true,
  },
  hostel: {
    type: String,
    enum: ['svbh', 'raman-hostel', 'new hostel', 'new-hostel'], // Update enum values here
   
  },
  registrationNumber: {
    type: String,
    required: function () {
      return this.position === 'student'; // Required only if position is 'student'
    },
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
