import mongoose from 'mongoose';

export default async function () {
  try {
    // Close any mongoose connections
    await mongoose.connection.close();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}
