const { User } = require("../../models/user/userModel.js");
const { asyncHandler } = require("../../utils/asyncHandler.js");

const getProfile = asyncHandler(async (req, res) => {
  //query on profile model and populate user detail
  const user = await User.findById(req.user?._id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "get user profile successfully."));
});
module.exports = { getProfile };
