const express = require ('express');
const verifyAccessToken = require('../middleware/tokenVerification');
const { addFollowing,getFollowings, getFollower } = require('../controller/socialController');
const router = express.Router()


router.post("/following",verifyAccessToken,addFollowing)

router.get("/followings",verifyAccessToken,getFollowings)
router.get("/follower",verifyAccessToken,getFollower)
module.exports = router