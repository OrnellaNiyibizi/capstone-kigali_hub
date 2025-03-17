import { jest } from '@jest/globals';
import * as discussionController from '../../controllers/discussionController.js';
import Discussion from '../../models/Discussion.js';

// Mock the Discussion model
jest.mock('../../models/Discussion.js');

describe('Discussion Controller Tests', () => {
  // Mock express request and response
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 'mockUserId' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      set: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('createDiscussion', () => {
  //   it('should create a new discussion and return 201 status', async () => {
  //     req.body = {
  //       title: 'Test Discussion',
  //       content: 'This is test content',
  //       category: 'General'
  //     };
  //     req.user = { id: 'userId123' };

  //     const mockDiscussion = {
  //       _id: 'discussionId123',
  //       ...req.body,
  //       user: req.user.id
  //     };

  //     const mockSave = jest.fn();
  //     Discussion.mockImplementation(() => ({
  //       save: mockSave.mockResolvedValue(mockDiscussion)
  //     }));

  //     Discussion.findById = jest.fn().mockReturnThis();
  //     Discussion.findById().populate = jest.fn().mockResolvedValue({
  //       ...mockDiscussion,
  //       user: { name: 'Test User', email: 'test@example.com' }
  //     });

  //     await discussionController.createDiscussion(req, res);

  //     expect(mockSave).toHaveBeenCalled();
  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
  //       message: 'Discussion created successfully'
  //     }));
  //   });
  // });

  describe('getAllDiscussions', () => {
    it('should return all discussions with status 200', async () => {
      const mockDiscussions = [
        { title: 'Discussion 1', content: 'Content 1' },
        { title: 'Discussion 2', content: 'Content 2' }
      ];

      Discussion.find = jest.fn().mockReturnThis();
      Discussion.find().populate = jest.fn().mockReturnThis();
      Discussion.find().populate().sort = jest.fn().mockResolvedValue(mockDiscussions);

      await discussionController.getAllDiscussions(req, res);

      expect(Discussion.find).toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith('Cache-Control', 'public, max-age=300');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDiscussions);
    });

    it('should filter discussions by category when provided', async () => {
      req.query = { category: 'Tech' };

      Discussion.find = jest.fn().mockReturnThis();
      Discussion.find().populate = jest.fn().mockReturnThis();
      Discussion.find().populate().sort = jest.fn().mockResolvedValue([]);

      await discussionController.getAllDiscussions(req, res);

      expect(Discussion.find).toHaveBeenCalledWith({ category: 'Tech' });
    });
  });

  describe('deleteDiscussion', () => {
    it('should delete a discussion when user is authorized', async () => {
      req.params = { id: 'discussionId123' };
      req.user = { id: 'userId123' };

      const mockDiscussion = {
        _id: 'discussionId123',
        user: 'userId123',
        toString: jest.fn().mockReturnValue('userId123')
      };

      Discussion.findById = jest.fn().mockResolvedValue(mockDiscussion);
      Discussion.findByIdAndDelete = jest.fn().mockResolvedValue({});

      await discussionController.deleteDiscussion(req, res);

      expect(Discussion.findById).toHaveBeenCalledWith('discussionId123');
      expect(Discussion.findByIdAndDelete).toHaveBeenCalledWith('discussionId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Discussion deleted successfully' });
    });

    it('should return 403 when user is not authorized', async () => {
      req.params = { id: 'discussionId123' };
      req.user = { id: 'differentUserId' };

      const mockDiscussion = {
        _id: 'discussionId123',
        user: 'userId123',
        toString: jest.fn().mockReturnValue('userId123')
      };

      Discussion.findById = jest.fn().mockResolvedValue(mockDiscussion);

      await discussionController.deleteDiscussion(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized to delete this discussion' });
      expect(Discussion.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });

  // describe('addComment', () => {
  //   it('should add a comment to a discussion', async () => {
  //     req.params = { id: 'discussionId123' };
  //     req.body = { content: 'This is a comment' };
  //     req.user = { id: 'userId123' };

  //     const mockDiscussion = {
  //       _id: 'discussionId123',
  //       comments: [],
  //       save: jest.fn().mockResolvedValue({})
  //     };

  //     Discussion.findById = jest.fn()
  //       .mockResolvedValueOnce(mockDiscussion)
  //       .mockReturnThis();

  //     Discussion.findById().populate = jest.fn().mockReturnThis();
  //     Discussion.findById().populate().populate = jest.fn().mockResolvedValue({
  //       ...mockDiscussion,
  //       comments: [{ content: 'This is a comment', user: { id: 'userId123' } }]
  //     });

  //     await discussionController.addComment(req, res);

  // expect(mockDiscussion.comments.push).toHaveBeenCalledWith(
  //   expect.objectContaining({
  //     content: 'This is a comment',
  //     user: 'userId123'
  //   })
  // );
  //     expect(mockDiscussion.save).toHaveBeenCalled();
  //     expect(res.status).toHaveBeenCalledWith(201);
  //   });
  // });
});