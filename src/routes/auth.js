const express = require ("express");
const router = express.Router();
const passport = require('passport');
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google/failure",
    session: false,
  }),
  (req, res) => {
    const { userLoginToken, newToken, user, alreadyLoggedIn, regenerated } = req.user;

    // ✅ Case: Already logged in (valid access token)
    if (alreadyLoggedIn) {
      return res.status(200).json({
        message: "User already logged in",
        user,
      });
    }

    // ✅ Set cookie if new token was generated or refreshed
    if (userLoginToken && (newToken || regenerated)) {
      res.cookie("accessToken", userLoginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
           maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      
    }

    return res.status(200).json({
      message: regenerated
        ? "New token generated"
        : newToken
        ? "login successful"
        : "Google login successful",
      user,
    });
  }
);



// Optional failure route
router.get('/auth/google/failure', (req, res) => {
  res.status(401).json({ message: 'Google login failed' });
});

module.exports = router 