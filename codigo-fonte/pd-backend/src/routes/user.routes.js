
import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
