const mongoose = require("mongoose");

const gustUserSchema = new mongoose.Schema(
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
      default: "gustUser",
      required: [true, " Role is required."],
    },
  },
  { timestamps: true }
);

const GustUser = mongoose.model("GustUser", gustUserSchema);
module.exports = { GustUser };
