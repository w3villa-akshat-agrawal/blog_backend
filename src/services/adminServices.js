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


const blockingUser = async (userId, userBlockId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "isAdmin"],
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (user.isAdmin !== true) {
      throw new ApiError("You are not admin. Sorry 😢", 403);
    }

    const blockUser = await User.findOne({
      where: { id: userBlockId }, // ✅ fixed
    });

    if (!blockUser) {
      throw new ApiError("User to block not found", 404);
    }

    await User.update(
      { isActive: false },
      { where: { id: userBlockId } }
    );

    return { message: `User ID ${userBlockId} blocked successfully.` };
  } catch (error) {
    throw error;
  }
};


const unblockingUser = async (userId, userBlockId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "isAdmin"],
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (user.isAdmin !== true) {
      throw new ApiError("You are not admin. Sorry 😢", 403);
    }

    const blockUser = await User.findOne({
      where: { id: userBlockId }, // ✅ fixed
    });
    if(blockUser.isActive === true){
        throw (new ApiError("user already unblock"))
    }
    if (!blockUser) {
      throw new ApiError("User to Unblock not found", 404);
    }

    await User.update(
      { isActive: true },
      { where: { id: userBlockId } }
    );

    return { message: `User ID ${userBlockId} Unblocked successfully.` };
  } catch (error) {
    throw error;
  }
};


module.exports = {adminService,blockingUser,unblockingUser}


