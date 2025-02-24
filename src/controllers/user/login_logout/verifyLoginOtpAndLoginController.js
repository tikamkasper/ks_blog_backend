const { User } = require("../../../models/user/userModel.js");
const { ApiError } = require("../../../utils/ApiError.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const {
  generateRefreshToken,
} = require("../../../helpers/registerSignupHelper.js");

// verify login OTP and login controller
const verifyLoginOtpAndLogin = asyncHandler(async (req, res) => {
  //get otp and email_or_mobile from user --> req.body
  //check empty field --> otp and email_or_mobile
  // check email or mobile
  // Check if the user exists based on email or mobile
  // Get OTP from the memory
  // compare otp and check otp expiration
  // if OTP is valid
  // delete otp from memory
  // generate refresh token and set in cookie
  //send response user login successfully

  //get otp from user --> req.body

  const { email_or_mobile, otp } = req.body;

  if (!email_or_mobile || !otp) {
    throw new ApiError(400, "email/mobile and required");
  }

  // check email or mobile
  const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email_or_mobile
  );
  const isMobile = /^[0-9]{10}$/.test(email_or_mobile);

  if (!isEmail && !isMobile) {
    throw new ApiError(400, "Invalid email or mobile number");
  }

  // Check if the user exists based on email or mobile
  const userExists = await User.findOne({
    $or: [{ email: email_or_mobile }, { mobile: email_or_mobile }],
  });
  if (!userExists) {
    throw new ApiError(
      400,
      "User not registered with this email or mobile. please register/signup !"
    );
  }

  // Get OTP from the memory
  const storedOtpData = LOGIN_OTP_STORE.get("otpWithExpiration");

  if (
    !storedOtpData ||
    storedOtpData.otp !== otp ||
    Date.now() > storedOtpData.expiration
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // OTP is valid
  // delete otp from memory
  LOGIN_OTP_STORE.delete("otpWithExpiration");

  // generate refresh token
  const refreshToken = generateRefreshToken(userExists._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("rt", refreshToken, cookieOptions)
    .json(new ApiResponse(200, {}, "User login Successfully."));
});

module.exports = { verifyLoginOtpAndLogin };
