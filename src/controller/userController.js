const messages = require("../../utils/messages");
const response = require("../../utils/response");
const statusCodes = require("../../utils/statusCode");
const services = require("../services");
const userSignUp = async (req, res,next) => {
  try {
    const user = await services.signUp(req.body);
    if(user){
      return res.send(response(messages.USER_CREATED,"",statusCodes.CREATED))
    }
  } catch (error) {
    console.log(error)
  return next(error);
  }
};
const userLogin = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await services.login(req.body);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production (with HTTPS)
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    return res.send(response(messages.USER_LOGIN, { user }, statusCodes.OK, true));
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const verifymail = async(req,res,next)=>{
  try {
    const token = req.query.token
    console.log(token)
    const mail = await services.mailTokenVerification(token)
    if(mail){
      return res.send(response("mail verified",null,statusCodes.OK,))
    }
    
  } catch (error) {
    return (next(error))
  }
}
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    console.log("refreshToken from cookie:", refreshToken);

    const newAccessToken = await services.accessTokenRefresh(refreshToken);

    // ✅ Set accessToken cookie here
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.send(response("Access token regenerated",{newAccessToken}, statusCodes.OK));
  } catch (error) {
    return next(error);
  }
};
module.exports ={userSignUp,userLogin,verifymail,refreshToken}