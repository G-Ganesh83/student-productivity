const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

export default errorHandler;
