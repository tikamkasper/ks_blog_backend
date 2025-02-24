const { NODE_ENV } = require("../config");

class Response {
  static success({
    res,
    statusCode = 200,
    message = "Request successful.",
    data = {},
  } = {}) {
    return res.status(statusCode).json({
      statusCode,
      success: true,
      message,
      data,
    });
  }

  static error({
    res,
    statusCode = 500,
    message = "Internal Server Error. Please try again later.",
    devMessage = "No error message provided for dev.",
    errorStack = "No error stack provided for dev.",
    error = { message: "No error provided for dev." },
  } = {}) {
    return res.status(statusCode).json({
      statusCode,
      success: false,
      message,
      ...(NODE_ENV === "development" && {
        devMessage,
        errorStack,
        error,
      }),
    });
  }
}

module.exports = { Response };
