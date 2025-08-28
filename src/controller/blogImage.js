const { Blog } = require("../models"); // Sequelize Blog model
const redis = require("../../config/redis_connection"); // optional if caching blogs
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

// ✅ Configure Cloudinary Storage for blog images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogImages", // folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

const upload = multer({ storage });

/**
 * Blog Image Uploader Controller
 * Expects: title in req.body, image in req.file, user from verifyAccessToken
 */
const blogImageUploader = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id; // comes from verifyAccessToken middleware

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // ✅ Find the blog belonging to the user with this title
    const blog = await Blog.findOne({ where: { title, userId } });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // ✅ Update blog with Cloudinary image URL
    blog.imageUrl = req.file.path; // multer-storage-cloudinary gives .path as cloudinary URL
    await blog.save();

    // If caching blogs in Redis → clear/update cache
    await redis.del(`blogDetail:${blog.id}`);

    return res.status(200).json({
      success: true,
      message: "Blog image uploaded successfully",
      imageUrl: req.file.path,
      blog,
    });
  } catch (error) {
    console.error("Blog Image Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { blogImageUploader, upload };
