const Following = require("../models/following");
const Follower = require("../models/follower.js")

const followingService = async (userId, userFollowingData) => {
  const { id: targetUserId, name: targetUserName } = userFollowingData;

  try {
    // --- FOLLOWING LOGIC ---
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
        throw new Error("Already following this user");
      }

      userDoc.following.push({
        userId: targetUserId,
        username: targetUserName,
        followedAt: new Date()
      });

      await userDoc.save();
    }

    // --- FOLLOWER LOGIC ---
    let targetUserDoc = await Follower.findOne({ userId: targetUserId });

    if (!targetUserDoc) {
      await Follower.create({
        userId: targetUserId,
        follower: [{
          userId: userId,
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
          followedAt: new Date()
        });
        await targetUserDoc.save();
      }
    }

    return { message: "✅ Followed user successfully" };

  } catch (error) {
    console.error(" Following Error:", error.message);
    throw new Error(`Error in followingService: ${error.message}`);
  }
};

module.exports ={ followingService}
