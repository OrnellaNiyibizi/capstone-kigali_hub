import { jest } from '@jest/globals';
import * as userController from '../../controllers/userController.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { createMockReqRes } from '../test-helpers.js';

// Mock User constructor and static methods properly
const mockUser = jest.fn().mockImplementation((data) => {
  return {
    ...data,
    save: jest.fn().mockResolvedValue({
      _id: 'newUserId',
      ...data
    })
  };
});

// Add static methods to the mock constructor
mockUser.find = jest.fn().mockReturnThis();
mockUser.findById = jest.fn().mockReturnThis();
mockUser.findOne = jest.fn();
mockUser.select = jest.fn();

// Replace the User import with our mock
jest.mock('../../models/User.js', () => mockUser);

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token')
}));

describe('User Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    const mockData = createMockReqRes();
    req = mockData.req;
    res = mockData.res;
  });

  describe('getAllUsers', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [{ name: 'Test User', email: 'test@example.com' }];
      User.find = jest.fn().mockReturnThis();
      User.find().select = jest.fn().mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(User.find).toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=600');
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return status 500 when database error occurs', async () => {
      const errorMessage = 'Database error';
      User.find = jest.fn().mockReturnThis();
      User.find().select = jest.fn().mockRejectedValue(new Error(errorMessage));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getUserById', () => {
    it('should return user by ID with status 200', async () => {
      const mockUser = { name: 'Test User', email: 'test@example.com' };
      req.params.id = 'userId123';
      User.findById = jest.fn().mockReturnThis();
      User.findById().select = jest.fn().mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith('userId123');
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=300');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user not found', async () => {
      req.params.id = 'nonExistentId';
      User.findById = jest.fn().mockReturnThis();
      User.findById().select = jest.fn().mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  // describe('createUser', () => {
  //   it('should create a new user and return 201 status', async () => {
  //     const userData = { name: 'New User', email: 'new@example.com', password: 'password123' };
  //     req.body = userData;

  //     // Mock findOne to return null (user doesn't exist yet)
  //     User.findOne.mockResolvedValue(null);

  //     await userController.createUser(req, res);

  //     expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
  //     expect(mockUser).toHaveBeenCalledWith(expect.objectContaining({
  //       name: userData.name,
  //       email: userData.email,
  //       password: userData.password
  //     }));
  //     expect(res.set).toHaveBeenCalledWith('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
  //       name: userData.name,
  //       email: userData.email,
  //       token: expect.any(String)
  //     }));
  //   });

  //   it('should return 400 when user already exists', async () => {
  //     const userData = { name: 'Existing User', email: 'existing@example.com', password: 'password' };
  //     req.body = userData;

  //     User.findOne = jest.fn().mockResolvedValue({ email: userData.email });

  //     await userController.createUser(req, res);

  //     expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  //   });
  // });

  describe('loginUser', () => {
    it('should login user and return token when credentials are valid', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      req.body = credentials;

      const mockUser = {
        _id: 'userId123',
        name: 'Test User',
        email: credentials.email,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValue('mockToken');

      await userController.loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(credentials.password);
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        token: 'mockToken'
      }));
    });

    it('should return 401 when credentials are invalid', async () => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };
      req.body = credentials;

      User.findOne = jest.fn().mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(false)
      });

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });
  });
});