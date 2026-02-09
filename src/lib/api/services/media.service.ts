import { apiClient } from '../client';
import { ENDPOINTS, ApiResponse } from '../contract';

export const mediaService = {
    async uploadImages(files: File[]): Promise<string[]> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        const response = await apiClient.upload<{ urls: string[] }>(ENDPOINTS.MEDIA.UPLOAD, formData);
        return response.urls;
    }
};

export default mediaService;
