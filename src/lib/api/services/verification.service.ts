import { apiClient } from '../client';
import { ENDPOINTS, ApiResponse } from '../contract';

export interface VerificationDocument {
    id: string;
    type: string;
    url: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    uploadedAt: string;
}

export const verificationService = {
    async uploadDocument(file: File, type: string): Promise<VerificationDocument> {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('type', type);

        return apiClient.upload<VerificationDocument>(ENDPOINTS.VERIFICATION.UPLOAD, formData);
    },

    async getMyDocuments(): Promise<VerificationDocument[]> {
        return apiClient.get<VerificationDocument[]>(ENDPOINTS.VERIFICATION.MY_DOCUMENTS);
    }
};

export default verificationService;
