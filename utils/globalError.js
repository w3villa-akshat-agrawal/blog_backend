class ApiError extends Error {
  constructor(message, statusCode=500) {
    super(message);
    this.statusCode = statusCode; 
  }
}

module.exports = ApiError;