import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { listMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController.js';

const router = express.Router();

router.get('/', listMaterials);
router.get('/:id', getMaterial);
router.use(authMiddleware);
router.post('/', adminMiddleware, createMaterial);
router.put('/:id', adminMiddleware, updateMaterial);
router.delete('/:id', adminMiddleware, deleteMaterial);

export default router;
