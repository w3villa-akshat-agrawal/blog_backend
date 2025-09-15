// controllers/uploadController.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary"); // your cloudinary.js config
const { Blog } = require("../models"); // Sequelize Blog model (adjust path)

// 1. Create multer storage with cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_images", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // unique name
  },
});

// 2. Multer upload middleware (single file upload)
const upload = multer({ storage });

// 3. Controller to handle blog image upload
const uploadBlogImage = async (req, res) => {
  try {
    // multer will put the uploaded file info in req.file
    // req.file.path will have the Cloudinary secure URL
    const userId = req.user.id
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Find blog by title and userId
    const blog = await Blog.findOne({ where: { title, userId } });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update blog with image url from Cloudinary
    blog.image = req.file.path;
    await blog.save();

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      blog,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export both middleware and controller
module.exports = {
  upload, // multer middleware
  uploadBlogImage,
};
