// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

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
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Send image URL to frontend
    res.json({ url: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
