import axios from "axios";
import { useEffect, useState } from "react";

const PaymentButton = (props) => {
  const [amount, setAmount] = useState(0);

  // ✅ CORRECT - useEffect at component level to set initial amount
  useEffect(() => {
    if (props.price) {
      setAmount(props.price);
    }
  }, [props.price]);

  // ✅ CORRECT - Regular async function for payment handling
  const handlePayment = async () => {
    try {
      // Create order via backend
      const res = await axios.post(
        "http://localhost:4000/api/payment/create-order",
        { amount: amount, currency: "INR" }
      );

      console.log(res);

      const { id: order_id, amount: orderAmount, currency } = res.data.data;

      // Set up RazorPay options
      const options = {
        key: "rzp_test_RLjgLce5uoQGuF",
        amount: orderAmount,
        currency: currency,
        name: "Yash's Razorpay",
        description: "Do payment asap",
        order_id: order_id,
        handler: async (response) => {
          // Verify payment on backend
          console.log("response: ", response);
          try {
            // ✅ CORRECT - Regular async call, not useEffect
            const verifyres = await axios.post(
              "http://localhost:4000/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            console.log("VerifyRes: ", verifyres);
            if (verifyres.data.success) {
              alert(
                `Payment Successful and Verified! Payment ID: ${response.razorpay_payment_id}`
              );
              // Redirect to success page or update UI
            } else {
              alert("Payment verification failed!");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Ram Kumar",
          email: "ram@gmail.com",
          contact: "9452636852",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.log(err);
      alert("Failed to create order. Please try again.");
    }
  };

  return <button className="payment-button" onClick={handlePayment}>Pay Now</button>;
};

export default PaymentButton;