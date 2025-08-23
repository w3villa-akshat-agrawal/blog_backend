const express = require('express');
const { userSignUp, userLogin,verifymail,refreshToken,logout, editProfileController } = require('../controller/userController');
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
router.get("/auth/logout",verifyAccessToken,logout)
router.patch("/editProfile",verifyAccessToken,editProfileController)
// router.get("/userTokenRefresh",refreshToken)
module.exports = router




