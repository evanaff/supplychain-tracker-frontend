import { useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import type { AuthActor } from '@/types';

export function useAuth() {
    const { state, dispatch } = useAuthContext();

    const setAuth = useCallback(
        (actor: AuthActor) => {
            dispatch({ 
                type: 'SET_AUTH', 
                payload: { actor } 
            });
        },
        [dispatch],
    );

    const clearAuth = useCallback(() => {
        dispatch({ 
            type: 'CLEAR_AUTH' 
        });
    }, [dispatch]);

    return {
        actor: state.actor,
        isAuthenticated: state.isAuthenticated,
        isInitializing: state.isInitializing,
        role: state.actor?.role ?? null,
        isAdmin: state.actor?.role === 'ADMIN',
        isGrower: state.actor?.role === 'GROWER',
        isDistributor: state.actor?.role === 'DISTRIBUTOR',
        isRetailer: state.actor?.role === 'RETAILER',
        setAuth,
        clearAuth,
    };
}
