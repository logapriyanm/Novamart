import express from 'express';
import kycController from '../../controllers/verification/kycController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';
import auditLog from '../../middleware/audit.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Manufacturer/Seller: Upload KYC documents
router.post('/upload',
    authorize(['MANUFACTURER', 'SELLER']),
    auditLog('KYC_UPLOAD', 'KYC'),
    kycController.uploadKYCDocument
);

// Manufacturer/Seller: Get my KYC documents
router.get('/my-documents',
    authorize(['MANUFACTURER', 'SELLER']),
    kycController.getMyKYCDocuments
);

// Admin: Get pending KYC documents
router.get('/pending',
    authorize(['ADMIN']),
    kycController.getPendingKYCDocuments
);

// Admin: Review KYC document (approve/reject)
router.patch('/:id/review',
    authorize(['ADMIN']),
    auditLog('KYC_REVIEW', 'KYC'),
    kycController.reviewKYCDocument
);

// Admin: Revoke verification
router.post('/revoke',
    authorize(['ADMIN']),
    auditLog('REVOKE_VERIFICATION', 'KYC'),
    kycController.revokeVerification
);

export default router;
