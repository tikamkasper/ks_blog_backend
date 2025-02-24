const { Router } = require("express");

const {
  sendRegisterOtp,
} = require("../../controllers/user/register/sendRegisterOtpController.js");
const {
  verifyRegisterOtpLogin,
} = require("../../controllers/user/register/verifyRegisterOtp_Login_Controller.js");
const {
  registerUser,
} = require("../../controllers/user/register/registerController.js");

const router = Router();

router.route("/register/send_otp").post(sendRegisterOtp);
router.route("/register/verify_otp_login").post(verifyRegisterOtpLogin);
router.route("/register").post(registerUser);

module.exports = router;
