const express = require('express');
const verifyAccessToken = require('../middleware/tokenVerification');
const { subscriptionController, userPlan } = require('../controller/subscriptionController');
const router = express.Router();

router.post("/plan",verifyAccessToken,subscriptionController)
router.get("/Userplans",verifyAccessToken,userPlan)
module.exports = router