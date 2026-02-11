import express from 'express';
import { uploadDocument, getMyDocuments, verifyDocument } from '../../controllers/verificationController.js';
import { authenticateUser } from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer Setup for Local Uploads (for now)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
router.post('/upload', authenticateUser, upload.single('document'), uploadDocument);
router.get('/my-documents', authenticateUser, getMyDocuments);

// Admin Routes
router.put('/:documentId/verify', authenticateUser, authorize(['ADMIN']), verifyDocument);
router.put('/:documentId/verify/:subDocId', authenticateUser, authorize(['ADMIN']), verifyDocument);

export default router;
