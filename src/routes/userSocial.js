const express = require ('express');
const verifyAccessToken = require('../middleware/tokenVerification');
const { addFollowing } = require('../controller/socialController');
const router = express.Router()


router.post("/following",verifyAccessToken,addFollowing)


module.exports = router