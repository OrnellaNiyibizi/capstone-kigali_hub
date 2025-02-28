import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import config from './utils/config.js';

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Fix deprecation warnings
mongoose.set('strictQuery', false);

// Database connection
mongoose.connect(config.DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/discussions', discussionRoutes);

// Error handling middleware
app.use(errorHandler);

const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on http://${config.HOST}:${config.PORT}`);
});