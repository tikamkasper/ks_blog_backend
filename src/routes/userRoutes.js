const express = require("express");
const {
  verifyJWT,
  authorizeRoles,
} = require("../middlewares/authMiddleware.js");

const {
  registerUser,
  logoutUser,
  profileUser,
  loginUser,
} = require("../controllers/userController.js");

const router = express.Router();

router
  .route("/register")
  .post(verifyJWT, authorizeRoles("admin"), registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyJWT, profileUser);
router.route("/logout").post(verifyJWT, logoutUser);
module.exports = router;
