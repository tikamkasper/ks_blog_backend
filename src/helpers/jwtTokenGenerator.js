const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel.js");
const { CustomError } = require("../utils/CustomError.js");
//Generate Refresh Token
const generateRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });
    return refreshToken;
  } catch (error) {
    throw new CustomError({
      userMessage: "Internal Server Error.",
      devMessage: error.message, // Something went wrong while generating referesh token
      statusCode: 500,
    });
  }
};

const verifyToken = (token, secret, expire) => {
  try {
    jwt.verify(token, secret, expire);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { generateRefreshToken, verifyToken };
