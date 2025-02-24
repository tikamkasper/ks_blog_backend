const { Customer } = require("../../../models/user/customerModel.js");
const { ApiError } = require("../../../utils/ApiError.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { REGISTER_OTP_STORE } = require("../../../helpers/otpStore.js");
const {
  generateRefreshToken,
} = require("../../../helpers/registerSignupHelper.js");

// Verify register OTP and login controller
const verifyRegisterOtpLogin = asyncHandler(async (req, res) => {
  //get otp and email_or_mobile from user --> req.body
  // Get OTP from the memory
  //verify otp and check otp expiration
  // if OTP is valid
  // delete otp from memory
  //send response OTP verified successfully

  //get otp and email_or_mobile from user --> req.body
  const { email_or_mobile, otp } = req.body;

  // Get OTP from the memory
  const storedOtpData = REGISTER_OTP_STORE.get(email_or_mobile);

  if (!storedOtpData) {
    throw new ApiError(400, "OTP not found or expired");
  }

  // Check OTP expiration
  if (Date.now() > storedOtpData.expiration) {
    REGISTER_OTP_STORE.delete(email_or_mobile); // Delete expired OTP
    throw new ApiError(400, "OTP has expired");
  }

  // Check OTP match
  if (storedOtpData.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid, delete it from memory
  REGISTER_OTP_STORE.delete(email_or_mobile);

  // check email or mobile
  const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email_or_mobile
  );
  const isMobile = /^[0-9]{10}$/.test(email_or_mobile);

  if (!isEmail && !isMobile) {
    throw new ApiError(400, "Invalid email or mobile number");
  }

  // Check if the user already exists based on email or mobile
  const customerExists = await Customer.findOne({
    $or: [{ email: email_or_mobile }, { mobile: email_or_mobile }],
  });
  if (customerExists) {
    throw new ApiError(
      409,
      "customer already exists with this email or mobile, please login."
    );
  }

  const newCustomer = new Customer({
    email: isEmail ? email_or_mobile : "",
    mobile: isMobile ? email_or_mobile : "",
  });

  const customer = await newCustomer.save();

  const createdCustomer = await Customer.findById(customer._id);

  if (!createdCustomer) {
    throw new ApiError(
      500,
      "Something went wrong while registering the customer."
    );
  }

  const refreshToken = generateRefreshToken(customer._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("rt", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "OTP verified and user registered Successfully."
      )
    );
});

module.exports = { verifyRegisterOtpLogin };
