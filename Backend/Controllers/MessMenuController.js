const express = require('express');
const router = express.Router();
const MessMenu = require('../Models/MessMenu.js');
const { authenticateUser } = require('../Middleware/Auth.js');

// Middleware to authenticate user
router.use(authenticateUser);

// Get all menus for the authenticated user's hostel
router.get('/get', async (req, res) => {
  try {
    const hostel = req.user.hostel; // Get the hostel from the authenticated user
    const menus = await MessMenu.findOne({ hostel });
    if (menus) {
      res.json(menus.days); // Return only the 'days' array
    } else {
      res.status(404).json({ message: 'No menus found for this hostel' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add or update menu for a specific day and hostel
router.post('/post', async (req, res) => {
  const { day, meals, hostel } = req.body; // hostel can also be derived from req.user if needed
  console.log({ day, meals, hostel });

  try {
    // Find the menu for the hostel
    const existingMenu = await MessMenu.findOne({ hostel });
     console.log(meals);
    if (existingMenu) {
      // Check if the day already exists in the 'days' array
      const dayIndex = existingMenu.days.findIndex(d => d.day === day);

      if (dayIndex !== -1) {
        // Update the meals for the existing day
        existingMenu.days[dayIndex].meals = meals;
      } else {
        // Add a new day with meals
        existingMenu.days.push({ day, meals });
      }
      await existingMenu.save();
    } else {
      // If no menu exists for the hostel, create a new entry with the day and meals
      const newMenu = new MessMenu({
        hostel,
        days: [{ day, meals }]
      });
      await newMenu.save();
    }

    res.status(200).json({ message: 'Menu updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
