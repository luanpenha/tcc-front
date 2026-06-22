import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { listLogs, getLogById } from '../controllers/logController.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get('/', listLogs);
router.get('/:id', getLogById);

export default router;
