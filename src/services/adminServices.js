const ApiError = require("../../utils/globalError");
const { Blog, sequelize,Comment,User,SubscriptionPlan } = require("../models");

const { Op } = require("sequelize");



const adminService = async (userId, page , limit , search = "") => {
  const offset = (page - 1) * limit;

  try {
  
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "isAdmin"],
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (!user.isAdmin) {
      throw new ApiError("You are not admin. Sorry 😢", 403);
    }
    const whereClause = search
      ? { username: { [Op.like]: `%${search}%` } }
      : {};
      const totalCount = await User.count({ where: whereClause });
    const users = await User.findAll({
      attributes: ["id", "username","isActive","SubscriptionPlanId","phone",'planActivatedAt','planExpiresAt'],
      where: whereClause,
      include:[{
        model:SubscriptionPlan,
        as:'subscription',
        attributes:['name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  


    return {
      currentAdmin: { id: user.id, username: user.username },
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        count: totalCount
      },
    };
  } catch (error) {
    throw error;
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


