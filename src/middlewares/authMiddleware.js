const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel.js");
const { CustomError } = require("../utils/CustomError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require("../config");

exports.verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.rt || req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      return next(
        new CustomError({
          userMessage: "Please login to access this resource",
          devMessage: "User have no token.",
          statusCode: 401,
        })
      );
    }

    const decodedToken = jwt.verify(
      token,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return next(
        new CustomError({
          userMessage: "Email is requried. Please provide a valid email.",
          devMessage: "User modified the token",
          statusCode: 401,
        })
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new CustomError({
        userMessage: "Something went wrong. Please try again.",
        devMessage: error?.message || "Invalid refresh token.",
        statusCode: 401,
      })
    );
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("req.user.role:", req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError({
          userMessage: "You are not authorized to access this resource.",
          devMessage: `Role: "${req.user.role}" is not allowed to access this resource`,
          statusCode: 403,
        })
      );
    }
    next();
  };
};
