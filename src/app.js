const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  globalErrorMiddleware,
} = require("./middlewares/globalErrorMiddleware.js");

// Create app
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Include Cloudinary configuration
require("./utils/cloudinary.js");

// Routes import
const userRoutes = require("./routes/userRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");

//Routes declaration
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/blogs/", blogRoutes);

// http://localhost:8000/api/v1/user/register

//Global error middleware
app.use(globalErrorMiddleware);

// Export app
module.exports = { app };
