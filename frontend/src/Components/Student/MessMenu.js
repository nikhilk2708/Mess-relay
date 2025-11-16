import React, { useState, useEffect } from 'react';
import axios from 'axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MessMenuViewer = () => {
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://mess-relay--sigma.vercel.app/messmenu');
      const menusData = response.data.reduce((acc, menu) => {
        acc[menu.day] = menu.meals;
        return acc;
      }, {});
      setMenus(menusData);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mess Menu</h1>
      {loading && <p>Loading...</p>}
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">{day}</h2>
          <div className="grid grid-cols-4 gap-4">
            {['morning', 'noon', 'evening', 'night'].map((mealTime) => (
              <div key={mealTime}>
                <p className="mb-1 font-semibold capitalize">{mealTime}</p>
                <p>{menus[day]?.[mealTime] || 'Not set'}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessMenuViewer;
