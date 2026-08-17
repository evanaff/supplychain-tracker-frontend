import { useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import type { AuthActor } from '@/types/auth.types';

export function useAuth() {
    const { state, dispatch } = useAuthContext();

    const setAuth = useCallback(
        (accessToken: string, refreshToken: string, actor: AuthActor) => {
            dispatch({ 
                type: 'SET_AUTH', 
                payload: { accessToken, refreshToken, actor } 
            });
        },
        [dispatch],
    );

    const clearAuth = useCallback(() => {
        dispatch({ 
            type: 'CLEAR_AUTH' 
        });
    }, [dispatch]);

    const updateTokens = useCallback(
        (accessToken: string, refreshToken: string) => {
            dispatch({ 
                type: 'UPDATE_TOKENS',
                payload: { accessToken, refreshToken } 
            });
        },
        [dispatch],
    );

    return {
        actor: state.actor,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        role: state.actor?.role ?? null,
        isAdmin: state.actor?.role === 'ADMIN',
        isGrower: state.actor?.role === 'GROWER',
        isDistributor: state.actor?.role === 'DISTRIBUTOR',
        isRetailer: state.actor?.role === 'RETAILER',
        setAuth,
        clearAuth,
        updateTokens,
    };
}
