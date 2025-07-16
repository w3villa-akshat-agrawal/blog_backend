const jwt = require('jsonwebtoken');
const response = require('../../utils/response');

const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return response(res, false, "No token provided", {}, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS);
    req.user = decoded;
    next();
  } catch (err) {
    return response(res, false, "Token expired or invalid", {}, 401);
  }
};

module.exports = verifyAccessToken;
