const { User } = require("../models/userModel.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { CustomError } = require("../utils/CustomError.js");
const { Response } = require("../utils/Response.js");
const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require("../config");
const {
  generateRefreshToken,
  verifyToken,
} = require("../helpers/jwtTokenGenerator.js");

//register user
exports.registerUser = asyncHandler(async (req, res, next) => {
  // get email from req.body
  const { fullName, email, password, confirmPassword } = req.body;

  // check if email is provided or not
  if (!fullName || !email || !password || !confirmPassword) {
    return next(
      new CustomError({
        userErrorMessage: "All fields are required",
        statusCode: 400,
      })
    );
  }

  if (password !== confirmPassword) {
    return next(
      new CustomError({
        userErrorMessage: "Password and Confirm Password must be same",
        devMessage: " Password and Confirm Password not same",
        statusCode: 400,
      })
    );
  }
  // check if email is valid or not
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmail = emailRegex.test(email);
  if (!isEmail) {
    return next(
      new CustomError({
        userMessage: "Please provide a valid email.",
        devMessage: `User enter invalide email format: ${email}`,
        statusCode: 400,
      })
    );
  }
  // check if password is valid or not
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.\-])[A-Za-z\d@$!%*?&_.\-]{8,30}$/;
  const isPassword = passwordRegex.test(password);
  if (!isPassword) {
    return next(
      new CustomError({
        userMessage:
          "Password must be between 8 and 30 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, $, !, %, *, ?, &, _, ., or -).",
        devMessage: `User enter invalide password format: ${password}`,
        statusCode: 400,
      })
    );
  }
  // Check if the user already exists in db or not with the same email.
  const userExists = await User.findOne({ email });
  if (userExists) {
    // return response
    return Response.success({
      res,
      statusCode: 200,
      message: "User already exists",
      data: { userExists },
    });
  }

  //   // check user token
  //   const token = req.cookies?.b_rt;
  //   const isValid = verifyToken(
  //     token,
  //     REFRESH_TOKEN_SECRET,
  //     REFRESH_TOKEN_EXPIRY
  //   );

  //   if (!token || !isValid) {
  //     // generate refreshToken
  //     const refreshToken = await generateRefreshToken(userExists._id);
  //     // set refresh token in cookie
  //     res.cookie("rt", refreshToken, { httpOnly: true, secure: true });
  //     // return response
  //     return Response.success({
  //       res,
  //       statusCode: 200,
  //       message: "User login successfully",
  //       data: { user: userExists },
  //     });
  //   }

  //   // return response
  //   return Response.success({
  //     res,
  //     statusCode: 200,
  //     message: "User login successfully",
  //     data: { user: userExists },
  //   });
  // }

  // create new user in db

  const newUser = new User({ fullName, email, password });

  const user = await newUser.save();

  // check user create or not
  const createdUser = await User.findById(user._id).select("-__v");

  if (!createdUser) {
    return next(
      new CustomError({
        userMessage: "Something went wrong. Please try again.",
        devMessage: "User is not create/save in mongodb.",
        statusCode: 500,
      })
    );
  }

  // return response
  return Response.success({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: { createdUser },
  });
});

// login user
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password -__v");
  if (!user) {
    return next(
      new CustomError({
        userMessage: "Invalid email or password",
        devMessage: "User not found in database",
        statusCode: 401,
      })
    );
  }
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    return next(
      new CustomError({
        userMessage: "Invalid email or password",
        devMessage: "Password is not match",
        statusCode: 401,
      })
    );
  }
  // generate refreshToken
  const refreshToken = await generateRefreshToken(user._id);

  // set refresh token in cookie
  res.cookie("rt", refreshToken, { httpOnly: true, secure: true });
  // Convert Mongoose document to plain object and remove password
  const userObj = user.toObject();
  delete userObj.password;
  // return response
  return Response.success({
    res,
    statusCode: 200,
    message: "User logged in successfully.",
    data: { user: userObj },
  });
});

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
  // delete refresh token from cookie
  res.clearCookie("rt", { httpOnly: true, secure: true });

  // return response
  return Response.success({
    res,
    statusCode: 200,
    message: "Logged out successfully.",
    data: {},
  });
});

// check profile
exports.profileUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  // return response
  return Response.success({
    res,
    statusCode: 200,
    message: "User profile retrieved successfully",
    data: { user },
  });
});
