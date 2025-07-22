const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { subscriptionService } = require('../services/subscriptionService'); // your logic

// 🧠 Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Create Razorpay Order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_order_${Math.random() * 1000}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // ✅ Send both order and key_id to frontend
    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY, // This is needed on frontend Razorpay config
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
});


// ✅ Verify Payment + Update DB (custom logic)
router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planId, period } = req.body;
  console.log("userId from razor pay",userId)
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // Signature is valid ⇒ update subscription logic
    await subscriptionService(userId, { planId, period });

    return res.status(200).json({ success: true, message: 'Payment verified and subscription updated' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});


// ✅ (Optional) Other routes like `/createpayment`
router.post('/createpayment', async (req, res) => {
  // Your custom logic if any — e.g., record unpaid intent, log, etc.
  res.status(200).json({ message: 'This is a placeholder route for createpayment' });
});


module.exports = router;
