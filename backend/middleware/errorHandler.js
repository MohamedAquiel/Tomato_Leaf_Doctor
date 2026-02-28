
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: '${err.value}' is not a valid ID.`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || "field";
    const duplicatedValue = err.keyValue ? err.keyValue[duplicatedField] : "";
    message = `Duplicate value '${duplicatedValue}' for field '${duplicatedField}'. Please use a different value.`;
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }
  if (err.name === "NotBeforeError") {
    statusCode = 401;
    message = "Token not yet active. Please log in again.";
  }
  const responseBody = { success: false, error: message };
  if (process.env.NODE_ENV === "development") {
    responseBody.stack = err.stack;
  }
  if (statusCode >= 500) {
    console.error(`[ErrorHandler] ${statusCode} - ${message}`);
    if (process.env.NODE_ENV === "development") {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;
