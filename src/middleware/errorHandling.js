// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
