import express from 'express';
import mongoService from '../services/mongoService.js';

const router = express.Router();

/**
 * @api {post} /api/mongodb/:collection Create a new document
 */
router.post('/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const data = req.body;
        const actorId = req.headers['x-actor-id'] || 'ANONYMOUS';

        const doc = await mongoService.create(collection, data, actorId);
        res.status(201).json({ success: true, data: doc });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @api {get} /api/mongodb/:collection Fetch documents
 */
router.get('/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const query = req.query.query ? JSON.parse(req.query.query) : {};
        const options = req.query.options ? JSON.parse(req.query.options) : {};

        const docs = await mongoService.find(collection, query, options);
        res.json({ success: true, data: docs });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @api {patch} /api/mongodb/:collection/:id/status Update document status
 */
router.patch('/:collection/:id/status', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const { status } = req.body;
        const actorId = req.headers['x-actor-id'] || 'ADMIN';

        const doc = await mongoService.updateStatus(collection, id, status, actorId);
        res.json({ success: true, data: doc });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @api {delete} /api/mongodb/:collection/:id Soft delete document
 */
router.delete('/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const actorId = req.headers['x-actor-id'] || 'ADMIN';

        const doc = await mongoService.softDelete(collection, id, actorId);
        res.json({ success: true, message: 'Document marked as DELETED', data: doc });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
