import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const createAuthError = (message) => {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createAuthError('No token provided'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(createAuthError('User not found'));
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createAuthError('Token expired'));
    }

    return next(createAuthError('Invalid token'));
  }
};

export default authMiddleware;
