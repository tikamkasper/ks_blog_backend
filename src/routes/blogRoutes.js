const express = require("express");
const { createBlog } = require("../controllers/blogController.js");
const { upload } = require("../middlewares/multerMiddleware.js");

const router = express.Router();

router.route("/create").post(upload.single("image"), createBlog);
module.exports = router;
