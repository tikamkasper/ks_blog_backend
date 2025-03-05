const { Comment } = require("../models/commentModel.js");
const { GustUser } = require("../models/gustUserModel.js");
const { Blog } = require("../models/blogModel.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { CustomError } = require("../utils/CustomError.js");
const { Response } = require("../utils/Response.js");

// Create new comment
exports.createComment = asyncHandler(async (req, res, next) => {
  const { email, commentContent, blogId } = req.body;

  // check if email is provided or not
  if (!email) {
    return next(
      new CustomError({
        userErrorMessage: " Email is required.",
        statusCode: 400,
      })
    );
  }
  // check if email is valid or not
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmail = emailRegex.test(email);
  if (!isEmail) {
    return next(
      new CustomError({
        userMessage: "Please provide a valid email.",
        devMessage: `User enter invalide email format: ${email}`,
        statusCode: 400,
      })
    );
  }
  // Check if the gustUser already exists in db or not with the same email.
  const userExists = await GustUser.findOne({ email });
  if (userExists) {
    // If user exists then create a new comment
    const newComment = await Comment.create({
      createrUserId: userExists._id,
      commentContent,
      blogId,
    });

    // add comment id to the blog
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: newComment._id },
    });

    // return response
    return Response.success({
      res,
      statusCode: 201,
      message: " Comment created successfully.",
      data: { newComment },
    });
  }
  // If user does not exist then create a new user and then create a new comment
  const newGustUser = await GustUser.create({ email });
  const newComment = await Comment.create({
    createrUserId: newGustUser._id,
    commentContent,
    blogId,
  });

  // add comment id to the blog
  await Blog.findByIdAndUpdate(blogId, {
    $push: { comments: newComment._id },
  });

  // return response
  return Response.success({
    res,
    statusCode: 201,
    message: " Comment created successfully.",
    data: { newComment },
  });
});
