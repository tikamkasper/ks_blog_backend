const { Customer } = require("../models/customer/customerModel.js");
const { CustomError } = require("../utils/CustomError.js");

//Generate Refresh Token
const generateRefreshToken = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId);
    const refreshToken = customer.generateRefreshToken();

    customer.refresh_token = refreshToken;
    await customer.save({ validateBeforeSave: false });
    return refreshToken;
  } catch (error) {
    throw new CustomError({
      userMessage: "Internal Server Error.",
      devMessage: error.message, // Something went wrong while generating referesh token
      statusCode: 500,
    });
  }
};

module.exports = { generateRefreshToken };
