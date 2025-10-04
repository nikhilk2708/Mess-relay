const { Checkout, PaymentVerification, GetKey } = require('../Controllers/PaymentController.js');
const express = require('express');
const router = express.Router();

router.route("/checkout").post(Checkout);
router.route("/paymentverification").post(PaymentVerification);
router.route("/getkey").get(GetKey);

module.exports = router;
