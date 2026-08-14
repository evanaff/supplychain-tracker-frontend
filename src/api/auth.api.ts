import { apiClient } from './client';
import type {
    AuthResponse,
    LogoutPayload,
    MessageResponse,
    RefreshPayload,
    SiweMessagePayload,
    VerifyPayload,
} from '@/types/auth.types';

export const authApi = {
    getMessage: (payload: SiweMessagePayload) =>
        apiClient.post<MessageResponse>('/api/auth/message', payload),

    verify: (payload: VerifyPayload) =>
        apiClient.post<AuthResponse>('/api/auth/verify', payload),

    refresh: (payload: RefreshPayload) =>
        apiClient.post<AuthResponse>('/api/auth/refresh', payload),

    logout: (payload: LogoutPayload) =>
        apiClient.post('/api/auth/logout', payload),
};
