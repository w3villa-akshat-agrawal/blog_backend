// utils/sendSms.js
const axios = require("axios");

const sendSms = async (data) => {
  try {
    const response = await axios.post(process.env.SMSURL, data);
    console.log("✅ OTP service responded:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send OTP check number please:", error.message);
    throw error;
  }
};

module.exports = sendSms;
