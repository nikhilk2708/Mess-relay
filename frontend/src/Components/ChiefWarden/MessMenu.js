import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MessMenu = () => {
  const [loading, setLoading] = useState(false);
  const [hostel, setHostel] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [mealInputs, setMealInputs] = useState({
    morning: '',
    noon: '',
    evening: '',
    dinner: ''
  });

  const handleInputChange = (mealTime, value) => {
    setMealInputs((prevMeals) => ({
      ...prevMeals,
      [mealTime]: value,
    }));
  };

  const handleSaveMenu = async () => {
    if (!hostel) {
      toast.error('Please select a hostel');
      return;
    }
    if (!selectedDay) {
      toast.error('Please select a day');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/messmenu/post', { hostel, day: selectedDay, meals: mealInputs });
      toast.success('Menu saved successfully');
      setMealInputs({ morning: '', noon: '', evening: '', dinner: '' }); // Clear the form after save
    } catch (error) {
      console.log({hostel,selectedDay})
      toast.error('Error saving menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Mess Menu</h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Hostel Name:</label>
        <select
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>Select Hostel</option>
          <option value="svbh">SVBH</option>
          <option value="raman-hostel">Raman Hostel</option>
          <option value="new-hostel">New Hostel</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Select Day:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>Select Day</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {['morning', 'noon', 'evening', 'dinner'].map((mealTime) => (
          <div key={mealTime}>
            <label className="block mb-1 font-semibold capitalize">{mealTime}</label>
            <input
              type="text"
              value={mealInputs[mealTime]}
              onChange={(e) => handleInputChange(mealTime, e.target.value)}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveMenu}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save Menu
      </button>
    </div>
  );
};

export default MessMenu;




