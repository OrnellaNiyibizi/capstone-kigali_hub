import { jest } from '@jest/globals';
// Change this line from default import to named imports
import * as resourceController from '../../controllers/resourceController.js';

// Mock the Resource model
jest.mock('../../models/Resource.js', () => {
  // Create a proper mock constructor
  const mockConstructor = jest.fn();

  // Add the required methods to the mock
  mockConstructor.find = jest.fn().mockReturnThis();
  mockConstructor.findById = jest.fn().mockReturnThis();
  mockConstructor.findByIdAndUpdate = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  mockConstructor.sort = jest.fn().mockReturnThis();
  mockConstructor.populate = jest.fn();

  return mockConstructor;
});

// Import the mock so you can reference it
import Resource from '../../models/Resource.js';

// Setup common mocks for mongoose methods
Resource.find = jest.fn().mockReturnThis();
Resource.findById = jest.fn().mockReturnThis();
Resource.findByIdAndUpdate = jest.fn();
Resource.sort = jest.fn().mockReturnThis();
Resource.populate = jest.fn();

// Mock utility for req/res objects
const createMockReqRes = () => ({
  req: {
    body: {},
    params: {},
    query: {},
    user: {}
  },
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  }
});

// Mock console for testing logs
global.console = {
  log: jest.fn(),
  error: jest.fn()
};

describe('Resource Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create fresh mock req/res objects
    const mocks = createMockReqRes();
    req = mocks.req;
    res = mocks.res;
  });

  // describe('createResource', () => {
  //   it('should create a new resource successfully', async () => {
  //     // Arrange
  //     req.body = {
  //       title: 'Test Resource',
  //       description: 'This is a test resource',
  //       category: 'Test'
  //     };
  //     req.user = { id: 'userId123' };

  //     const mockResource = {
  //       ...req.body,
  //       user: req.user.id,
  //       _id: 'resource123'
  //     };

  //     // Configure the constructor mock to return an object with save method
  //     Resource.mockImplementation(() => ({
  //       ...mockResource,
  //       save: jest.fn().mockResolvedValue(mockResource)
  //     }));

  //     // Act
  //     await resourceController.createResource(req, res);

  //     // Assert
  //     expect(Resource).toHaveBeenCalledWith({
  //       ...req.body,
  //       user: 'userId123'
  //     });
  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: 'Resource created successfully',
  //       resource: expect.objectContaining(mockResource)
  //     });
  //   });

  //   it('should return 400 when there is an error', async () => {
  //     // Arrange
  //     req.body = { title: 'Test Resource' };
  //     const errorMessage = 'Validation failed';

  //     Resource.mockImplementation(() => ({
  //       ...req.body,
  //       save: jest.fn().mockRejectedValue(new Error(errorMessage))
  //     }));

  //     // Act
  //     await resourceController.createResource(req, res);

  //     // Assert
  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  //   });
  // });

  describe('getResourceById', () => {
    it('should return the resource when found', async () => {
      // Arrange
      req.params = { id: 'resourceId123' };

      const mockResource = {
        _id: 'resourceId123',
        title: 'Test Resource',
        description: 'Test description'
      };

      // Configure method chain with final value
      Resource.findById.mockReturnThis();
      Resource.populate.mockResolvedValue(mockResource);

      // Act
      await resourceController.getResourceById(req, res);

      // Assert
      expect(Resource.findById).toHaveBeenCalledWith('resourceId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResource);
    });

    it('should return 404 when resource is not found', async () => {
      // Arrange
      req.params = { id: 'nonExistentId' };

      Resource.findById.mockReturnThis();
      Resource.populate.mockResolvedValue(null);

      // Act
      await resourceController.getResourceById(req, res);

      // Assert
      expect(Resource.findById).toHaveBeenCalledWith('nonExistentId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
    });
  });

  describe('updateResource', () => {
    it('should update resource when user is authorized', async () => {
      // Arrange
      req.params = { id: 'resourceId123' };
      req.body = { title: 'Updated Resource' };
      req.user = { id: 'userId123' };

      const mockResource = {
        _id: 'resourceId123',
        title: 'Original Resource',
        user: {
          toString: jest.fn().mockReturnValue('userId123')
        }
      };

      const updatedResource = {
        ...mockResource,
        title: 'Updated Resource'
      };

      Resource.findById.mockResolvedValue(mockResource);
      Resource.findByIdAndUpdate.mockResolvedValue(updatedResource);

      // Act
      await resourceController.updateResource(req, res);

      // Assert
      expect(Resource.findById).toHaveBeenCalledWith('resourceId123');
      expect(Resource.findByIdAndUpdate).toHaveBeenCalledWith(
        'resourceId123',
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getResources', () => {
    it('should return filtered resources', async () => {
      // Arrange
      req.query = {
        category: 'Tech',
        title: 'tutorial',
        sortBy: 'newest'
      };

      const mockResources = [
        { title: 'Tech Tutorial 1' },
        { title: 'Tech Tutorial 2' }
      ];

      Resource.find.mockReturnThis();
      Resource.sort.mockReturnThis();
      Resource.populate.mockResolvedValue(mockResources);

      // Act
      await resourceController.getResources(req, res);

      // Assert
      expect(Resource.find).toHaveBeenCalledWith({
        category: { $regex: 'Tech', $options: 'i' },
        title: { $regex: 'tutorial', $options: 'i' }
      });
      expect(res.json).toHaveBeenCalledWith(mockResources);
    });
  });
});