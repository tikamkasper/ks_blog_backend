const { User } = require("../models/userModel.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { CustomError } = require("../utils/CustomError.js");
const { Response } = require("../utils/Response.js");
const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require("../config");
const {
  generateRefreshToken,
  verifyToken,
} = require("../helpers/jwtTokenGenerator.js");

//register user+login
exports.registerUser = asyncHandler(async (req, res, next) => {
  // get email from req.body
  const { email, role = "user" } = req.body;
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
    // check user token
    const token = req.cookies?.b_rt;
    const isValid = verifyToken(
      token,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY
    );

    if (!token || !isValid) {
      // generate refreshToken
      const refreshToken = await generateRefreshToken(userExists._id);
      // set refresh token in cookie
      res.cookie("rt", refreshToken, { httpOnly: true, secure: true });
      // return response
      return Response.success({
        res,
        statusCode: 201,
        message: "Please continue ...",
        data: { user: userExists },
      });
    }

    // return response
    return Response.success({
      res,
      statusCode: 200,
      message: "Please continue ...",
      data: { user: userExists },
    });
  }

  // create new user in db
  const newUser = new User({ email, role });

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

  // generate refreshToken
  const refreshToken = await generateRefreshToken(user._id);

  // set refresh token in cookie
  res.cookie("rt", refreshToken, { httpOnly: true, secure: true });

  // return response
  return Response.success({
    res,
    statusCode: 201,
    message: "Please continue ...",
    data: { createdUser },
  });
});

// logout user
exports.logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refresh_token: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );
  // delete refresh token from cookie
  res.clearCookie("rt", { httpOnly: true, secure: true });

  // return response
  return Response.success({
    res,
    statusCode: 200,
    message: "Logged out successfully.",
    data: {},
  });
});
