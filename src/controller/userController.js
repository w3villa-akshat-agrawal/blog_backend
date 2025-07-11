const messages = require("../../utils/messages");
const response = require("../../utils/response");
const statusCodes = require("../../utils/statusCode");
const services = require("../services");
const userSignUp = async (req, res,next) => {
  try {
    const user = await services.signUp(req.body);
    if(user){
      return res.send(response( true,messages.USER_CREATED,"",statusCodes.CREATED))
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

    return res.send(response(true,messages.USER_LOGIN,{}, statusCodes.OK, true));
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
  try {
    // Remove the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.send(response(true,"logout sucess",{},200,false))}
    catch(error){
      next(error)
    }

}
module.exports ={userSignUp,userLogin,verifymail,logout}