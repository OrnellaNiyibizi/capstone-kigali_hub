import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', auth, getUserProfile);

// Admin routes (might also need admin middleware)
router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.post('/', auth, createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

export default router;