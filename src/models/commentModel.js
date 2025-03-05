const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    createrUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    commentContent: {
      type: String,
      trim: true,
      required: [true, "Please Provide Some Comment Text."],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment };
