const { Router } = require("express");
const { verifyJWT } = require("../../middlewares/authMiddleware.js");

const router = Router();

router.route("/change/password").post(verifyJWT, changeCurrentPassword); //secured routes
router.route("/profile").get(verifyJWT, getCurrentUser); //secured routes

module.exports = router;
