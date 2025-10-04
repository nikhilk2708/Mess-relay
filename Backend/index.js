const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fileUpload = require("express-fileupload");
const cors = require('cors');
const userRoutes = require('./Routes/UserRoute.js');
const complaintsRoutes = require('./Routes/ComplaintRoute.js');
const expenseRoutes = require('./Routes/ExpenseRoute.js');
const noticeRoute = require('./Routes/noticeroutes.js');
const messMenuRoutes = require('./Controllers/MessMenuController.js');
const PaymentRoute = require('./Routes/Payment.js')
dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', 
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(fileUpload());
app.use("/uploads", express.static("uploads"));
app.use("/notices", noticeRoute);
app.use("/messmenu", messMenuRoutes);
app.use('/user', userRoutes);
app.use("/complaints", complaintsRoutes);
app.use('/expenses', expenseRoutes);
app.use('/payment',PaymentRoute);


mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then((data) => {
  console.log(`Database connected with server: ${data.connection.host}`);
})
.catch((err) => {
  console.log(err);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
