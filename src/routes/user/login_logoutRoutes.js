const { Router } = require("express");
const { verifyJWT } = require("../../middlewares/authMiddleware.js");
const {
  sendLoginOtp,
} = require("../../controllers/user/login_logout/sendLoginOtpController.js");
const {
  verifyLoginOtpAndLogin,
} = require("../../controllers/user/login_logout/verifyLoginOtpAndLoginController.js");
const {
  logoutUser,
} = require("../../controllers/user/login_logout/logoutController.js");

const router = Router();

router.route("/login/send/otp").post(sendLoginOtp);
router.route("/login/verify/otp").post(verifyLoginOtpAndLogin);
router.route("/logout").post(verifyJWT, logoutUser);

module.exports = router;
