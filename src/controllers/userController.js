const { User } = require("../models/userModel.js");
const { CustomError } = require("../utils/CustomError.js");
const { Response } = require("../utils/Response.js");
const { asyncHandler } = require("../utils/asyncHandler.js");

//register user
const registerUser = asyncHandler(async (req, res, next) => {
  // get email from req.body
  const { email } = req.body;
  // check if email is provided or not
  if (!email) {
    return next(
      new CustomError({
        userErrorMessage: "Email is required. Please provide a valid email.",
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
  // Check if the user already exists in db or not with the same email.
  const userExists = await User.findOne({ email });

  if (userExists) {
    // return response
    return Response.success({
      res,
      statusCode: 200,
      message: "Please continue ...",
      userExists,
    });
  }
  // create new user in db
  const newUser = new User({ email });

  const user = await newUser.save();

  // check customer create or not
  const createdUser = await User.findById(user._id).select("-__v");

  if (!createdUser) {
    return next(
      new CustomError({
        userMessage: "Something went wrong. Please try again.",
        devMessage: "User is not create/save in mongodb.",
        statusCode: 500,
      })
    );
  }
  // return response
  return Response.success({
    res,
    statusCode: 201,
    message: "Please continue ...",
    data: { createdUser },
  });
});
module.exports = { registerUser };
