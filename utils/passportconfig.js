const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const { User } = require("../src/models");
const { userToken } = require("../utils/tokenHouse");

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
        const cookieRefreshToken = req.cookies?.refreshToken;

        let user = await User.findOne({ where: { email } });

        // ✅ Case 1: User doesn't exist — Create user and issue tokens
        if (!user) {
          user = await User.create({
            username: profile.displayName.replace(/\s/g, "_"),
            email,
            isEmailVerified: true,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            password: null,
          });

          const newAccess = userToken({ id: user.id, email: user.email }, process.env.JWT_ACCESS, process.env.JWT_ACCESS_EXPIRES_IN);
          const newRefresh = userToken({ id: user.id, email: user.email }, process.env.JWT_REFRESH, process.env.JWT_REFRESH_EXPIRES_IN);

          await User.update({ token: newRefresh }, { where: { id: user.id } });

          return done(null, { user, accessToken: newAccess, refreshToken: newRefresh });
        }

        // ✅ Case 2: Access token is valid — already logged in
        if (cookieAccessToken) {
          try {
            jwt.verify(cookieAccessToken, process.env.JWT_ACCESS);
            return done(null, { alreadyLoggedIn: true, user });
          } catch (err) {
            // access token expired — continue
          }
        }

        // ✅ Case 3: Refresh token is valid — generate new access token
        if (cookieRefreshToken) {
          try {
            jwt.verify(cookieRefreshToken, process.env.JWT_REFRESH);

            const newAccess = userToken({ id: user.id, email: user.email }, process.env.JWT_ACCESS, process.env.JWT_ACCESS_EXPIRES_IN);

            return done(null, {
              user,
              accessToken: newAccess,
              refreshToken: cookieRefreshToken,
              accessRefreshed: true
            });
          } catch (err) {
            // ❌ Refresh token expired
            return done({
              message: "Refresh token expired. Please login again.",
              code: "REFRESH_EXPIRED",
              user,
            }, null);
          }
        }

        // ✅ Case 4: No refresh token cookie at all — regenerate both on manual login
        const freshAccess = userToken({ id: user.id, email: user.email }, process.env.JWT_ACCESS, process.env.JWT_ACCESS_EXPIRES_IN);
        const freshRefresh = userToken({ id: user.id, email: user.email }, process.env.JWT_REFRESH, process.env.JWT_REFRESH_EXPIRES_IN);

        await User.update({ token: freshRefresh }, { where: { id: user.id } });

        return done(null, {
          user,
          accessToken: freshAccess,
          refreshToken: freshRefresh,
          regenerated: true
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Required for session support
passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));
