
import express from 'express';
import cmsController from '../../controllers/cmsController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

// Public / User Routes
router.get('/home', authenticate, cmsController.getHomeConfig); // Logged in users get role-specific content
router.get('/home/guest', cmsController.getHomeConfig); // Explicit endpoint for guests

// Admin Routes
router.get('/admin/all', authenticate, authorize(['ADMIN']), cmsController.getAllSections);
router.post('/admin', authenticate, authorize(['ADMIN']), cmsController.createSection);
router.put('/admin/:id', authenticate, authorize(['ADMIN']), cmsController.updateSection);
router.post('/admin/reorder', authenticate, authorize(['ADMIN']), cmsController.reorderSections);
router.post('/admin/seed', authenticate, authorize(['ADMIN']), cmsController.seedDefaults);

export default router;
