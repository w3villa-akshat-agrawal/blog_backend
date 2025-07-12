const ApiError = require("../../utils/globalError");
const { Blog, sequelize,Comment,User } = require("../models");




const adminService = async (userId) => {
  try {
            const user = await User.findByPk(userId, {
    attributes: ["id", "username", "isAdmin"],
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user.isAdmin === true) {
    const users =  await User.findAll({
       attributes: ["id", "username"],
    })
    return ({user,users})
  } else {
    throw( new ApiError("You are not admin. Sorry 😢", 403));
  }
  } catch (error) {
     throw(error)
  }
};

module.exports = {adminService}


