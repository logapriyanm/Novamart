'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api/client';
import {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ENDPOINTS
} from '../../lib/api/contract';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    loginWithPhone: (phone: string, otp: string) => Promise<void>;
    sendOtp: (phone: string) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Hydrate session on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = apiClient.getToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const userData = await apiClient.get<User>(ENDPOINTS.AUTH.ME);
            setUser(userData);
        } catch (error) {
            console.error('Session hydration failed:', error);
            // Token might be invalid/expired
            apiClient.setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthSuccess = (response: AuthResponse) => {
        apiClient.setToken(response.token);
        setUser(response.user);

        switch (response.user.role) {
            case 'ADMIN': router.push('/admin/dashboard'); break;
            case 'MANUFACTURER': router.push('/manufacturer/dashboard'); break;
            case 'DEALER': router.push('/dealer/dashboard'); break;
            default: router.push('/');
        }
    };

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
            handleAuthSuccess(response);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (idToken: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.GOOGLE, { idToken });
            handleAuthSuccess(response);
        } catch (error) {
            console.error('Google Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithPhone = async (phone: string, otp: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN_PHONE, { phone, otp });
            handleAuthSuccess(response);
        } catch (error) {
            console.error('Phone Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const sendOtp = async (phone: string) => {
        setIsLoading(true);
        try {
            await apiClient.post(ENDPOINTS.AUTH.OTP_SEND, { phone });
        } catch (error) {
            console.error('Send OTP failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
            apiClient.setToken(response.token);
            setUser(response.user);
            router.push('/auth/login?registered=true');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        apiClient.setToken(null);
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            loginWithGoogle,
            loginWithPhone,
            sendOtp,
            register,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
