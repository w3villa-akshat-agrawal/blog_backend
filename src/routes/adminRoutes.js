const express = require('express');
const verifyAccessToken = require('../middleware/tokenVerification');
const { adminPage, userBlock, unblockingUser, userUnBlock } = require('../controller/adminController');
const router = express.Router();


router.get("/adminPanel",verifyAccessToken,adminPage)
router.get("/userblocking/:id",verifyAccessToken,userBlock)
router.get("/userUnblocking/:id",verifyAccessToken,userUnBlock)

module.exports = router