import config from '@/config';

import {
    getStoredAccessToken,
    getStoredRefreshToken,
    setModuleLevelTokens,
} from '@/context/AuthProvider';

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface AuthHandlers {
    updateTokens: (
        accessToken: string,
        refreshToken: string,
    ) => void;
    clearAuth: () => void;
    navigate: (path: string) => void;
}

let authHandlers: AuthHandlers | null = null;

export function setFetchAuthHandlers(handlers: AuthHandlers | null) {
    authHandlers = handlers;
}

let refreshPromise: Promise<Tokens> | null = null;

async function refreshTokens(): Promise<Tokens> {
    if (refreshPromise) {
        return refreshPromise;
    }

    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
        throw new Error('Refresh token not found');
    }

    refreshPromise = (async () => {
        const response = await fetch(
            `${config.api.baseUrl}/api/auth/refresh`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    refreshToken,
                }),
            },
        );

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const result = (await response.json()) as {
            data: {
                accessToken: string;
                refreshToken: string;
            };
        };

        const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        } = result.data;

        if (!newAccessToken || !newRefreshToken) {
            throw new Error('Invalid token refresh response');
        }

        setModuleLevelTokens(
            newAccessToken,
            newRefreshToken,
        );

        authHandlers?.updateTokens(
            newAccessToken,
            newRefreshToken,
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

function handleSessionExpired() {
    setModuleLevelTokens(null, null);

    authHandlers?.clearAuth();
    authHandlers?.navigate('/login');
}

export async function fetchWithAuth(
    input: RequestInfo | URL,
    init: RequestInit = {},
): Promise<Response> {
    const accessToken = getStoredAccessToken();
    const headers = new Headers(init.headers);

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response = await fetch(input, {
        ...init,
        headers,
    });

    if (response.status !== 401) {
        return response;
    }

    try {
        const { accessToken: newAccessToken } = await refreshTokens();

        const retryHeaders = new Headers(init.headers);

        retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);

        response = await fetch(input, {
            ...init,
            headers: retryHeaders,
        });

        return response;
    } catch (error) {
        handleSessionExpired();
        throw error;
    }
}