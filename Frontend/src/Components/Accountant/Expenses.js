import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = () => {
  const [year, setYear] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedExpense, setEditedExpense] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`https://mess-relay--sigma.vercel.app/expenses/${year}`);
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    if (year) {
      fetchExpenses();
    }
  }, [year]);

  const handleEdit = (expense) => {
    setEditMode(true);
    setEditedExpense({ ...expense });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`https://mess-relay--sigma.vercel.app/expenses/${editedExpense._id}`, editedExpense);
      console.log('Expense updated:', response.data);

      const updatedExpenses = expenses.map(exp => {
        if (exp._id === editedExpense._id) {
          return editedExpense;
        }
        return exp;
      });
      setExpenses(updatedExpenses);

      setEditMode(false);
      setEditedExpense({});
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedExpense = { ...editedExpense };
    if (name === 'total') {
      updatedExpense.total = value;
    } else {
      updatedExpense.categories = {
        ...updatedExpense.categories,
        [name]: Number(value)
      };
      updatedExpense.total = Object.values(updatedExpense.categories).reduce((acc, curr) => acc + curr, 0);
    }
    setEditedExpense(updatedExpense);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Expenses for Year {year}</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 px-3 py-2 mr-2 w-1/2 focus:outline-none focus:border-blue-500 rounded-md"
        />
        <button
          onClick={() => setYear(year)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
        >
          Search
        </button>
      </div>

      {expenses.length > 0 ? (
        <div>
          {expenses.map((expense) => (
            <div key={expense._id} className="border border-gray-300 rounded-md p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Month:</strong> {expense.month}</p>
                </div>
                <div>
                  <p><strong>Vegetable:</strong> {expense.categories?.vegetable}</p>
                </div>
                <div>
                  <p><strong>Fruits:</strong> {expense.categories?.fruits}</p>
                </div>
                <div>
                  <p><strong>Provisions:</strong> {expense.categories?.provisions}</p>
                </div>
                <div>
                  <p><strong>Other:</strong> {expense.categories?.other}</p>
                </div>
                <div>
                  <p><strong>Total:</strong> {expense.total}</p>
                </div>
              </div>
              <div className="flex justify-end">
                {editMode && editedExpense._id === expense._id ? (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="month"
                      value={editedExpense.month || ""}
                      onChange={handleChange}
                      className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md"
                    />
                    <input
                      type="number"
                      name="vegetable"
                      value={editedExpense.categories?.vegetable || ""}
                      onChange={handleChange}
                      className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md"
                    />
                    <input
                      type="number"
                      name="fruits"
                      value={editedExpense.categories?.fruits || ""}
                      onChange={handleChange}
                      className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md"
                    />
                    <input
                      type="number"
                      name="provisions"
                      value={editedExpense.categories?.provisions || ""}
                      onChange={handleChange}
                      className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md"
                    />
                    <input
                      type="number"
                      name="other"
                      value={editedExpense.categories?.other || ""}
                      onChange={handleChange}
                      className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md"
                    />
                    <input
                      type="number"
                      name="total"
                      value={editedExpense.total || 0}
                      onChange={handleChange}
                      readOnly
                      className="border border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-500 rounded-md"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(expense)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No expenses found for the year {year}</p>
      )}
    </div>
  );
};

export default Expenses;
