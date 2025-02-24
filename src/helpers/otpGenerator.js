const crypto = require("crypto");

// Generate OTP and expiration time
const otpGenerator = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiration = Date.now() + 5 * 60 * 1000; // Set absolute expiration time (5 minutes from now)
  return { otp, expiration };
};

module.exports = { otpGenerator };
