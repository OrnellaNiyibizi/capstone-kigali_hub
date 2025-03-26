import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../utils/config.js';

const auth = async (req, res, next) => {
  try {
    let token;

    // Extract token from header (improved format checking)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Find user and select without password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      // Token verification failed
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Access token expired',
          tokenExpired: true
        });
      }

      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Auth server error' });
  }
};

export default auth;