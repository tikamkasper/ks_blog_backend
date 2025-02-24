const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema, model } = mongoose;
const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require("../../config");

const nameSchema = new Schema({
  first_name: {
    type: String,
    trim: true,
    required: [true, "First name is required !"],
  },
  last_name: {
    type: String,
    trim: true,
    required: [true, "Last name is required !"],
  },
});

const userSchema = new Schema(
  {
    name: {
      type: nameSchema,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      validate: {
        validator: function (value) {
          return (
            /^[a-zA-Z][a-zA-Z0-9@_.]{5,29}$/.test(value) &&
            !/\s/.test(value) &&
            !/[@_.]{2,}/.test(value)
          );
        },
        message: function (props) {
          return `Invalid username "${props.value}".
            - It must start with a letter.
            - It should be between 6 to 30 characters long.
            - Only letters, numbers, @, underscores (_), and periods (.) are allowed.
            - Spaces are **not** allowed.
            - Consecutive special characters like "__", "..", "@@", "_@", etc., are **not** allowed.
            Examples of valid usernames:
           - user_name123
           - user.name
           - User123`;
        },
      },
    },
    email: {
      type: String,
      unique: true,
      require: [true, "email is required !"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "Invalid email address. Please enter a valid email address.",
      },
    },
    mobile: {
      type: String,
      unique: true,
      required: [true, "mobile number is required!"],
      validate: {
        validator: function (value) {
          return /^[0-9]{10}$/.test(value);
        },
        message: "invalid mobile number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.\-])[A-Za-z\d@$!%*?&_.\-]{8,30}$/.test(
            value
          );
        },
        message:
          "Password must be between 8 and 30 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, $, !, %, *, ?, &, _, ., or -).",
      },
      select: false, // Exclude password from query results by default
    },
    role: {
      type: String,
      default: "customer", // admin,customer,seller
      required: [true, "user role is required !"],
    },
    refresh_token: {
      type: String,
      select: false, // Exclude password from query results by default
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const User = model("User", userSchema);
module.exports = { User };
