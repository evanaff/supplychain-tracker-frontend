import { createContext, useContext } from 'react';
import type { AuthActor, AuthState } from '@/types';

export type AuthAction =
    | {
        type: 'SET_AUTH';
        payload: { actor: AuthActor };
      }
    | { type: 'CLEAR_AUTH' }
    | { type: "FINISH_INITIALIZATION" };

export const initialAuthState: AuthState = {
    actor: null,
    isAuthenticated: false,
    isInitializing: true,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                actor: action.payload.actor,
                isAuthenticated: true,
                isInitializing: false,
            };
        case 'CLEAR_AUTH':
            return {
                actor: null,
                isAuthenticated: false,
                isInitializing: false,
            };
        case "FINISH_INITIALIZATION":
            return {
                ...state,
                isInitializing: false,
            };
        default:
            return state;
    }
}

export interface AuthContextValue {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuthContext(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return ctx;
}
