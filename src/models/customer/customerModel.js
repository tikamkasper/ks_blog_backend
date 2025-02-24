const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require("../../config");

const customerSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "customer",
      required: [true, "User role is required !"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value) {
          return (
            !value ||
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          );
        },
        message: "Invalid email address. Please enter a valid email address.",
      },
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value) {
          return !value || /^[0-9]{10}$/.test(value);
        },
        message: "Invalid mobile number",
      },
    },
    refresh_token: {
      type: String,
      select: false, // Exclude refresh_token from query results by default
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // Reference to Profile collection
      default: null,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addresses", // Reference to Addresses collection
      },
    ],
  },
  { timestamps: true }
);

customerSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const Customer = mongoose.model("Customer", customerSchema);
module.exports = { Customer };
