const express = require ("express");
const router = express.Router();
const passport = require('passport');
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/google/failure' }),
  (req, res) => {
    const { accessToken, refreshToken, user, alreadyLoggedIn, accessRefreshed, regenerated } = req.user;

    // Already logged in (valid token present)
    if (alreadyLoggedIn) {
      return res.status(200).json({
        message: "User already logged in",
        user,
      });
    }

    // If new tokens were created or refreshed
    if (accessToken) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // ✅ Set to true in production
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
    }

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    return res.status(200).json({
      message: regenerated
        ? "New tokens generated"
        : accessRefreshed
        ? "Access token refreshed"
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