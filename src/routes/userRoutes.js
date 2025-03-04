const express = require("express");
const {
  verifyJWT,
  authorizeRoles,
} = require("../middlewares/authMiddleware.js");

const {
  loginUser,
  logoutUser,
  profileUser,
  createUser,
  getAllUsers,
} = require("../controllers/userController.js");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, profileUser);

router.route("/").post(verifyJWT, authorizeRoles("admin"), createUser);
router.route("/").get(verifyJWT, authorizeRoles("admin"), getAllUsers);

module.exports = router;
