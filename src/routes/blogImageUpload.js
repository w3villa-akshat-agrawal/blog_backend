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
    folder: "blogImages", // optional: folder in cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Route: POST /api/upload
router.post("/", verifyAccessToken, upload.single("file"), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file || !req.file.path) {
      return res.status(400).json({ 
        success: false, 
        message: "No image uploaded" 
      });
    }

    // Return the Cloudinary URL
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: req.file.path, // Cloudinary URL
    });
  } catch (error) {
    console.error("Image Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
});
module.exports = router;
