const cloudinary = require("cloudinary").v2;
const { Blog } = require("../models/blogModel.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { CustomError } = require("../utils/CustomError.js");
const { Response } = require("../utils/Response.js");
const { uploadToCloudinary } = require("../utils/cloudinary.js");

// Create a new blog ==>user
exports.createBlog = asyncHandler(async (req, res, next) => {
  const { filename, path } = req.file;
  const cloudinaryResponse = await uploadToCloudinary(filename, path, next);
  const { title, category, blogContent } = req.body;
  const blog = new Blog({
    createrUserId: req.user._id,
    title,
    image: cloudinaryResponse,
    category,
    blogContent,
  });
  const newBlog = await blog.save();
  return Response.success({
    res,
    statusCode: 201,
    message: " Blog created successfully",
    data: { newBlog },
  });
});

// Get all blogs ==>user
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({ isVerified: true }).populate("createrUserId");
  const blogCounts = blogs.length;

  return Response.success({
    res,
    statusCode: 200,
    message: "Blogs retrieved successfully",
    data: { blogCounts, blogs },
  });
});

// Get all blogs ==> admin
exports.getAllBlogsAdmin = asyncHandler(async (req, res, next) => {
  // const blogContents = await Blog.countDocuments();
  const blogs = await Blog.find().populate("createrUserId");
  const blogCounts = blogs.length;

  return Response.success({
    res,
    statusCode: 200,
    message: "Blogs retrieved successfully",
    data: { blogCounts, blogs },
  });
});

// Get a blog by id or Get a single blog ==>user
exports.getBlogById = asyncHandler(async (req, res, next) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId).populate("createrUserId");
  if (!blog) {
    return next(
      new CustomError({
        userMessage: "This blog detail is is not available.",
        devMessage: " Blog not found",
        statusCode: 404,
      })
    );
  }
  return Response.success({
    res,
    statusCode: 200,
    message: "Blog retrieved successfully",
    data: { blog },
  });
});

// Delete a blog ===>admin
exports.deleteBlogAdimn = asyncHandler(async (req, res, next) => {
  // Find blog by id
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new CustomError({
        userMessage: "This blog detail is not available.",
        devMessage: "Blog not found",
        statusCode: 404,
      })
    );
  }
  // Delete images from cloudinary
  const image = blog.image;
  if (image) {
    await cloudinary.uploader.destroy(image.public_id);
  }
  // Delete blog from db
  await Blog.findByIdAndDelete(req.params.id);

  return Response.success({
    res,
    statusCode: 200,
    message: "Blog deleted successfully",
  });
});

// Update a blog ===>admin
exports.updateBlogAdmin = asyncHandler(async (req, res, next) => {
  // Find blog by id
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(
      new CustomError({
        userMessage: "This blog detail is not available.",
        devMessage: "Blog not found",
        statusCode: 404,
      })
    );
  }
  if (req.file !== undefined) {
    // Delete old images from cloudinary
    const image = blog.image;
    if (image) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    // Save new images in cloudinary
    const { filename, path } = req.file;
    const cloudinaryResponse = await uploadToCloudinary(filename, path, next);

    req.body.image = cloudinaryResponse;
  }

  req.body.updaterUserId = req.user._id;

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return Response.success({
    res,
    statusCode: 200,
    message: "Blog updated successfully",
    data: { updatedBlog },
  });
});
