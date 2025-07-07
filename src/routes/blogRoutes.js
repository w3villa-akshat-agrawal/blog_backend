const express = require("express");
const verifyAccessToken = require("../middleware/tokenVerification");
const router = express.Router();
const {createBlog,allBlog,deleteBlog, updateBlog,anyUserDetail} = require('../controller/blogController.js')

// Get the top 10 comments on the basis of CreatedAt only--- for Rest call the comment api.
// use
router.get("/allBlog",verifyAccessToken,allBlog)
router.post("/createBlog",verifyAccessToken,createBlog)
router.delete("/delete/blog/:id",verifyAccessToken,deleteBlog)
router.patch("/updateBlog/:id",verifyAccessToken,updateBlog)




// Get all comments of all particular blog-->
router.get("/userBlog/:id",verifyAccessToken,anyUserDetail)

module.exports = router;