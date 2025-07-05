const Joi = require("joi");

const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  isActive: Joi.boolean().default(true),
  status: Joi.boolean().default(true)
});

module.exports = signUpSchema ;
