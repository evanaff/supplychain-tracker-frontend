import { useEffect, useReducer, type ReactNode } from 'react';
import { AuthContext, authReducer, initialAuthState } from './AuthContext';
import type { AuthActor } from '@/types';
import config from '@/config';

interface AuthProviderProps {
    children: ReactNode;
}

interface CurrentActorResponse {
    status: string;
    data?: {
        actor?: AuthActor;
    };
}

async function fetchCurrentActor(): Promise<AuthActor> {
    const response = await fetch(
        `${config.api.baseUrl}/api/auth/me`,
        {
            method: "GET",
            credentials: "include",
        },
    );

    if (response.status === 401) {
        throw new Error("UNAUTHENTICATED");
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch current actor: ${response.status}`);
    }

    const result = (await response.json()) as CurrentActorResponse;

    if (!result.data?.actor) {
        throw new Error("Actor missing from /api/auth/me response");
    }

    return result.data.actor;
}

async function refreshSession(): Promise<void> {
    const response = await fetch(
        `${config.api.baseUrl}/api/auth/refresh`,
        {
            method: "POST",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(`Session refresh failed: ${response.status}`);
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(
        authReducer, 
        initialAuthState,
    );

    useEffect(() => {
        let cancelled = false;

        async function initializeAuth() {
            let actor: AuthActor;

            try {
                try {
                    actor = await fetchCurrentActor();
                
                } catch (error) {
                    const isUnathenticated = error instanceof Error && error.message.includes("UNAUTHENTICATED");
                    if (!isUnathenticated) {
                        throw error;
                    }

                    await refreshSession();
                    actor = await fetchCurrentActor();
                }

                if (!cancelled) {
                    dispatch({
                        type: "SET_AUTH",
                        payload: { actor }
                    });
                }
            } catch {
                if (!cancelled) {
                    dispatch({
                        type: "CLEAR_AUTH",
                    })
                }
            }
        }

        void initializeAuth();

        return () => {
            cancelled = true;
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
