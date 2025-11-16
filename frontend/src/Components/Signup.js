import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState(""); // New state for position
  const [hostel, setHostel] = useState(""); // New state for hostel
  const [registrationNumber, setRegistrationNumber] = useState(""); // New state for registration number

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Corrected password regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    // Validate password strength
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be at least 8 characters long, include one uppercase, one lowercase letter, one number, and one special character."
      );
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/user/register",
        {
          name,
          email,
          password,
          position,
          hostel,
          registrationNumber, // Include registration number in the POST request
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log(response.data);
      toast.success("Signup successful!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className="flex h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/1191080960/photo/traditional-turkish-breakfast-and-people-taking-various-food-wide-composition.jpg?s=612x612&w=0&k=20&c=PP5ejMisEwzcLWrNmJ8iPPm_u-4P6rOWHEDpBPL2n7Q=')`,
        }}
      >
        <div className="m-auto w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg p-8">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-left">
              Sign up for an account
            </h2>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email address */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Position */}
              <div className="flex flex-col">
                <label
                  htmlFor="position"
                  className="text-sm font-medium text-gray-700"
                >
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select your position
                  </option>
                  <option value="student">Student</option>
                  <option value="accountant">Accountant</option>
                  <option value="chief-warden">Chief Warden</option>
                </select>
              </div>

              {/* Hostel */}
              <div className="flex flex-col">
                <label
                  htmlFor="hostel"
                  className="text-sm font-medium text-gray-700"
                >
                  Hostel
                </label>
                <select
                  id="hostel"
                  name="hostel"
                  required
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select hostel
                  </option>
                  <option value="svbh">SVBH</option>
                  <option value="raman-hostel">Raman Hostel</option>
                  <option value="new-hostel">New Hostel</option>
                </select>
              </div>

              {/* Registration Number (only for students) */}
              {position === "student" && (
                <div className="flex flex-col">
                  <label
                    htmlFor="registration-number"
                    className="text-sm font-medium text-gray-700"
                  >
                    Registration Number
                  </label>
                  <input
                    id="registration-number"
                    name="registration-number"
                    type="text"
                    autoComplete="off"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter registration number"
                  />
                </div>
              )}

              {/* Password */}
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter confirm password"
                />
              </div>

              {/* Submit Button */}
              <div className="flex">
                <button
                  type="submit"
                  className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>

            {/* Already have an account link */}
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
