const express = require("express");
const { upload } = require("../middlewares/multerMiddleware.js");
const {
  verifyJWT,
  authorizeRoles,
} = require("../middlewares/authMiddleware.js");
const {
  createBlog,
  getAllBlogs,
  getVerifiedBlogs,

  getBlogById,
  deleteBlogById,
  updatedBlogById,
} = require("../controllers/blogController.js");

const router = express.Router();

router
  .route("/")
  .post(
    verifyJWT,
    authorizeRoles("user", "admin"),
    upload.single("image"),
    createBlog
  );
router.route("/").get(verifyJWT, authorizeRoles("user", "admin"), getAllBlogs);
router.route("/verified").get(getVerifiedBlogs);

router.route("/:id").get(getBlogById);

router.route("/:id").delete(verifyJWT, authorizeRoles("admin"), deleteBlogById);
router
  .route("/:id")
  .put(
    verifyJWT,
    authorizeRoles("user", "admin"),
    upload.single("image"),
    updatedBlogById
  );

module.exports = router;
