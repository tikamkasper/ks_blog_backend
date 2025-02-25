class CustomError extends Error {
  constructor({
    userMessage = "Internal Server Error. Please try again later.",
    devMessage = "No error message provided for dev.",
    statusCode = 500,
  } = {}) {
    super(devMessage);
    this.userMessage = userMessage;
    this.statusCode = statusCode;
    Error.stackTraceLimit = 10;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = { CustomError };
