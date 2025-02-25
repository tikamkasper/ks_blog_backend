const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require("../config");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "Please enter a valid email.",
      },
    },
    role: {
      type: String,
      default: "user",
      required: [true, " Role is required."],
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    refresh_token: {
      type: String,
      select: false,
    },
    createdAt: { type: String, default: new Date() },
    updatedAt: { type: String, default: new Date() },
  }
  // { timestamps: true }
);

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
