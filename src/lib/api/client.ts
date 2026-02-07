import { API_BASE_URL, ApiResponse } from './contract';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private static instance: ApiClient;
    private token: string | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    public getToken(): string | null {
        return this.token;
    }

    private async request<T>(endpoint: string, method: RequestMethod, body?: any, options?: RequestOptions): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options?.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized globally (e.g., token expired)
            if (response.status === 401) {
                // Optional: Trigger global logout event or redirect
                // window.location.href = '/auth/login'; 
                // For now, let the caller handle it or throw
            }

            const data: ApiResponse<T> = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Request failed with status ${response.status}`);
            }

            return data.data as T;
        } catch (error: any) {
            console.error(`API Error [${method} ${endpoint}]:`, error);
            throw error;
        }
    }

    public get<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, 'GET', undefined, options);
    }

    public post<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, 'POST', body, options);
    }

    public put<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, 'PUT', body, options);
    }

    public delete<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, 'DELETE', undefined, options);
    }
}

export const apiClient = ApiClient.getInstance();
