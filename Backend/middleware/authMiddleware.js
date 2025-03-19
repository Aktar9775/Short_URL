const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]|| req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');

    // ✅ Fetch user from database and attach to req object
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid user' });
    }

    req.user = user; // ✅ Attach full user object to req.user
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
