const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Protect route — requires valid JWT
const protect = async (req, res, next) => {
  let token;

  // Accept token from Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorised — no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Optional auth — attaches user if token present, but doesn't block
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // ignore — just leave req.user undefined
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
