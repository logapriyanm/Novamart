import { API_BASE_URL, ApiResponse } from './contract';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
    token?: string;
    params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
    private static instance: ApiClient;
    private token: string | null = null;
    private refreshToken: string | null = null;
    private isRefreshing = false;
    private refreshPromise: Promise<any> | null = null;
    private onAuthError: (() => void) | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
            this.refreshToken = localStorage.getItem('refresh_token');
        }
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public setTokens(token: string | null, refreshToken: string | null) {
        this.token = token;
        this.refreshToken = refreshToken;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
                document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
            } else {
                localStorage.removeItem('auth_token');
                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            }

            if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
            } else {
                localStorage.removeItem('refresh_token');
            }
        }
    }

    // Compatibility method
    public setToken(token: string | null) {
        this.setTokens(token, this.refreshToken);
    }

    public setAuthErrorCallback(callback: () => void) {
        this.onAuthError = callback;
    }

    public getToken(): string | null {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }

    public getRefreshToken(): string | null {
        if (!this.refreshToken && typeof window !== 'undefined') {
            this.refreshToken = localStorage.getItem('refresh_token');
        }
        return this.refreshToken;
    }

    private async request<T>(endpoint: string, method: RequestMethod, body?: any, options?: RequestOptions): Promise<T> {
        let url = `${API_BASE_URL}${endpoint}`;

        if (options?.params) {
            const query = Object.entries(options.params)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
                .join('&');
            if (query) {
                url += (url.includes('?') ? '&' : '?') + query;
            }
        }

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

            // Handle 401 Unauthorized (potentially expired token)
            if (response.status === 401 && this.refreshToken && endpoint !== '/auth/refresh') {
                return await this.handleTokenRefresh<T>(endpoint, method, body, options);
            }

            const data: ApiResponse<T> = await response.json();

            if (!response.ok || data.success === false) {
                const error = new Error(data.error || `Request failed with status ${response.status}`);
                (error as any).details = data.details;
                (error as any).status = response.status;
                (error as any).code = data.error;
                throw error;
            }

            return data.data as T;
        } catch (error: any) {
            if (error.status === 401 && this.refreshToken && endpoint !== '/auth/refresh') {
                return await this.handleTokenRefresh<T>(endpoint, method, body, options);
            }
            console.error(`API Error [${method} ${endpoint}]:`, error);
            throw error;
        }
    }

    private async handleTokenRefresh<T>(endpoint: string, method: RequestMethod, body?: any, options?: RequestOptions): Promise<T> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshPromise = this.post<any>('/auth/refresh', { refreshToken: this.refreshToken })
                .then(data => {
                    this.setTokens(data.token, data.refreshToken);
                    return data;
                })
                .catch(err => {
                    this.setTokens(null, null);
                    if (this.onAuthError) {
                        this.onAuthError();
                    }
                    throw err;
                })
                .finally(() => {
                    this.isRefreshing = false;
                    this.refreshPromise = null;
                });
        }

        await this.refreshPromise;
        return this.request<T>(endpoint, method, body, options);
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

    public patch<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, 'PATCH', body, options);
    }

    public async upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
        let url = `${API_BASE_URL}${endpoint}`;

        if (options?.params) {
            const query = Object.entries(options.params)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
                .join('&');
            if (query) {
                url += (url.includes('?') ? '&' : '?') + query;
            }
        }

        const headers: HeadersInit = {
            ...options?.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config: RequestInit = {
            method: 'POST',
            headers,
            body: formData,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 401 && this.refreshToken && endpoint !== '/auth/refresh') {
                await this.handleTokenRefresh<any>(endpoint, 'POST', formData, options);
                // Note: Re-uploading after refresh is tricky with FormData. 
                // For now, we throw and let the UI retry or similar.
                // In a real prod app, you might want to clone the response or similar.
            }

            const data: ApiResponse<T> = await response.json();

            if (!response.ok || data.success === false) {
                throw new Error(data.error || `Upload failed with status ${response.status}`);
            }

            return data.data as T;
        } catch (error: any) {
            console.error(`Upload Error [POST ${endpoint}]:`, error);
            throw error;
        }
    }

    public delete<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, 'DELETE', undefined, options);
    }
}

export const apiClient = ApiClient.getInstance();
