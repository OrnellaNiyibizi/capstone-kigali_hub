// Import dotenv if needed to load environment variables from .env file
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Export an async function that Jest will await
export default async function () {
  // Load environment variables
  dotenv.config({ path: '.env' });

  // Set up environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

  // Use MongoDB Atlas connection string - either from env variable or set a test DB
  if (!process.env.DB_URI) {
    // If no URI is provided in env, use this one with test database name
    process.env.DB_URI = process.env.ATLAS_URI || 'mongodb+srv://your-atlas-connection-string/test-database';
  }

  console.log('Jest setup complete. Using MongoDB connection at:', process.env.DB_URI);
}