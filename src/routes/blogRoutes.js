const express = require("express");
const verifyAccessToken = require("../middleware/tokenVerification");
const router = express.Router();
const {createBlog,allBlog,deleteBlog, updateBlog,anyUserDetail, blogParticular} = require('../controller/blogController.js')



// Get the top 10 comments on the basis of CreatedAt only--- for Rest call the comment api.
// use
router.get("/allBlog",verifyAccessToken,allBlog)
router.post("/createBlog",verifyAccessToken,createBlog)
router.delete("/delete/blog/:id",verifyAccessToken,deleteBlog)
router.patch("/updateBlog/:id",verifyAccessToken,updateBlog)
router.get("/particularBlog/:id",verifyAccessToken,blogParticular)


// Get all comments of all particular blog-->
router.get("/userBlog",verifyAccessToken,anyUserDetail)

module.exports = router;