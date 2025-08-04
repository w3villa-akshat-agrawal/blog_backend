const axios = require("axios");

const sendSms = async (data) => {
  try {
    const smsUrl = "https://blog-optservice.onrender.com/api/otp/send"; // 👈 directly used
    console.log("🔗 Sending OTP to:", smsUrl);
    console.log("📤 With data:", data);

    const response = await axios.post(smsUrl, data);
    console.log("✅ OTP service responded:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Failed to send OTP:", error.message);
    throw error;
  }
};

module.exports = sendSms;
