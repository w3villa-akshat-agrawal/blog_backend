const express = require("express");
const verifyAccessToken = require("../middleware/tokenVerification");
const { createComment } = require("../controller/commentController");
const router = express.Router();

router.get("/comment/:id",verifyAccessToken,createComment)