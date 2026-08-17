import { BrowserProvider, type JsonRpcSigner } from 'ethers';

export function getBrowserProvider(): BrowserProvider {
    if (!window.ethereum) {
        throw new Error(
            'No Ethereum wallet detected. Please install MetaMask.',
        );
    }
    return new BrowserProvider(window.ethereum as ConstructorParameters<typeof BrowserProvider>[0]);
}

export async function getSigner(): Promise<JsonRpcSigner> {
    const provider = getBrowserProvider();
    await provider.send('eth_requestAccounts', []);
    return provider.getSigner();
}

export async function getConnectedAddress(): Promise<string | null> {
    try {
        const provider = getBrowserProvider();
        const accounts = await provider.send('eth_accounts', []);
        return Array.isArray(accounts) && accounts.length > 0 ? (accounts[0] as string) : null;
    } catch {
        return null;
    }
}

export async function getChainId(): Promise<number | null> {
    try {
        const provider = getBrowserProvider();
        const network = await provider.getNetwork();
        return Number(network.chainId);
    } catch {
        return null;
    }
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ethereum?: any;
    }
}
