const express = require("express");
const { upload } = require("../middlewares/multerMiddleware.js");
const {
  verifyJWT,
  authorizeRoles,
} = require("../middlewares/authMiddleware.js");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getAllBlogsAdmin,
  deleteBlogAdimn,
  updateBlogAdmin,
} = require("../controllers/blogController.js");

const router = express.Router();

router.route("/create").post(verifyJWT, upload.single("image"), createBlog);
router.route("/get").get(getAllBlogs);
router
  .route("/getAdimn")
  .get(verifyJWT, authorizeRoles("admin"), getAllBlogsAdmin);
router.route("/get/:id").get(getBlogById);
router
  .route("/delete/:id")
  .delete(verifyJWT, authorizeRoles("admin"), deleteBlogAdimn);
router
  .route("/update/:id")
  .put(
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("image"),
    updateBlogAdmin
  );

module.exports = router;
