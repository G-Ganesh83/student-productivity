/**
 * 404 Not Found Middleware
 * Catches requests to undefined routes and forwards a 404 error to errorHandler.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Central Error-Handling Middleware
 * Formats all uncaught and forwarded errors consistently.
 * Hides stack traces in production to prevent sensitive internal path leakage.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Async handler wrapper to catch unhandled promise rejections
 * and forward them to the central error-handling middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;
