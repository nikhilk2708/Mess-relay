const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  month: { type: String, required: true },
  hostel: { type: String }, // Added hostelname field
  categories: {
    vegetable: { type: Number, default: 0 },
    fruits: { type: Number, default: 0 },
    provisions: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  total: { type: Number, required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
