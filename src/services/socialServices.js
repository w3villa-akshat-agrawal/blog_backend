const Following = require("../models/following.js");
const Follower = require("../models/follower.js");
const ApiError = require("../../utils/globalError.js");
const {User} = require("../models");

const followingService = async (userId, userFollowingData) => {
  const { id: targetUserId, name: targetUserName } = userFollowingData;

  if (userId == targetUserId) {
    throw new ApiError("Cannot follow yourself");
  }

  const followerUser = await User.findByPk(userId);  // ✅ Get follower’s name
  const followerUsername = followerUser?.username || "Anonymous";

  // ---- FOLLOWING collection update ----
  let userDoc = await Following.findOne({ userId });

  if (!userDoc) {
    await Following.create({
      userId: userId,
      following: [{
        userId: targetUserId,
        username: targetUserName,
        followedAt: new Date()
      }]
    });
  } else {
    const alreadyFollowing = userDoc.following.some(
      f => f.userId === targetUserId
    );

    if (alreadyFollowing) {
      return { isFollowing: true };
    }

    userDoc.following.push({
      userId: targetUserId,
      username: targetUserName,
      followedAt: new Date()
    });

    await userDoc.save();
  }

  // ---- FOLLOWER collection update ----
  let targetUserDoc = await Follower.findOne({ userId: targetUserId });

  if (!targetUserDoc) {
    await Follower.create({
      userId: targetUserId,
      username: targetUserName,
      follower: [{
        userId: userId,
        username: followerUsername,   // ✅ Use correct follower's name
        followedAt: new Date()
      }]
    });
  } else {
    const alreadyFollower = targetUserDoc.follower.some(
      f => f.userId === userId
    );

    if (!alreadyFollower) {
      targetUserDoc.follower.push({
        userId: userId,
        username: followerUsername,   // ✅ Fixed here too
        followedAt: new Date()
      });

      await targetUserDoc.save();
    }
  }

  return { message: "✅ Followed user successfully" };
};

const getfollowingService = async (search, page = 1, limit = 10, userId) => {
  try {
    const skip = (page - 1) * limit;

    const matchStage = {
      $match: { userId: Number(userId) }
    };

    const filterStage = {
      $project: {
        _id: 0,
        following: {
          $filter: {
            input: "$following",
            as: "f",
            cond: search
              ? {
                  $regexMatch: {
                    input: "$$f.username",
                    regex: search,
                    options: "i"
                  }
                }
              : true
          }
        }
      }
    };

    const pipeline = [
      matchStage,
      filterStage,
      { $unwind: "$following" },
      { $skip: skip },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$following" } }
    ];

    const result = await Following.aggregate(pipeline);
    return result;
  } catch (error) {
    console.error("Error in getfollowingService:", error);
    throw new Error("Internal server error while fetching followings");
  }
};

const getfollowerService = async (search, page = 1, limit = 10, userId) => {
  try {
    const skip = (page - 1) * limit;

    const matchStage = {
      $match: { userId: Number(userId) }
    };

    const filterStage = {
      $project: {
        _id: 0,
        follower: {
          $filter: {
            input: "$follower",
            as: "f",
            cond: search
              ? {
                  $regexMatch: {
                    input: "$$f.username",
                    regex: search,
                    options: "i"
                  }
                }
              : true
          }
        }
      }
    };

    const pipeline = [
      matchStage,
      filterStage,
      { $unwind: "$follower" },
      { $skip: skip },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$follower" } }
    ];

    const result = await Follower.aggregate(pipeline);
    return result;
  } catch (error) {
    console.error("Error in getfollowingService:", error);
    throw new Error("Internal server error while fetching followings");
  }
};


module.exports ={ followingService,getfollowingService,getfollowerService}
