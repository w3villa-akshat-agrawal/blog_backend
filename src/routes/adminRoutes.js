const express = require('express');
const verifyAccessToken = require('../middleware/tokenVerification');
const { adminPage } = require('../controller/adminController');
const router = express.Router();


router.get("/adminPanel",verifyAccessToken,adminPage)

module.exports = router