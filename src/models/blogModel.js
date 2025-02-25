const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    category: {
      type: String,
      required: [true, "Please Enter Blog Category."],
    },
    blogContent: {
      type: String,
      trim: true,
      required: [true, "Please Provide Some Blog Text."],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    likes: {
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      count: {
        type: Number,
        default: 0,
      },
    },
    dislikes: {
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      count: {
        type: Number,
        default: 0,
      },
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createrUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updaterUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: { type: String, default: new Date() },
    updatedAt: { type: String, default: new Date() },
  }
  // { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = { Blog };
