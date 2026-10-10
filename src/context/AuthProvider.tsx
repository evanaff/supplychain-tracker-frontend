import { useEffect, useReducer, type ReactNode } from 'react';
import { AuthContext, authReducer, initialAuthState } from './AuthContext';
import type { AuthActor } from '@/types';

interface AuthProviderProps {
    children: ReactNode;
}

const ACTOR_KEY = 'sct_actor';

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(
        authReducer, 
        initialAuthState,
        () => {
            try {
                const storedActor = localStorage.getItem(ACTOR_KEY);

                if (!storedActor) {
                    return initialAuthState;
                }

                const actor = JSON.parse(storedActor) as AuthActor;

                return {
                    actor,
                    isAuthenticated: true,
                };
            } catch {
                localStorage.removeItem(ACTOR_KEY);
                return initialAuthState;
            }
        },
    );

    useEffect(() => {
        if (state.actor) {
            localStorage.setItem(
                ACTOR_KEY,
                JSON.stringify(state.actor),
            );
        } else {
            localStorage.removeItem(ACTOR_KEY);
        }
    }, [state.actor]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
