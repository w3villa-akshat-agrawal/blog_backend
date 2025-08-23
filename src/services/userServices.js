const check = require("../validation/index.js")
const { hashedPassword, comparingPassword } = require("../../utils/bcyrptFunctions.js");
const checkExistence = require("../../utils/existence.js");
const { User } = require("../models/index.js");
const ApiError = require("../../utils/globalError.js");
const { userToken, tokenCheck } = require("../../utils/tokenHouse.js");
const sendEmail = require("../../utils/mail.js");
const jwt = require('jsonwebtoken');
const sendSms = require("../../utils/smsService.js");


const signUp = async (data) => {
  const { error, value } = check.signUpSchema.validate(data);
  if (error) {
    throw new ApiError(error.details[0].message, 400);
  }

  try {
    const { username, email, password, phone, firstName, lastName, isActive, status } = value;

    const existingUser = await checkExistence(User, {
      email,
    });

    if (existingUser) {
      throw new ApiError("User already exists with this email", 409);
    }

    let hash = null;
    if (password) {
      hash = await hashedPassword(password);
    }
    console.log(process.env.SMSURL)
  const result = await sendSms({ phone: `+91${phone}` });
    const user = await User.create({
      username,
      email,
      password: hash, 
      phone,
      firstName,
      lastName,
      isActive,
      status,
    });
    const token = userToken({ email: user.email, id: user.id }, process.env.JWT_EMAIL_SECRET, process.env.JWT_EMAIL_EXPIRES_IN);

    const verificationLink = `http://localhost:3008/api/v1/auth/verifymail?token=${token}`;

    try {
      const mail = await sendEmail(
        email,
        "Verify Your Email",
        `<h1>Verify Email</h1>
   <p>Please click the link below to verify your email:</p>
   <a href="${verificationLink}">${verificationLink}</a>`
      );

      console.log("mail sent")

    } catch (error) {

      return user;
      throw (new ApiError("mail error",))
    }
    return {user}; 
  }catch (err) {
    console.log("Signup Error:", err.message);

    // Handle Sequelize Unique Constraint Error (username already exists)
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors[0]?.path || "field";
      const value = err.errors[0]?.value || "value";
      throw new ApiError(`${field} '${value}' already exists`, 409);
    }

    // Fallback for any other error
    throw new ApiError(err.message || "Something went wrong", 500);
  }
};


const login = async (data, token) => {
  try {
    const { error, value } = check.loginSchema.validate(data);
  if (error) throw new ApiError(error.details[0].message, 400);

  const { email, password } = value;
  const existingUser = await checkExistence(User, { email });
  if (!existingUser) throw new ApiError("User not found. Please sign up.", 404);

  const isMatch = await comparingPassword(password, existingUser.password);
  if (!isMatch) throw new ApiError("Credentials do not match", 400);

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_ACCESS);
      throw new ApiError("User already logged in", 400);
    } catch (err) {
      
      console.log("Old token expired or invalid, proceeding with login...");
    }
  }
  if(existingUser.isActive == false){
       throw new ApiError("you are blocked , contact admin for access", 400);
  }
  const userLoginToken = userToken(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_ACCESS,
    process.env.JWT_ACCESS_EXPIRES_IN
  );

  await User.update(
    { token: userLoginToken },
    { where: { id: existingUser.id } }
  );

  return { userLoginToken, user: existingUser };
  } catch (error) {
    throw (new ApiError(error.message))
  }
};

module.exports = { login };

const mailTokenVerification = async (token) => {
  try {
    const tokenSignCheck = await tokenCheck(token, process.env.JWT_EMAIL_SECRET);
    console.log(tokenSignCheck)
    const existingUser = await checkExistence(User, {
      id: tokenSignCheck.id
    });

    if (!existingUser) {
      throw new ApiError("User not found for this email", 404);
    }

    await User.update(
      { isEmailVerified: true },
      { where: { id: existingUser.id } }
    );

    return true;
  } catch (error) {
    throw new ApiError("Error verifying email token", 400);
  }
};

const editProfileService = async (data, userId) => {
  try {
    // check if user exists
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const { email, username, phone } = data;

    const [updatedCount] = await User.update(
      { email, username, phone },
      { where: { id: userId } }
    );

    if (updatedCount === 0) {
      throw new ApiError("Update failed", 400);
    }

    return { message: "Profile updated successfully" };

  } catch (error) {
    throw error;
  }
};

// const accessTokenRefresh = async (tokenRefreSH) => {
//   try {
//     const refreshToken = tokenRefreSH;
//     console.log("joo")
//     console.log(tokenRefreSH)

//     if (!refreshToken) {
//       throw new ApiError("Session expired. Please log in again.", 403);
//     }

//     let decoded;
//     try {
//       console.log(process.env.JWT_REFRESH)
//       console.log("1")
//       decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);
//       console.log("2")
//       console.log(decoded.id)
//       if(decoded){
//         console.log("******************")
//         console.log("trueeeeeee")
//       }
//       const user = await User.findByPk(decoded.id);
      
//       console.log(user)

//     if (!user || user.token !== refreshToken) {
//       throw new ApiError("Token mismatch or user not found", 403);
//     }

//     const newAccessToken = userToken(
//       { id: user.id, email: user.email },
//       process.env.JWT_ACCESS,
//       process.env.JWT_ACCESS_EXPIRES_IN
//     );
    
//     return newAccessToken;
//     } catch (err) {
//         console.error("❌ jwt.verify error:", err.message);
//       throw new ApiError("Invalid or expired refresh token", 403);
//     }

    
//   } catch (err) {
//     console.log("accessTokenRefresh error:", err);
//     throw err;
//   }
// };

module.exports = { signUp, login, mailTokenVerification,editProfileService };
