import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { getDashboardInfo } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getDashboardInfo);

export default router;
