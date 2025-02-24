const { Blog } = require("../models/blogModel.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { CustomError } = require("../utils/CustomError.js");
const { Response } = require("../utils/Response.js");
const { uploadToCloudinary } = require("../utils/cloudinary.js");
const { User } = require("../models/userModel.js");
const { Comment } = require("../models/commentModel.js");

// Create a new blog
exports.createBlog = asyncHandler(async (req, res, next) => {
  // console.log("req.body:", req.body);
  // console.log("req.file:", req.file);

  const { filename, path } = req.file;
  const cloudinaryResponse = await uploadToCloudinary(filename, path, next);
  // console.log("cloudinaryResponse:", cloudinaryResponse);

  const { title, category, blogContent } = req.body;
  // user and Comment ref

  res.send("ok");
});
