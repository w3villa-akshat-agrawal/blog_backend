const messages = {
  // Auth / User
  USER_CREATED: "User successfully created.",
  USER_LOGIN : "user login successfully",
  USER_EXISTS: "User already exists with this email or username.",
  USER_NOT_FOUND: "User not found.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  UNAUTHORIZED: "Unauthorized access.",
  
  // Validation
  VALIDATION_ERROR: "Validation failed. Please check your input.",
  
  // Server
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",

  // Common
  MISSING_FIELDS: "Required fields are missing.",
  ACCESS_DENIED: "Access denied.",
};

module.exports = messages;
