// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");
const {User} = require("../models/");
const verifyAccessToken = require("../middleware/tokenVerification");
const redis = require("../../config/redis_connection");

// Setup Cloudinary Storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profileImages", // optional: folder in cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

// Route: POST /api/upload
router.post("/", verifyAccessToken, upload.single("image"), async (req, res) => {
  try {
    
    const userFetchId = req.body.userFetchId;
    // Check if the user is uploading their own image
    if (parseInt(userFetchId) !== req.user.id) {
      return res.status(403).json({ error: "You can't upload image for another user" });
    }

    // Check if file exists
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Update DB
    await User.update(
      { profileImage: req.file.path },
      { where: { id: req.user.id } }
    );

    // Clear Redis cache
    await redis.del(`userDetail:${req.user.id}`);

    res.json({ url: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});
;
module.exports = router;
