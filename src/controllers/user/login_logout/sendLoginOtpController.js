const { User } = require("../../../models/user/userModel.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const { ApiError } = require("../../../utils/ApiError.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { TWILIO_PHONE_NUMBER, EMAIL } = require("../../../config/index.js");
const {
  twilioClient,
  nodemailerTransporter,
} = require("../../../helpers/registerSignupHelper.js");

//create otp store in memory
const LOGIN_OTP_STORE = new Map();

// send Login otp
const sendLoginOtp = asyncHandler(async (req, res) => {
  // get login credential from --> req.body
  // mobile or email
  //check if user exists
  //password check
  //access and referesh token
  //send cookie

  const { email_or_mobile } = req.body;

  if (!email_or_mobile) {
    throw new ApiError(400, "email or mobile is required");
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
      console.log("OTP sent to this mobile:", email_or_mobile);
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

    //set otpWithExpiration in LOGIN_OTP_STORE in memory
    LOGIN_OTP_STORE.set("otpWithExpiration", {
      otp,
      expiration: otpExpiration,
    });

    res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error sending OTP");
  }
});
module.exports = { sendLoginOtp };
