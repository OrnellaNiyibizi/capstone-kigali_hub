import jwt from 'jsonwebtoken';
import config from './config.js';

// Generate access token (short-lived, 15 minutes)
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: '15m'
  });
};

// Generate refresh token (long-lived, 7 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  });
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);
    return { valid: true, expired: false, id: decoded.id };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === 'TokenExpiredError',
      id: null
    };
  }
};