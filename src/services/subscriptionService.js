const redis = require("../../config/redis_connection");
const ApiError = require("../../utils/globalError");
const { User } = require("../models");
const subscriptionplan = require("../models/subscriptionplan");

const subscriptionService = async (userId, data) => {
  const { planId, period } = data;

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["subscriptionPlanId"]
    });
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    // console.log(typeof(user.subscriptionPlanId))
    // console.log(typeof(planId))
    if (user.subscriptionPlanId == planId) {
      throw new ApiError("Already subscribed to this plan", 400);
    }

    // const planIssueDate = new Date(); // current date and time
    const planIssueDate = Date.now()
    console.log('date',planIssueDate)
    const planExpiryDate =(planIssueDate + period * 1 * 60 * 1000); 
    console.log('expiryDate',planExpiryDate)
    await User.update(
      {
        subscriptionPlanId: planId,
        planActivatedAt: planIssueDate,
        planExpiresAt: planExpiryDate,
      },
      { where: { id: userId } } 
    );
    await redis.set("plan", JSON.stringify({ planId: planId }));
    return { message: "Subscription updated", expiresAt: planExpiryDate };

  } catch (error) {
    throw error;
  }
};

const getPlanDetail = async(id)=>{
   try {
     const res = await subscriptionplan.findOne({where:{id}})
    return res
   } catch (error) {
        throw (new ApiError(error.message))
   }
}

module.exports = {subscriptionService,getPlanDetail};
