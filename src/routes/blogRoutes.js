const express = require("express");
const verifyAccessToken = require("../middleware/tokenVerification");
const router = express.Router();
const {createBlog,allBlog,deleteBlog, updateBlog,anyUserDetail} = require('../controller/blogController.js')
router.get("/allBlog",verifyAccessToken,allBlog)
router.post("/createBlog",verifyAccessToken,createBlog)
router.delete("/delete/blog/:id",verifyAccessToken,deleteBlog)
router.patch("/updateBlog/:id",verifyAccessToken,updateBlog)




router.get("/user/:id",verifyAccessToken,anyUserDetail)

module.exports = router;