// models/MessMenu.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  Morning: { type: String, default: '' },
  Noon: { type: String, default: '' },
  Evening: { type: String, default: '' },
  Night: { type: String, default: '' },
});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  meals: mealSchema,
});

const messMenuSchema = new mongoose.Schema({
  hostel: { type: String, required: true },  // Identifies which hostel the menu belongs to
  days: [daySchema]  // Array of meal plans for each day of the week
});

const MessMenu = mongoose.model('MessMenu', messMenuSchema);

module.exports = MessMenu;
