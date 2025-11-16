import React, { useState } from "react";
import axios from "axios";

const PayFees = () => {
  const [formData, setFormData] = useState({
    // name: "",
    // hostelName: "",
    // semester: "",
    // regNo: "",
    // email: "",
    amount: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (Object.values(formData).some((field) => field.trim() === "")) {
      setError("All fields are mandatory.");
      return;
    }

    try {
        const {data:{key}}=await axios.get("http://localhost:5000/payment/getkey");
      const { data:{order} } = await axios.post("http://localhost:5000/payment/checkout", {
        amount: formData.amount,
      });
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Manish bhukar",
        description: "Tutorial of RazorPay",
        image: "",
        order_id: order.id,
        callback_url: "http://localhost:5000/payment/paymentverification",
        prefill: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "9999999999"
        },
        notes: {
            "address": "Razorpay Corporate Office"
        },
        theme: {
            "color": "#121212"
        }
    };
    const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Pay Fees</h1>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>
          )}
          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="hostelName">
              Hostel Name
            </label>
            <input
              type="text"
              id="hostelName"
              name="hostelName"
              value={formData.hostelName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="semester">
              Semester
            </label>
            <input
              type="number"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="regNo">
              Registration Number
            </label>
            <input
              type="text"
              id="regNo"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Pay Fees
          </button>
        </form>
      </div>
    </div>
  );
};

export default PayFees;
