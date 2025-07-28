const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const { User } = require("../src/models"); // Update path as per your project
const { trusted } = require("mongoose");
require("dotenv").config();


const issueAccessToken = async (user) => {
  const userLoginToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );

  await User.update({ token: userLoginToken }, { where: { id: user.id } });
  return userLoginToken;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const cookieAccessToken = req.cookies?.accessToken;

        let user = await User.findOne({ where: { email } });
       
        // ✅ Case 1: First-time login — create user and token
        if (!user) {
          user = await User.create({
            username: profile.displayName.replace(/\s/g, "_"),
            email,
            isEmailVerified: true,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            isActive:true,
            password: null,
          });
          const userLoginToken = await issueAccessToken(user);
          return done(null, { user, userLoginToken,newToken:true });
        }
         if(user.isActive == false){
          return done(null, false, { message: "You are blocked. Contact admin." });
        }

        // ✅ Case 2: Cookie exists and token is valid
      if (cookieAccessToken) {
  try {
    jwt.verify(cookieAccessToken, process.env.JWT_ACCESS);
    return done(null, { alreadyLoggedIn: true, user });
  } catch (err) {
    const userLoginToken = await issueAccessToken(user);
    return done(null, { newToken: true, userLoginToken, user }); // ✅ Correct
  }}

        // ✅ Case 3: No token at all — generate fresh one
        const userLoginToken = await issueAccessToken(user);
        return done(null, { user, userLoginToken, regenerated: true });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);
