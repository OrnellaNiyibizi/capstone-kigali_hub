import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your routes
import userRoutes from './routes/userRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middleware
// In your backend CORS configuration
app.use(cors({
  origin: true, // Temporarily allow all origins - not recommended for production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

mongoose.set('strictQuery', false);

// Database connection
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/discussions', discussionRoutes);

// Hello World route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Error handling middleware
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the Express API for Vercel
export default app;