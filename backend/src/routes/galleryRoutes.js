import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { uploadGalleryImages } from '../middlewares/upload.js';
import { listGallery, getGalleryItem, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', listGallery);
router.get('/:id', getGalleryItem);
router.use(authMiddleware);
router.post('/', adminMiddleware, uploadGalleryImages, createGalleryItem);
router.put('/:id', adminMiddleware, uploadGalleryImages, updateGalleryItem);
router.delete('/:id', adminMiddleware, deleteGalleryItem);

export default router;
