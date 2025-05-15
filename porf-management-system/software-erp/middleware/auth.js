const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  // For development mode, bypass authentication
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('Auth middleware bypassed in development mode');
    req.user = { _id: '123456789012', name: 'Dev User', role: 'admin' };
    return next();
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
      // Get user from the token
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      console.error('Database error:', error);
      // For development, create a mock user if database is not available
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user in development mode');
        req.user = { _id: decoded.id, name: 'Dev User', role: 'admin' };
        next();
      } else {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role) {
      return res.status(403).json({ success: false, message: 'User role not defined' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
    }
    
    next();
  };
};
