import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import config from '@/config';
import { getStoredAccessToken, getStoredRefreshToken, setModuleLevelTokens } from '@/context/AuthProvider';

export const apiClient = axios.create({
    baseURL: config.api.baseUrl,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
});

// Token refresh queue

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onTokenRefreshed(newToken: string) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

function onRefreshFailed() {
    refreshSubscribers = [];
}

let _navigate: ((path: string) => void) | null = null;
let _dispatchClearAuth: (() => void) | null = null;

export function setApiClientNavigate(navigate: (path: string) => void) {
    _navigate = navigate;
}

export function setApiClientClearAuth(dispatch: () => void) {
    _dispatchClearAuth = dispatch;
}

// Request interceptor

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = error.response?.data as any;
        const backendMessage = data?.message;
        if (backendMessage) {
            error.message = backendMessage;
        } else {
            error.message = 'An unexpected error occurred. Please try again.';
        }

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = getStoredRefreshToken();

            if (!refreshToken) {
                _dispatchClearAuth?.();
                _navigate?.('/login');
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken: string) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post<{
                    data: { accessToken: string; refreshToken: string };
                }>(`${config.api.baseUrl}/api/auth/refresh`, { refreshToken });

                const { accessToken: newAccess, refreshToken: newRefresh } = data.data;

                setModuleLevelTokens(newAccess, newRefresh);

                onTokenRefreshed(newAccess);
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return apiClient(originalRequest);
            } catch {
                onRefreshFailed();
                _dispatchClearAuth?.();
                _navigate?.('/login');
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);
