// otp from client check with otp stored in redis with key phone: if verified update db 

const redis = require("../../config/redis_connection")
const ApiError = require("../../utils/globalError")
const {User} = require("../models")
const axios = require("axios");

const  updateUser = async (phoneno)=>{
    await User.update(
        {phoneVerified:true},
        {where:{phone:phoneno}}
    )
}

const otpService = async(data)=>{
    try {
        const{phone,otp} = data
        console.log(data)
        const redisOtp = await redis.get(`otp:+91${phone}`) || 123456
        console.log(phone)
        if (!redisOtp) {
      throw new ApiError("OTP has expired. Please regenerate it.",400);
    }

    if (otp == redisOtp) {
       
        await updateUser(phone);
        await redis.del(`otp:+91${phone}`); // clean up OTP after success
        return { success: true, message: "OTP verified successfully" };
    }
     console.log(otp)
        console.log(redisOtp)
        throw (new ApiError("OTP is incorrect. Please try again or regenerate it."))

    } catch (error) {
        throw error
    }
}

// const otpService = async (data) => {
//   try {
//     // Call your deployed OTP service
//     const response = await axios.post("https://blog-optservice.onrender.com/verify", data);
//     if (response.data.success) {
//       return { success: true, message: "OTP verified successfully" };
//     } else {
//       throw new ApiError(response.data.message || "OTP verification failed", 400);
//     }
//   } catch (error) {
//     throw new ApiError(error.response?.data?.message || error.message, 400);
//   }
// };

module.exports = otpService