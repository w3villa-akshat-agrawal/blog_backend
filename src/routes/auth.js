const express = require("express");
const router = express.Router();
const passport = require("passport");

// 🔹 Step 1: Trigger Google login (frontend redirects here)
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 🔹 Step 2: Google redirects to this callback URL after login
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google/failure",
    session: false,
  }),
  (req, res) => {
    const {
      userLoginToken,
      newToken,
      user,
      alreadyLoggedIn,
      regenerated,
    } = req.user;

    // ✅ Set HTTP-only cookie for JWT
    if (userLoginToken && (newToken || regenerated)) {
      res.cookie("accessToken", userLoginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });
    }

    // ✅ Redirect user to frontend dashboard (or homepage)
    return res.redirect("http://localhost:5173/dashboard"); // ✅ Change to your frontend route
  }
);

// 🔹 Step 3: Optional - Google auth failed
router.get("/auth/google/failure", (req, res) => {
  res.status(401).json({ success: false, message: "Google login failed" });
});

module.exports = router;
