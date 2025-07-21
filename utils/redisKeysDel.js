 // your Redis client

const redis = require("../config/redis_connection");

const clearUserAndPlanCache = async () => {
  try{
    const userKeys = await redis.keys("user:*");
    const planKeys = await redis.keys("planId:*");
    const countKeys = await redis.keys("blogCount:*")

    const allKeys = [...userKeys, ...planKeys,...countKeys];

    if (allKeys.length > 0) {
      await redis.del(...allKeys);
      console.log(`✅ Deleted ${allKeys.length} Redis keys`);
    } else {
      console.log("ℹ️ No matching Redis keys to delete");
    }
  } catch (err) {
    console.error("❌ Error while clearing Redis keys:", err);
  }
};

module.exports = clearUserAndPlanCache
