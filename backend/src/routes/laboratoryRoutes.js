import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { listLaboratories, getLaboratory, createLaboratory, updateLaboratory, deleteLaboratory } from '../controllers/laboratoryController.js';

const router = express.Router();

router.get('/', authMiddleware, listLaboratories);
router.get('/:id', authMiddleware, getLaboratory);
router.post('/', authMiddleware, adminMiddleware, createLaboratory);
router.put('/:id', authMiddleware, adminMiddleware, updateLaboratory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteLaboratory);

export default router;
