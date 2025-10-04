const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Payment = require("../Models/Payment.js"); // ✅ Use the model, not the schema
dotenv.config();

const instance = new Razorpay({
  key_id: process.env.YOUR_KEY_ID,
  key_secret: process.env.YOUR_KEY_SECRET,
});

const Checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error in Checkout:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

const PaymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.YOUR_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Payment.create({
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature
      });

      return res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    }

    return res.status(400).json({ success: false });

  } catch (error) {
    console.error("Error in PaymentVerification:", error);
    return res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
};

const GetKey = async (req, res) => {
  try {
    res.status(200).json({ key: process.env.YOUR_KEY_ID });
  } catch (error) {
    console.error("Error in GetKey:", error);
    res.status(500).json({ success: false, message: "Failed to fetch key" });
  }
};

module.exports = { Checkout, PaymentVerification, GetKey };
