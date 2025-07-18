const express = require('express');
const verifyAccessToken = require('../middleware/tokenVerification');
const { subscriptionController } = require('../controller/subscriptionController');
const router = express.Router();

router.post("/plan",verifyAccessToken,subscriptionController)

module.exports = router