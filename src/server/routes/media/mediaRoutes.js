import express from 'express';
import upload from '../../middleware/uploadMiddleware.js';
import cloudinary from '../../lib/cloudinary.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';
import logger from '../../lib/logger.js';

const router = express.Router();

router.post('/upload',
    authenticate,
    authorize(['MANUFACTURER', 'ADMIN', 'CUSTOMER', 'SELLER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    upload.array('images', 10),
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'novamart/products',
                            resource_type: 'auto',
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer);
                });
            });

            const urls = await Promise.all(uploadPromises);

            res.json({
                success: true,
                data: { urls }
            });
        } catch (error) {
            logger.error('Media Upload Error:', error);
            res.status(500).json({
                error: 'Failed to upload images to Cloudinary',
                details: error.message
            });
        }
    }
);

export default router;
