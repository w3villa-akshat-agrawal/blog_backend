const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: "Access token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Access token expired" });
  }
};

module.exports = verifyAccessToken;
