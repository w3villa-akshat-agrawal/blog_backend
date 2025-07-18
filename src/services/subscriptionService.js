const ApiError = require("../../utils/globalError");
const { User } = require("../models");

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

    const planIssueDate = new Date(); // current date and time
    const planExpiryDate = new Date(planIssueDate.getTime() + period * 10 * 60 * 1000); // add (period * 10 mins)

    await User.update(
      {
        subscriptionPlanId: planId,
        planActivatedAt: planIssueDate,
        planExpiresAt: planExpiryDate,
      },
      { where: { id: userId } }
    );

    return { message: "Subscription updated", expiresAt: planExpiryDate };

  } catch (error) {
    throw error;
  }
};

module.exports = subscriptionService;
