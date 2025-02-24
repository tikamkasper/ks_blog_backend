const { Customer } = require("../../models/customer/customerModel.js");
const { REGISTER_OTP_STORE } = require("../../helpers/otpStore.js");
const { CustomError } = require("../../utils/CustomError.js");
const { Response } = require("../../utils/Response.js");
const { asyncHandler } = require("../../utils/asyncHandler.js");

const { otpGenerator } = require("../../helpers/otpGenerator.js");
const { sendEmail } = require("../../helpers/nodemailer.js");
const { sendSMS } = require("../../helpers/twilio.js");

// Controller => send OTP signup/registration
const sendOtp = asyncHandler(async (req, res, next) => {
  // get signupCredentials from req.body
  // check if email or mobile is provided or not
  // check if email or mobile is valid or not
  // Check if the user already exists based on email or mobile
  // create otp and otpExpiration
  // if user credentials is a mobile number, send OTP via Twilio SMS
  // if user credentials is an email, send OTP using Nodemailer email
  // store OTP and expiration in memory (use email_or_mobile as key)
  // return response
  /*__________________________________________________________________________*/

  // get credentials from req.body
  const { email_or_mobile } = req.body;
  // check if email or mobile is provided or not
  if (!email_or_mobile) {
    return next(
      new CustomError({
        userErrorMessage: "Please provide email or mobile.",
        statusCode: 400,
      })
    );
  }

  // check if email or mobile is valid or not
  const mobileRegex = /^[0-9]{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isMobile = mobileRegex.test(email_or_mobile);
  const isEmail = emailRegex.test(email_or_mobile);

  if (!isEmail && !isMobile) {
    return next(
      new CustomError({
        userMessage: "Invalid email or mobile.",
        devMessage: /^\d+$/.test(email_or_mobile)
          ? `Invalid mobile number: ${email_or_mobile}`
          : `Invalid email: ${email_or_mobile}.`,
        statusCode: 400,
      })
    );
  }

  // Check if the customer already exists based on email or mobile
  const customerExists = await Customer.findOne({
    $or: [{ email: email_or_mobile }, { mobile: email_or_mobile }],
  });
  if (customerExists) {
    return next(
      new CustomError({
        userMessage: `This ${isEmail ? "email" : "mobile number"} is already registered. Please login.`,
        devMessage: `Customer with ${isEmail ? "email" : "mobile number"}: ${
          email_or_mobile
        } already exists.`,
        statusCode: 409,
      })
    );
  }

  // create otp and otpExpiration
  const { otp, expiration } = otpGenerator();

  try {
    // Send OTP via email
    if (isEmail) {
      await sendEmail({
        email: email_or_mobile,
        subject: "E_SHOP Signup/Registration OTP.",
        text: `E_SHOP Signup/Registration OTP.\nThis is your OTP: ${otp}\nIt will expire in 5 minutes.`,
      });
    }
    // Send OTP via SMS
    if (isMobile) {
      await sendSMS({
        mobile: email_or_mobile,
        body: `E_SHOP Signup/Registration OTP.\nThis is your OTP: ${otp}\nIt will expire in 5 minutes.`,
      });
    }

    // store OTP and expiration in memory (use email_or_mobile as key)
    REGISTER_OTP_STORE.set(email_or_mobile, { otp, expiration });

    // return response with success message
    return Response.success({
      res,
      statusCode: 200,
      message: `OTP sent successfully to: ${email_or_mobile}`,
      data: {},
    });
  } catch (error) {
    return next(
      new CustomError({
        userMessage: "OTP sending failed. Please try again later.",
        devMessage: `Error sending OTP: ${error.message}`,
        statusCode: 500,
      })
    );
  }
});

module.exports = { sendOtp };
