import { useEffect, useReducer, type ReactNode } from 'react';
import type { AuthActor } from '@/types/auth.types';
import { AuthContext, authReducer, initialAuthState } from './AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

const ACCESS_TOKEN_KEY = 'sct_access_token';
const REFRESH_TOKEN_KEY = 'sct_refresh_token';
const ACTOR_KEY = 'sct_actor';

let _accessToken: string | null = null;
let _refreshToken: string | null = null;

// eslint-disable-next-line
export function getStoredAccessToken(): string | null {
    return _accessToken;
}

// eslint-disable-next-line
export function getStoredRefreshToken(): string | null {
    return _refreshToken;
}

// eslint-disable-next-line
export function setModuleLevelTokens(access: string | null, refresh: string | null): void {
    _accessToken = access;
    _refreshToken = refresh;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(authReducer, initialAuthState, () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const actorRaw = localStorage.getItem(ACTOR_KEY);

        if (accessToken && refreshToken && actorRaw) {
            try {
                const actor = JSON.parse(actorRaw) as AuthActor;
                _accessToken = accessToken;
                _refreshToken = refreshToken;
                return {
                    accessToken,
                    refreshToken,
                    actor,
                    isAuthenticated: true,
                };
            } catch {
                // Corrupt storage — start fresh
            }
        }

        return initialAuthState;
    });

    useEffect(() => {
        if (state.accessToken && state.refreshToken && state.actor) {
            localStorage.setItem(ACCESS_TOKEN_KEY, state.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken);
            localStorage.setItem(ACTOR_KEY, JSON.stringify(state.actor));
            _accessToken = state.accessToken;
            _refreshToken = state.refreshToken;
        } else {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(ACTOR_KEY);
            _accessToken = null;
            _refreshToken = null;
        }
    }, [state.accessToken, state.refreshToken, state.actor]);

    return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
