import { createContext, useContext } from 'react';
import type { AuthActor, AuthState } from '@/types/auth.types';

export type AuthAction =
    | {
        type: 'SET_AUTH';
        payload: { accessToken: string; refreshToken: string; actor: AuthActor };
      }
    | { type: 'CLEAR_AUTH' }
    | { type: 'UPDATE_TOKENS'; payload: { accessToken: string; refreshToken: string } };


export const initialAuthState: AuthState = {
    accessToken: null,
    refreshToken: null,
    actor: null,
    isAuthenticated: false,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                actor: action.payload.actor,
                isAuthenticated: true,
            };
        case 'CLEAR_AUTH':
            return { ...initialAuthState };
        case 'UPDATE_TOKENS':
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
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
