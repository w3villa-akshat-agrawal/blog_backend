const redis = require("../../config/redis_connection");
const messages = require("../../utils/messages");
const response = require("../../utils/response");
const statusCodes = require("../../utils/statusCode");
const services = require("../services");
const userSignUp = async (req, res,next) => {
  try {
    
    const user = await services.signUp(req.body);

    if(user){
      return (response(res,true,"signUpSuccess and otp is send please verify at next step",user,201))
    }
  } catch (error) {
  return next(error);
  }
};
const userLogin = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.accessToken;
    console.log(req.body)
    const { userLoginToken, user } = await services.login(req.body, tokenFromCookie);

    res.cookie('accessToken', userLoginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1 * 24 * 60 * 60 * 1000 // 3 days
    });

    return (response(res,true,"login Successful",{},200));
  } catch (error) {
    console.log(error);
    return next(error);
  }
};


const verifymail = async(req,res,next)=>{
  try {
    const token = req.query.token
    const mail = await services.mailTokenVerification(token)
    if(mail){
      return res.send(response(true,"mail verified",null,statusCodes.OK,))
    }
    
  } catch (error) {
    return (next(error))
  }
}

const logout = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0)
    });

 
    if (userId) {
      await redis.del("allBlog");
      await redis.del(`userDetail:${userId}`);
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};


const editProfileController = async (req, res, next) => {
  const userId = req.user.id; // ✅ use const

  try {
    const result = await services.editProfileService(req.body, userId);

    if (!result) {
      return response(res, false, "Profile not updated", {}, 400);
    }

    return response(res, true, "Profile edit success", {}, 200);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
module.exports ={userSignUp,userLogin,verifymail,logout,editProfileController}