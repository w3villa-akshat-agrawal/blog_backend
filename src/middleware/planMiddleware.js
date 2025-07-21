const redis = require("../../config/redis_connection");

const {User,SubscriptionPlan,Blog} = require("../models");
const ApiError = require("../../utils/globalError");
const { Op } = require("sequelize");

const checkPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId)

    // 1️⃣ Get planId from Redis or DB
    let userCache = await redis.get(`user:${userId}`);
    let planId;

    if (userCache) {
      userCache = JSON.parse(userCache);
      planId = userCache.planId;
    } else {
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["subscriptionPlanId"],
      });

      if (!user) return next(new ApiError("User not found", 404));

      planId = user.subscriptionPlanId;

      // Save in Redis
      await redis.set(`user:${userId}`, JSON.stringify({ planId }));
    }

    // 2️⃣ Get plan detail from Redis or DB
    let planDetail = await redis.get(`planId:${planId}`);
    if (!planDetail) {
      const subsDetail = await SubscriptionPlan.findOne({
        where: { id: planId },
        attributes: ["maxBlogsPerDay"],
      });

      if (!subsDetail) return next(new ApiError("Plan not found", 404));

      planDetail = subsDetail.toJSON();
      await redis.set(`planId:${planId}`, JSON.stringify(planDetail));
    } else {
      planDetail = JSON.parse(planDetail);
    }

    const maxBlogs = planDetail.maxBlogsPerDay;

    // 3️⃣ If plan allows unlimited blogs
    if (maxBlogs === null || maxBlogs === -1) {
      return next();
    }

    // 4️⃣ Count blogs created today by the user
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    let blogCount = await redis.get(`blogCount:${userId}`)
    if(!blogCount){

        blogCount = await Blog.count({
          where: {
            userId,
            createdAt: {
              [Op.gte]: todayStart,
            },
          },
        });
        await redis.set(`blogCount:${userId}`,blogCount)
    }


    if (blogCount >= maxBlogs) {
      return next(
        new ApiError(
          `Daily blog limit reached (${maxBlogs} per day for your plan).`,
          403
        )
      );
    }

    // ✅ Pass to next
    next();
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = checkPlan;
