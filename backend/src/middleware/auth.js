import jwt from 'jsonwebtoken';
import config from '../utils/config.js';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default auth;