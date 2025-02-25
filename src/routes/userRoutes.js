const express = require("express");
const { verifyJWT } = require("../middlewares/authMiddleware.js");

const {
  registerUser,
  logoutUser,
} = require("../controllers/userController.js");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/logout").post(verifyJWT, logoutUser);
module.exports = router;
