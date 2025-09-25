const express = require("express");
const router = express.Router();
const razorpayInstance = require("../controller/razorpay");
const crypto = require("crypto");

// Endpoint to create an order
router.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const option = {
      amount: amount * 100, // convert amount to smallest currency unit
      currency: currency || "INR",
    };

    const order = await razorpayInstance.orders.create(option);
    res
      .status(200)
      .json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // console.log("body: " + body + "expectedSignature: " + expectedSignature)

/* Read this to understand the 35-39 lines of code
This code snippet implements payment verification using HMAC (Hash-based Message Authentication Code) cryptography to ensure the authenticity of a Razorpay payment callback. This is a critical security step that prevents fraudulent payment confirmations.

The first line creates a payload string by concatenating the razorpay_order_id and razorpay_payment_id with a pipe (|) character as a delimiter. This specific format is required by Razorpay's verification protocol. The pipe acts as a separator between the two IDs, creating a standardized message format that both your server and Razorpay can agree upon.

The second part generates an expected signature using the HMAC-SHA256 algorithm. Here's how it works step-by-step: First, crypto.createHmac("sha256", process.env.KEY_SECRET) initializes an HMAC generator using the SHA-256 hashing algorithm and your Razorpay webhook secret key. Then, .update(body.toString()) feeds the concatenated ID string into the HMAC generator. Finally, .digest("hex") produces the final signature as a hexadecimal string.

This expected signature will be compared against the signature that Razorpay sends in the webhook payload (razorpay_signature). If they match, it proves that the payment notification genuinely came from Razorpay and hasn't been tampered with during transmission. This verification prevents attackers from sending fake payment success notifications to your server, which could otherwise result in unauthorized access to paid content or services.

*/

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified - save to database, update order status, etc.
      console.log("Payment verified successfully");

      // Here you can:
      // 1. Save payment details to database
      // 2. Update order status
      // 3. Send confirmation emails
      // 4. Any other business logic

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
