import { apiClient } from '../client';
import {
    ENDPOINTS,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User
} from '../contract';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
    },

    async getCurrentUser(): Promise<User> {
        return apiClient.get<User>(ENDPOINTS.AUTH.ME);
    },

    async logout(): Promise<void> {
        return apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
    },

    async loginWithGoogle(idToken: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.GOOGLE, { idToken });
    },

    async sendOtp(phone: string): Promise<void> {
        return apiClient.post(ENDPOINTS.AUTH.OTP_SEND, { phone });
    },

    async loginWithPhone(phone: string, otp: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN_PHONE, { phone, otp });
    },

    async forgotPassword(email: string): Promise<void> {
        return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    },

    async resetPassword(token: string, password: string): Promise<void> {
        return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
    }
};

export default authService;
