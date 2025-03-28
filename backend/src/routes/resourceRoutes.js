import express from 'express';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getResources
} from '../controllers/resourceController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getResources);
router.get('/:id', getResourceById);

// Protected routes - require authentication
router.post('/', auth, createResource);
router.put('/:id', auth, updateResource);
router.delete('/:id', auth, deleteResource);

export default router;