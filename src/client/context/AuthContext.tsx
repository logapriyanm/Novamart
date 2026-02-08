'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/api/services/auth.service';
import { apiClient } from '../../lib/api/client';
import { useSnackbar } from './SnackbarContext';
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
    const { showSnackbar } = useSnackbar();

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
            apiClient.setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthSuccess = (response: any) => {
        // response is the 'data' property from the standardized API response
        // which contains { token, user } or just user depending on the endpoint
        const token = response.token;
        const user = response.user;

        if (token) apiClient.setToken(token);
        if (user) setUser(user);

        const role = user?.role || response.role;
        switch (role) {
            case 'ADMIN': router.push('/admin/dashboard'); break;
            case 'MANUFACTURER': router.push('/manufacturer/dashboard'); break;
            case 'DEALER': router.push('/dealer/dashboard'); break;
            default: router.push('/');
        }
    };

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            handleAuthSuccess(response);
            showSnackbar('Login successful', 'success');
        } catch (error) {
            console.error('Login failed:', error);
            showSnackbar('Invalid email or password', 'error');
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
            const response = await authService.loginWithPhone(phone, otp);
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
            await authService.sendOtp(phone);
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
            const response = await authService.register(data);
            apiClient.setToken(response.token);
            setUser(response.user);
            showSnackbar('Registration successful. Await verification.', 'success');
            router.push('/auth/login?registered=true');
        } catch (error) {
            console.error('Registration failed:', error);
            showSnackbar('Something went wrong. Please try again.', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            showSnackbar('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout API failed:', error);
        } finally {
            apiClient.setToken(null);
            setUser(null);
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
