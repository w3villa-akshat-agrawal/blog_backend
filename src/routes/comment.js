const express = require("express");
const verifyAccessToken = require("../middleware/tokenVerification");
const { createComment,getComments } = require("../controller/commentController");
const router = express.Router();

router.post("/comment/:id",verifyAccessToken,createComment)


// pagination here
router.get("/allComments/:id",verifyAccessToken,getComments)



// limit or offset===mysql
// limit = 10;
// page = 1
// if page number is not giving




module.exports = router;