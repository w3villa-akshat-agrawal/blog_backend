const express = require('express');
const { userSignUp, userLogin,verifymail,refreshToken } = require('../controller/userController');
const verifyAccessToken = require('../middleware/tokenVerification');
const router = express.Router()

router.get("/testing",(req,res)=>{
    res.send("all ok working")
})
router.post("/auth/signup/basic",userSignUp)
router.post("/auth/login/basic",userLogin)
router.get("/auth/verifymail",verifymail)
router.get("/testing1",verifyAccessToken,(req,res)=>{
    res.send("working properly")
})
router.get("/userTokenRefresh",refreshToken)
module.exports = router




