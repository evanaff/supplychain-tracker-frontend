import config from '@/config';
import type { AuthActor } from '@/types';

interface AuthHandlers {
    clearAuth: () => void;
    setAuth: (actor: AuthActor) => void;
    navigate: (path: string) => void;
}

let authHandlers: AuthHandlers | null = null;

export function setFetchAuthHandlers(handlers: AuthHandlers | null) {
    authHandlers = handlers;
}

interface RefreshResponse {
    data?: {
        actor?: AuthActor;
    };
}

let refreshPromise: Promise<AuthActor> | null = null;

function refreshSession(): Promise<AuthActor> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const response = await fetch(
                `${config.api.baseUrl}/api/auth/refresh`,
                {
                    method: 'POST',
                    credentials: 'include',
                },
            );

            if (!response.ok) {
                throw new Error(
                    `Refresh failed: ${response.status}`,
                );
            }

            const result =  (await response.json()) as RefreshResponse;

            if (!result.data?.actor) {
                throw new Error('Actor missing from refresh response');
            }

            return result.data.actor;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

let redirectingToLogin = false;

function handleSessionExpired() {
    if (redirectingToLogin) return;

    redirectingToLogin = true;
    authHandlers?.clearAuth();
    authHandlers?.navigate('/login');
}

export async function fetchWithAuth(
    input: RequestInfo | URL,
    init: RequestInit = {},
): Promise<Response> {
    const request = () => 
        fetch(input, {
            ...init,
            credentials: 'include'
        });
    let response = await request();

    if (response.status !== 401) {
        return response;
    }

    try {
        const actor = await refreshSession();
        authHandlers?.setAuth(actor);

        response = await request();
        if (response.status === 401) {
            throw new Error("Session expired");
        }

        return response;
    } catch (error) {
        handleSessionExpired();
        throw error;
    }
}