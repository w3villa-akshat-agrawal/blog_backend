const express = require("express");
const otpController = require("../controller/otpController");
const router = express.Router();

router.post("/verify",otpController);

module.exports = router;