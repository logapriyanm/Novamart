/**
 * Standard API Client for Novamart
 * Handles base URL, auth headers, and response parsing.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
    async request(endpoint: string, options: RequestInit = {}) {
        const url = `${BASE_URL}${endpoint}`;

        // Get token from localStorage (safe for client-side)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });
            const result = await response.json();

            if (!response.ok) {
                // Return a structured error object that the component can parse
                const errorObj: any = new Error(result.error || 'API_REQUEST_FAILED');
                errorObj.details = result.details;
                errorObj.code = result.error;
                throw errorObj;
            }

            return result;
        } catch (error: any) {
            console.error(`❌ API Error [${endpoint}]:`, error.code || error.message);
            throw error;
        }
    },

    get(endpoint: string, options?: RequestInit) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint: string, body: any, options?: RequestInit) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(endpoint: string, body: any, options?: RequestInit) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(endpoint: string, options?: RequestInit) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },
};
