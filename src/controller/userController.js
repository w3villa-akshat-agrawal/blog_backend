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

    const { userLoginToken, user } = await services.login(req.body, tokenFromCookie);

    res.cookie('accessToken', userLoginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
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
// const refreshToken = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.cookies;
//     console.log("refreshToken from cookie:", refreshToken);

//     const newAccessToken = await services.accessTokenRefresh(refreshToken);

//     // ✅ Set accessToken cookie here
//     res.cookie('accessToken', newAccessToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       maxAge: 15 * 60 * 1000, // 15 minutes
//     });

//     return res.send(response("Access token regenerated",{newAccessToken}, statusCodes.OK));
//   } catch (error) {
//     return next(error);
//   }
// };

const logout = async(req,res,next)=>{
  userId = req.user.id
  try {
    // Remove the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    await redis.del("allBlog");
    await redis.del(`userDetail:${userId}`)
    return res.send(response(res,true,"logout sucess",{},200))}
    catch(error){
      next(error)
    }

}
module.exports ={userSignUp,userLogin,verifymail,logout}