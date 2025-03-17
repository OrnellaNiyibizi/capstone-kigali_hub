import { jest } from '@jest/globals';
import mongoose from 'mongoose';

/**
 * Creates mock request and response objects for controller testing
 */
export function createMockReqRes() {
  const req = {
    body: {},
    params: {},
    query: {},
    user: { id: 'mockUserId' }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    set: jest.fn().mockReturnThis()
  };

  return { req, res };
}

/**
 * Connect to MongoDB database for testing
 */
export async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to test database');
  }
}

/**
 * Clear all collections in the test database
 */
export async function clearDatabase() {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('Test database cleared');
  }
}

/**
 * Close the database connection
 */
export async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}