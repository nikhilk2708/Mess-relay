// expenseController.js
const client = require('../Redis/redisClient.js'); // Import the Redis client
const Expense = require('../Models/ExpenseModel.js');
const mongoose = require('mongoose');
const getExpensesByYear = async (req, res) => {
  const { year } = req.params;
  const hostel = req.user.hostel;
  const cacheKey = `expenses:${hostel}:${year}`;

  try {
    // Check if the data is in the cache
    const cachedExpenses = await client.get(cacheKey);

    if (cachedExpenses) {
      // Return the cached data if it exists
     
      return res.json(JSON.parse(cachedExpenses));
    }

    // If not in cache, fetch from the database
    const expenses = await Expense.find({ hostel, year });
    
    // Store the result in Redis with an expiration time
    await client.setEx(cacheKey, 360, JSON.stringify(expenses)); // Cache for 1 hour
    
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};



const saveExpense = async (req, res) => {
  const { month, categories, total, year } = req.body;
  const userId = req.user._id;
  const hostel = req.user.hostel;
  
  try {
    const newExpense = new Expense({
      user: userId,
      year,
      month,
      hostel,
      categories: {
        vegetable: categories.vegetable || 0,
        fruits: categories.fruits || 0,
        provisions: categories.provisions || 0,
        other: categories.other || 0,
      },
      total,
    });

    await newExpense.save();

    // Invalidate the cache for this hostel and year
    const cacheKey = `expenses:${hostel}:${year}`;
    await client.del(cacheKey);

    res.json({ message: 'Expense saved successfully', expense: newExpense });
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
};

const editExpense = async (req, res) => {
  const { id } = req.params;
  const { year, month, categories, total } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid expense ID' });
  }

  if (!year || !month || !categories || !total) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        year,
        month,
        categories: {
          vegetable: categories.vegetable || 0,
          fruits: categories.fruits || 0,
          provisions: categories.provisions || 0,
          other: categories.other || 0,
        },
        total,
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Invalidate the cache for this hostel and year
    const cacheKey = `expenses:${req.user.hostel}:${year}`;
    await client.del(cacheKey);

    res.json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

module.exports = { getExpensesByYear, saveExpense, editExpense };  
