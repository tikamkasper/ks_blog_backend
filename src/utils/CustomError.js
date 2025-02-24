/*--------------- some generic error message for users ---------------*/
// Something went wrong.
// Oops! Something went wrong on our end. Please try again later.
// We encountered an issue while processing your request. Please try again.
// Internal Server Error. Please try again later.
// An error occurred while processing your request.
/*--------------------------------------------------------------------*/

class CustomError extends Error {
  constructor({
    userMessage = "Internal Server Error. Please try again later.",
    devMessage = "No error message provided for dev.",
    statusCode = 500,
  } = {}) {
    super(devMessage); // To call the parent class's constructor and pass the error message
    this.userMessage = userMessage; // Custom error message for the user
    this.statusCode = statusCode; // Custom property for HTTP status codes
    Error.stackTraceLimit = 10; // Limit stack trace depth (default value is 10) or any number you prefer
    // If set to a non-number value, or set to a negative number, stack traces will not capture any frames.
    Error.captureStackTrace(this, this.constructor); // Optional for cleaner stack traces
  }
}
module.exports = { CustomError };
