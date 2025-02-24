const { User } = require("../../../models/user/userModel.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");

// logout user
exports.logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refresh_token: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("rt", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
