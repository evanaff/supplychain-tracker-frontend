import { useCallback, useEffect, useState } from 'react';
import {
    getBrowserProvider,
    getChainId,
    getConnectedAddress,
} from '@/lib/ethers';
import config from '@/config';

export interface WalletState {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
    isCorrectChain: boolean;
    isMetaMaskInstalled: boolean;
    isConnecting: boolean;
    error: string | null;
}

export function useWallet() {
    const [state, setState] = useState<WalletState>({
        address: null,
        chainId: null,
        isConnected: false,
        isCorrectChain: false,
        isMetaMaskInstalled: typeof window !== 'undefined' && Boolean(window.ethereum),
        isConnecting: false,
        error: null,
    });

    const syncState = useCallback(async () => {
        const address = await getConnectedAddress();
        const chainId = await getChainId();
        setState((prev) => ({
            ...prev,
            address,
            chainId,
            isConnected: Boolean(address),
            isCorrectChain: chainId === config.chain.id,
            isMetaMaskInstalled: Boolean(window.ethereum),
            error: null,
        }));
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => {
            void syncState();
        });

        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setState((prev) => ({
                    ...prev,
                    address: null,
                    isConnected: false,
                }));
            } else {
                setState((prev) => ({
                    ...prev,
                    address: accounts[0],
                    isConnected: true,
                }));
            }
        };

        const handleChainChanged = (chainIdHex: string) => {
            const chainId = parseInt(chainIdHex, 16);
            setState((prev) => ({
                ...prev,
                chainId,
                isCorrectChain: chainId === config.chain.id,
            }));
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [syncState]);

    const connect = useCallback(async (): Promise<string | null> => {
        if (!window.ethereum) {
            setState((prev) => ({
                ...prev,
                error: 'MetaMask is not installed. Please install it and try again.',
            }));
            return null;
        }

        setState((prev) => ({ ...prev, isConnecting: true, error: null }));

        try {
            const provider = getBrowserProvider();
            await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            const chainId = Number(network.chainId);

            setState((prev) => ({
                ...prev,
                address,
                chainId,
                isConnected: true,
                isCorrectChain: chainId === config.chain.id,
                isConnecting: false,
            }));

            return address;
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Failed to connect wallet. Please try again.';
            setState((prev) => ({ ...prev, isConnecting: false, error: message }));
            return null;
        }
    }, []);

    const disconnect = useCallback(() => {
        setState((prev) => ({
            ...prev,
            address: null,
            isConnected: false,
        }));
    }, []);

    const switchChain = useCallback(async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${config.chain.id.toString(16)}` }],
            });
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Failed to switch network.';
            setState((prev) => ({ ...prev, error: message }));
        }
    }, []);

    return {
        ...state,
        connect,
        disconnect,
        switchChain,
        syncState,
    };
}
