// otp from client check with otp stored in redis with key phone: if verified update db 

const response = require("../../utils/response")
const otpService = require("../services/otpServices")


const otpController = async (req,res,next)=>{
   try {
     const data = req.body
    const result = await otpService(data)
    return response(res,true,"otpVerified",result,200)
   } catch (error) {
    console.log(error)
     next(error)
   }
}

module.exports = otpController