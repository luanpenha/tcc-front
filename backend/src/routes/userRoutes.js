import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { getUsers, getUserById, updateProfile, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', adminMiddleware, getUsers);
router.put('/me', updateProfile);
router.get('/:id', adminMiddleware, getUserById);
router.put('/:id', adminMiddleware, updateUser);
router.delete('/:id', adminMiddleware, deleteUser);

export default router;
