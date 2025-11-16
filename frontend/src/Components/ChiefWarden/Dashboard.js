import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Expenses from '../Accountant/Expenses'; // Import Expenses component (if it exists)
import ComplaintForm from '../Student/Complaint';
import ManageNotices from './Notice';
import MessMenu from './MessMenu';

const ChiefWardenDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false); // State for modal open/close
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State to track the selected complaint
  const [resolutionDescription, setResolutionDescription] = useState(''); // State for resolution description input
  const [yearInput, setYearInput] = useState(''); // State for year input
  const [expenses, setExpenses] = useState([]); // State for expenses
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    if (menuItem === 'complaints') {
      navigate('/complainstatus');
    } else if (menuItem === 'notices') {
      navigate('/notice');
    } else if (menuItem === 'expenses') {
      setExpenses([]); // Reset expenses state
      setYearInput(''); // Reset year input state
    } else if (menuItem === 'mess-menu') {
      navigate('/messmenu');
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:5000/complaints/getcomplaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`https://mess-relay--sigma.vercel.app/expenses/${yearInput}`);
      console.log(response.data);
      setExpenses(response.data);
    } catch (error) {
      console.error(`Error fetching expenses for year ${yearInput}:`, error);
    }
  };

  const handleYearInputChange = (event) => {
    setYearInput(event.target.value);
  };

  const handleFetchExpenses = () => {
    // Validate year input before fetching expenses
    const validYear = /^\d{4}$/;
    if (validYear.test(yearInput)) {
      fetchExpenses();
    } else {
      alert("Please enter a valid year (YYYY format).");
    }
  };

  const handleResolveComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setResolveModalOpen(true);
  };

  const handleSaveResolution = async () => {
    try {
      await axios.put(`http://localhost:5000/complaints/resolve/${selectedComplaint._id}`, {
        resolutionDescription
      });
      setResolveModalOpen(false);
      setResolutionDescription(''); // Reset resolution description state
      setSelectedComplaint(null); // Clear selected complaint state
      fetchComplaints(); // Fetch updated complaints list
    } catch (error) {
      console.error('Error saving resolution:', error);
    }
  };

  const handleCancelResolution = () => {
    setResolveModalOpen(false);
    setSelectedComplaint(null); // Clear selected complaint state
    setResolutionDescription(''); // Reset resolution description state
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('position');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <Sidebar selectedMenuItem={selectedMenuItem} handleMenuItemClick={handleMenuItemClick} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <MainContent
            selectedMenuItem={selectedMenuItem}
            complaints={complaints}
            expenses={expenses}
            yearInput={yearInput}
            onResolveComplaint={handleResolveComplaint}
            onYearInputChange={handleYearInputChange}
            onFetchExpenses={handleFetchExpenses}
            loading={loading}
            resolveModalOpen={resolveModalOpen}
            onResolveModalClose={() => setResolveModalOpen(false)}
            resolutionDescription={resolutionDescription}
            onResolutionDescriptionChange={(e) => setResolutionDescription(e.target.value)}
            onSaveResolution={handleSaveResolution}
            onCancelResolution={handleCancelResolution}
          />
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ selectedMenuItem, handleMenuItemClick }) => {
  return (
    <div className="bg-gray-800 text-white w-64 p-8">
      <h1 className="text-3xl font-bold mb-8">Chief Warden Dashboard</h1>
      <ul>
        <MenuItem text="Complaints" isSelected={selectedMenuItem === 'complaints'} onClick={() => handleMenuItemClick('complaints')} />
        <MenuItem text="Mess Menu" isSelected={selectedMenuItem === 'mess-menu'} onClick={() => handleMenuItemClick('mess-menu')} />
        <MenuItem text="Notices" isSelected={selectedMenuItem === 'notices'} onClick={() => handleMenuItemClick('notices')} />
        <MenuItem text="Expenses" isSelected={selectedMenuItem === 'expenses'} onClick={() => handleMenuItemClick('expenses')} />
      </ul>
    </div>
  );
};

const MenuItem = ({ text, isSelected, onClick }) => {
  return (
    <li className="mb-4">
      <button className={`block text-left text-white hover:bg-gray-700 w-full py-2 px-4 rounded shadow ${isSelected ? 'bg-gray-700' : ''}`} onClick={onClick}>
        {text}
      </button>
    </li>
  );
};

const MainContent = ({
  selectedMenuItem,
  complaints,
  expenses,
  yearInput,
  onResolveComplaint,
  onYearInputChange,
  onFetchExpenses,
  loading,
  resolveModalOpen,
  onResolveModalClose,
  resolutionDescription,
  onResolutionDescriptionChange,
  onSaveResolution,
  onCancelResolution
}) => {
  return (
    <div>
      {selectedMenuItem === 'complaints' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">All Complaints</h1>
          <ul className="space-y-4">
            {complaints.map((complaint) => (
              <li key={complaint._id} className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-semibold">{complaint.title}</h2>
                <p className="mt-2">{complaint.description}</p>
                <div className="mt-4">
                  {complaint.isResolved ? (
                    <p className="text-green-600">Resolved</p>
                  ) : (
                    <div>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                        onClick={() => onResolveComplaint(complaint)}
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedMenuItem === 'expenses' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Expenses</h1>
          <div className="mb-4">
            <input
              type="number" // Ensure input is type number
              value={yearInput}
              onChange={onYearInputChange}
              placeholder="Enter Year (YYYY)"
              className="p-2 border border-gray-400 rounded text-black"
            />
            <button
              onClick={onFetchExpenses}
              className="ml-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Fetch Expenses
            </button>
          </div>
          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses available for the selected year.</p>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">Expenses for {yearInput}</h2>
              <ul className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <li key={expense._id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-semibold">{expense.month}</span>
                        <span className="ml-2">({expense.year})</span>
                      </div>
                      <div className="flex ml-4">
                        <span className="mr-4">Vegetable: {expense.categories.vegetable}</span>
                        <span className="mr-4">Fruits: {expense.categories.fruits}</span>
                        <span className="mr-4">Provisions: {expense.categories.provisions}</span>
                        <span>Other: {expense.categories.other}</span>
                      </div>
                      <div className="font-semibold">Total: {expense.total}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {resolveModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Resolve Complaint</h2>
            <textarea
              className="w-full p-2 border border-gray-400 rounded mb-4"
              placeholder="Provide resolution description..."
              value={resolutionDescription}
              onChange={onResolutionDescriptionChange}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded mr-2"
                onClick={onCancelResolution}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={onSaveResolution}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Include other MainContent components for 'notices' and 'mess-menu' */}
    </div>
  );
};

export default ChiefWardenDashboard;
