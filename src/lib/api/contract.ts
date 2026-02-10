export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- Enums (Must Match Prisma) ---
export enum Role {
    ADMIN = 'ADMIN',
    MANUFACTURER = 'MANUFACTURER',
    DEALER = 'DEALER',
    CUSTOMER = 'CUSTOMER',
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    UNDER_VERIFICATION = 'UNDER_VERIFICATION',
    SUSPENDED = 'SUSPENDED',
}

// --- Domain Models ---
export interface User {
    id: string;
    email: string;
    name?: string;
    role: Role;
    status: AccountStatus;
    avatar?: string;
    createdAt: string;
    phone?: string;
    address?: string;
    companyName?: string;
    businessName?: string;
    gstNumber?: string;
}

// --- Auth Payloads ---
export interface LoginRequest {
    email: string;
    password?: string; // Optional if using OTP logic later
    otp?: string;
}

export interface RegisterRequest {
    email: string;
    password?: string;
    name: string;
    role: Role; // Initial role selection
    phone?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

// --- Standard API Response ---
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: any;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

// --- Endpoints ---
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        GOOGLE: '/auth/google',
        OTP_SEND: '/auth/otp/send',
        LOGIN_PHONE: '/auth/login/phone',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    MANUFACTURER: {
        DASHBOARD: '/manufacturer/dashboard',
        PRODUCTS: '/manufacturer/products',
        ORDERS: '/manufacturer/orders',
    },
    DEALER: {
        DASHBOARD: '/dealer/dashboard',
        INVENTORY: '/dealer/inventory',
        ORDERS: '/dealer/orders',
    },
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
    },
    CUSTOMER: {
        ORDERS: '/customer/orders',
        STATS: '/customer/stats',
        PRODUCTS: '/customer/products',
    },
    PUBLIC: {
        PRODUCTS: '/products',
        CATEGORIES: '/products/categories',
    },
    ESCROW: {
        GET: (orderId: string) => `/escrow/${orderId}`,
        CONFIRM_DELIVERY: '/escrow/confirm-delivery',
        REQUEST_REFUND: '/escrow/request-refund',
    },
    NEGOTIATION: {
        CREATE: '/negotiation/create',
        LIST: '/negotiation',
        UPDATE: (id: string) => `/negotiation/${id}`,
    },
    MEDIA: {
        UPLOAD: '/media/upload',
    },
    VERIFICATION: {
        UPLOAD: '/verification/upload',
        MY_DOCUMENTS: '/verification/my-documents',
    },
    CHAT: {
        CREATE: '/chat/create',
        LIST: '/chat/list',
        MESSAGES: (chatId: string) => `/chat/${chatId}/messages`,
        CLOSE: (chatId: string) => `/chat/${chatId}/close`,
    }
} as const;
