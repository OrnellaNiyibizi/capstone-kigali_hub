import rateLimit from 'express-rate-limit';

// General API rate limiter - moderate limits
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// More strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login/register attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many login attempts from this IP, please try again after an hour'
  }
});

// Limiter for write operations (POST, PUT, DELETE)
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 write operations per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many write operations from this IP, please try again after 15 minutes'
  }
});