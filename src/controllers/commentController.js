const { Comment } = require("../models/commentModel.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { CustomError } = require("../utils/CustomError.js");
const { Response } = require("../utils/Response.js");

// Create new comment or update the comment
exports.createComment = asyncHandler(async (req, res, next) => {
  const { commentContent } = req.body;
  const comment = new Comment({ commentContent, createrUserId: req.user.id });
  const review = {
    userId: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.userId.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.userId.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
