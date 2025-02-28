import express from 'express';
import {
  createDiscussion,
  getAllDiscussions,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  addComment,
  deleteComment
} from '../controllers/discussionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllDiscussions);
router.get('/:id', getDiscussionById);

// Protected routes
router.post('/', auth, createDiscussion);
router.put('/:id', auth, updateDiscussion);
router.delete('/:id', auth, deleteDiscussion);

// Comment routes
router.post('/:id/comments', auth, addComment);
router.delete('/:discussionId/comments/:commentId', auth, deleteComment);

export default router;