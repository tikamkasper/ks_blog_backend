const { User } = require("../../../models/user/customerModel.js");
const { ApiError } = require("../../../utils/ApiError.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const {
  generateRefreshToken,
} = require("../../../helpers/registerSignupHelper.js");

//register user
const registerUser = asyncHandler(async (req, res) => {
  // get user details from -> req.body
  // all fields are required
  // password and confirm password must match
  // check if user already exists: email, mobile
  // create user object - create entry in db
  // check for user creation
  // create refresh token
  // set refresh token in response.cookie("rt", refreshToken, {httpOnly: true,secure: true,})
  // remove password and refresh token field from response
  // return response- "User registered Successfully"

  const { username, email, mobile, password, confirm_password } = req.body;

  // if (!username || !email || !mobile || !password || !confirm_password) {
  //   throw new ApiError(400, "All fields are required");
  // }

  if (
    [username, email, mobile, password, confirm_password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // if (!confirm_password) {
  //   throw new ApiError(400, "Please Enter Confirm Passpord");
  // }
  if (password !== confirm_password) {
    throw new ApiError(400, "Password and Confirm Password not match");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User already exists with this email or mobile, please login."
    );
  }

  const newUser = new User({
    username,
    email,
    mobile,
    password,
  });

  const user = await newUser.save();

  // const createdUser = await User.findById(user._id).select(
  //   "-password -refreshToken"
  // );

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  const refreshToken = generateRefreshToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("rt", refreshToken, cookieOptions)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

module.exports = { registerUser };
