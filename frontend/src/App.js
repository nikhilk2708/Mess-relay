import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import StudentDashboard from "../src/Component//Student/Frontpage";
import StudentComplaint from "../src/Component/Student/Complaint";
import ContactPage from "./Component/Student/ContactPage";
import AccountantDashboard from "../src/Component/Accountant/Dashboard";
import ComplainStatus from "../src/Component/Student/Complainstatus";
import ChiefWardenDashboard from "../src/Component/ChiefWarden/Dashboard.js";
import AddNotice from "./Component/ChiefWarden/Notice.js";
import ProtectedRoute from "./Component/ProtectedRoute.js";
import MessMenu from "./Component//Student/MessMenu.js";
import Messmenu from "./Component/ChiefWarden/MessMenu.js";
import AddExpense from "./Component/Accountant/AddExpense.js";
import { useEffect } from "react";
import axios from "axios";
import PayFees from "./Component/Student/PayFees.js";
import PaymentSuccess from "./Component/Student/PaymentSuccess.js";
function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);
  return (
    <div className="App">
     
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/studentmain" element={
            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
            } />
          <Route path="/complain" element={
            <ProtectedRoute><StudentComplaint /></ProtectedRoute>
            } />
          <Route path="/contact" element={
            <ProtectedRoute><ContactPage /></ProtectedRoute>
            } />
          <Route
            path="/accountant"
            element={
              <ProtectedRoute>
                <AccountantDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/complainstatus" element={
            <ProtectedRoute>
              <ComplainStatus />
            </ProtectedRoute>
          }
             />
          <Route path="/chiefwarden" element={<ProtectedRoute>
            <ChiefWardenDashboard />
            </ProtectedRoute>} 
            />
          <Route path="/notice" element={
            <ProtectedRoute><AddNotice /></ProtectedRoute>
            } />
          <Route path="mess-menu" element={
            <ProtectedRoute><MessMenu/></ProtectedRoute>
            } />
            <Route path="pay-fees" element={
            <ProtectedRoute><PayFees/></ProtectedRoute>
            } />
            <Route path="messmenu" element={
            <ProtectedRoute><Messmenu/></ProtectedRoute>
            } /> 
            <Route path="paymentsuccess" element={
            <ProtectedRoute><PaymentSuccess/></ProtectedRoute>
            } /> 
            <Route path="/addexpense" element={<AddExpense/>}></Route> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
