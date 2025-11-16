import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddExpense = ({ year, setExpenses, expenses }) => {
  const [newExpense, setNewExpense] = useState({
    year: '',
    month: '',
    categories: {
      vegetable: '',
      fruits: '',
      provisions: '',
      other: ''
    },
    total: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedNewExpense = { ...newExpense };
    if (name === 'total') {
      updatedNewExpense.total = value;
    } else if (name === 'year' || name === 'month') {
      updatedNewExpense[name] = value;
    } else {
      updatedNewExpense.categories = {
        ...updatedNewExpense.categories,
        [name]: value
      };
      updatedNewExpense.total = Object.values(updatedNewExpense.categories).reduce((acc, curr) => acc + Number(curr), 0);
    }
    setNewExpense(updatedNewExpense);
  };

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/expenses/`, newExpense);
      console.log('Expense added:', response.data);
      toast.success('Expense added successfully!');
      if (newExpense.year === year) {
        setExpenses([...expenses, response.data]);
      }
      setNewExpense({
        year: '',
        month: '',
        categories: {
          vegetable: '',
          fruits: '',
          provisions: '',
          other: ''
        },
        total: ''
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error adding expense');
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4">
      <Toaster />
      <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            name="year"
            placeholder="Enter year"
            value={newExpense.year}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <input
            type="text"
            name="month"
            placeholder="Enter month"
            value={newExpense.month}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vegetable</label>
          <input
            type="number"
            name="vegetable"
            placeholder="Enter vegetable expense"
            value={newExpense.categories.vegetable}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fruits</label>
          <input
            type="number"
            name="fruits"
            placeholder="Enter fruits expense"
            value={newExpense.categories.fruits}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Provisions</label>
          <input
            type="number"
            name="provisions"
            placeholder="Enter provisions expense"
            value={newExpense.categories.provisions}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other</label>
          <input
            type="number"
            name="other"
            placeholder="Enter other expense"
            value={newExpense.categories.other}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input
            type="number"
            name="total"
            placeholder="Total expense"
            value={newExpense.total}
            readOnly
            className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md w-full"
          />
        </div>
      </div>
      <button
        onClick={handleAddExpense}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none"
      >
        Add Expense
      </button>
    </div>
  );
};

export default AddExpense;
