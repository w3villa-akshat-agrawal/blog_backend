const express = require ('express');
const verifyAccessToken = require('../middleware/tokenVerification');
const { addFollowing,getFollowings, getFollower } = require('../controller/socialController');
const checkPlanFollow = require('../middleware/planLoginmiddelware');
const router = express.Router()


router.post("/following",verifyAccessToken,checkPlanFollow,addFollowing)

router.get("/followings",verifyAccessToken,getFollowings)
router.get("/follower",verifyAccessToken,getFollower)
module.exports = router