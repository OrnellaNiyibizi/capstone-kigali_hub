import { jest } from '@jest/globals';

describe('Jest Setup Test', () => {
  it('should have environment variables configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.DB_URI).toBeDefined();
  });

  it('should have MongoDB connection string correctly formatted', () => {
    expect(typeof process.env.DB_URI).toBe('string');
    // Using Atlas format for expectations
    expect(process.env.DB_URI).toContain('mongodb+srv://');
  });
});