const cron = require('node-cron');
const db = require('../../config/mySql_connection');
const redis = require('../../config/redis_connection');

const clearUserAndPlanCache = require('../../utils/redisKeysDel');

// ⏲ Schedule every 10 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('🕒 Running downgrade plan job...');
  try {
    // downgrade users whose plans have expired and aren't already on the default plan
    const [result] = await db.query(`
      UPDATE Users
      SET subscriptionPlanId = 1,
          planActivatedAt = NULL,
          planExpiresAt = NULL,
          updatedAt = NOW()
      WHERE planExpiresAt < UNIX_TIMESTAMP() * 1000
        AND subscriptionPlanId != 1
    `);
    await redis.del("plan")
    if(result.affectedRows>0){
         await clearUserAndPlanCache()
    }
    console.log(`✅ Downgraded ${result.affectedRows} user(s)`);
  } catch (err) {
    console.error('❌ Error running cron job:', err.message);
  }
});
