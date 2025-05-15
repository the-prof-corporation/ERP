const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes
exports.protect = async (req, res, next) => {
  // For development mode, bypass authentication
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('Auth middleware bypassed in development mode');
    req.user = { _id: '123456789012', name: 'Dev User', role: 'admin' };
    return next();
  }

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      try {
        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
        next();
      } catch (error) {
        console.error('Database error:', error);
        // For development, create a mock user if database is not available
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock user in development mode');
          req.user = { _id: decoded.id, name: 'Dev User', role: 'admin' };
          next();
        } else {
          res.status(401).json({ message: 'User not found' });
        }
      }
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  // For development mode, bypass admin check
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('Admin middleware bypassed in development mode');
    return next();
  }

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
