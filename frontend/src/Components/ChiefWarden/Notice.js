import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {

      const response = await axios.get('http://localhost:5000/notices/getnotice');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to fetch notices. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddNotice = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const userId=localStorage.getItem('userId');
      const rsp = await axios.get(`http://localhost:5000/user/details?userId=${userId}`);
      const hostel=(rsp.data.user.hostel);
      formData.append('hostel', hostel);
     
      const response = await axios.post('http://localhost:5000/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);

      fetchNotices(); // Refresh notices after adding a new one
      setFile(null); // Reset file state
      toast.success('Notice added successfully');
    } catch (error) {
      console.error('Error adding notice:', error);
      toast.error('Failed to add notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notices/${id}`);
      fetchNotices(); // Refresh notices after deletion
      toast.success('Notice deleted successfully');
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />

      <h2 className="text-xl font-bold mb-4">Notices</h2>

      <div className="mb-4">
        {notices.length === 0 ? (
          <p className="text-gray-500">No notices available.</p>
        ) : (
          <ul className="list-disc pl-5">
            {notices.map((notice) => (
              <li key={notice._id} className="mb-2 flex justify-between items-center">
                <a 
                  href={`http://localhost:5000/${notice.file}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 underline"
                >
                  Open Notice
                </a>
                <button
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => handleDeleteNotice(notice._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add Notice</h2>
        <div className="flex items-center">
          <input type="file" onChange={handleFileChange} />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAddNotice}
            disabled={!file || loading}
          >
            {loading ? 'Adding...' : 'Add Notice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notices;
