const express = require("express");
const { createComment } = require("../controllers/commentController.js");
const router = express.Router();

router.route("/").post(createComment);

module.exports = router;
