const express = require('express');
const router = express.Router();
const {getExpensesByYear,saveExpense,editExpense } = require('../Controllers/ExpenseController.js');
const { authenticateUser } = require('../Middleware/Auth.js');

// Middleware to authenticate requests
 router.use(authenticateUser);

// Routes with authentication middleware
router.get('/:year', getExpensesByYear);
router.post('/', saveExpense);
router.put('/:id', editExpense);

module.exports = router;
