const { Response } = require("../utils/Response.js");

const globalErrorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message =
    err.userMessage || "Internal Server Error. Please try again later.";
  let devMessage = err.message || "No error message provided for dev.";
  let errorStack = err.stack || "Could not trace any error stack.";
  let error = err || { message: "Could not trace any error." };

  return Response.error({
    res,
    statusCode,
    message,
    devMessage,
    errorStack,
    error,
  });
};
module.exports = { globalErrorMiddleware };
