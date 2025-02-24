const { Customer } = require("../../../models/user/customerModel.js");
const { ApiError } = require("../../../utils/ApiError.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { TWILIO_PHONE_NUMBER, EMAIL } = require("../../../config/index.js");
const { REGISTER_OTP_STORE } = require("../../../helpers/otpStore.js");
const {
  otpGenerator,
  twilioClient,
  nodemailerTransporter,
} = require("../../../helpers/registerSignupHelper.js");

// Send register OTP controller
const sendRegisterOtp = asyncHandler(async (req, res) => {
  // get signupCredentials from req.body
  // check email or mobile
  // Check if the user already exists based on email or mobile
  // create otp and otpExpiration
  // Send OTP via Twilio SMS if user credentials a mobile number and
  // If it's an email, send an email OTP using Nodemailer

  // get credentials from req.body
  const { email_or_mobile } = req.body;

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

  // create otp and otpExpiration
  const { otp, otpExpiration } = otpGenerator();

  try {
    // Send OTP via Twilio SMS if it's a mobile number
    if (isMobile) {
      await twilioClient.messages.create({
        body: `Your OTP for Registration E_Shop is ${otp} \n It will expire in 5 minutes.`,
        to: `+91${email_or_mobile}`,
        from: TWILIO_PHONE_NUMBER,
      });
    }

    // If it's an email, send an email OTP using Nodemailer
    if (isEmail) {
      const mailOptions = {
        from: EMAIL, // sender address (must be the same as the email you use in Nodemailer auth)
        to: email_or_mobile, // receiver's email
        subject: "Your OTP for Registration",
        text: `Your OTP for Registration E_Shop is ${otp}. It will expire in 5 minutes.`,
      };
      // Send the email with OTP
      await nodemailerTransporter.sendMail(mailOptions);
      console.log("OTP sent to this email:", email_or_mobile);
    }

    // store OTP in memory (use email_or_mobile as key)
    REGISTER_OTP_STORE.set(email_or_mobile, {
      otp,
      expiration: otpExpiration,
    });

    res
      .status(200)
      .json(new ApiResponse(200, {}, `OTP sent to: ${email_or_mobile}`));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error sending OTP");
  }
});

module.exports = { sendRegisterOtp };
