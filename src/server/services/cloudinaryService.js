import cloudinary from '../lib/cloudinary.js';

class CloudinaryService {
    /**
     * Upload an image/video from a buffer or file path
     */
    async upload(file, options = {}) {
        try {
            const uploadOptions = {
                folder: 'novamart',
                resource_type: 'auto',
                ...options
            };

            return await cloudinary.uploader.upload(file, uploadOptions);
        } catch (error) {
            console.error('❌ Cloudinary Upload Error:', error);
            throw error;
        }
    }

    /**
     * Delete an asset by public ID
     */
    async delete(publicId, resourceType = 'image') {
        try {
            return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        } catch (error) {
            console.error('❌ Cloudinary Delete Error:', error);
            throw error;
        }
    }

    /**
     * Generate a secure signature for client-side uploads (CldUploadWidget)
     */
    async generateSignature(paramsToSign) {
        try {
            return cloudinary.utils.api_sign_request(
                paramsToSign,
                process.env.CLOUDINARY_API_SECRET
            );
        } catch (error) {
            console.error('❌ Cloudinary Signature Error:', error);
            throw error;
        }
    }
}

export default new CloudinaryService();
