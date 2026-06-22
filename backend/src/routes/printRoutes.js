import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadPrintFile } from '../middlewares/upload.js';
import { createPrintRequest, getPrintRequests, getPrintRequestById, updatePrintRequest, deletePrintRequest } from '../controllers/printController.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/', uploadPrintFile, createPrintRequest);
router.get('/', getPrintRequests);
router.get('/:id', getPrintRequestById);
router.put('/:id', uploadPrintFile, updatePrintRequest);
router.delete('/:id', deletePrintRequest);

export default router;
