'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/api/services/auth.service';
import { apiClient } from '../../lib/api/client';
// import { useSnackbar } from './SnackbarContext';
import { toast } from 'sonner';
import {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse
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
    // const { showSnackbar } = useSnackbar();

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
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Session hydration failed:', error);
            // If checking user fails (e.g. token expired), token refresh happens in apiClient.ts
            // But if it still fails, clear tokens.
            if (apiClient.getToken() === null) {
                setUser(null);
            } else {
                // Retry once if tokens were refreshed during the failure
                try {
                    const retryUserData = await authService.getCurrentUser();
                    setUser(retryUserData);
                } catch (retryError) {
                    apiClient.setTokens(null, null);
                    setUser(null);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthSuccess = (response: AuthResponse) => {
        const token = response.token;
        const refreshToken = (response as any).refreshToken;
        const userData = response.user;

        if (token) {
            apiClient.setTokens(token, refreshToken || apiClient.getRefreshToken());
        }

        if (userData) setUser(userData);

        const role = userData?.role;
        const status = userData?.status;

        // Redirect based on role and status
        if (role === 'ADMIN') {
            router.push('/admin/dashboard');
        } else if (status === 'PENDING') {
            router.push('/auth/pending-verification');
        } else {
            switch (role) {
                case 'MANUFACTURER': router.push('/manufacturer/dashboard'); break;
                case 'DEALER': router.push('/dealer/dashboard'); break;
                case 'CUSTOMER': router.push('/'); break;
                default: router.push('/');
            }
        }
    };

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            handleAuthSuccess(response);
            toast.success('Login successful');
        } catch (error: any) {
            console.error('Login failed:', error);
            toast.error(error.message || 'Invalid email or password');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (idToken: string) => {
        setIsLoading(true);
        try {
            const response = await authService.loginWithGoogle(idToken);
            handleAuthSuccess(response);
            toast.success('Login successful via Google');
        } catch (error: any) {
            console.error('Google Login failed:', error);
            toast.error(error.message || 'Google Login Failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithPhone = async (phone: string, otp: string) => {
        setIsLoading(true);
        try {
            const response = await authService.loginWithPhone(phone, otp);
            handleAuthSuccess(response);
        } catch (error: any) {
            console.error('Phone Login failed:', error);
            toast.error(error.message || 'Phone login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const sendOtp = async (phone: string) => {
        setIsLoading(true);
        try {
            await authService.sendOtp(phone);
            toast.success('OTP sent successfully');
        } catch (error: any) {
            console.error('Send OTP failed:', error);
            toast.error(error.message || 'Failed to send OTP');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);
            // Handle success based on role
            if (data.role === 'CUSTOMER') {
                handleAuthSuccess(response);
                toast.success('Registration successful');
            } else {
                toast.success('Registration successful. Your account is pending verification.');
                router.push('/auth/login?registered=pending');
            }
        } catch (error: any) {
            console.error('Registration failed:', error);
            toast.error(error.message || 'Something went wrong. Please try again.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout API failed:', error);
        } finally {
            apiClient.setTokens(null, null);
            setUser(null);
            toast.success('Logged out successfully');
            router.push('/auth/login');
        }
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
