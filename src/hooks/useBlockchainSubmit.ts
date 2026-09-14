import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { getSigner, getChainId } from '@/lib/ethers';
import config from '@/config';
import { SMART_CONTRACT_ABI } from '@/config/abi';
import { fetchWithAuth } from '@/lib/fetch';

export type BlockchainSubmitStatus =
    | 'idle'
    | 'fetching-hash'
    | 'waiting-signature'
    | 'submitting'
    | 'waiting-confirmation'
    | 'saving-tx'
    | 'success'
    | 'error';


export function useBlockchainSubmit() {
    const [status, setStatus] = useState<BlockchainSubmitStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(
        async (productEventId: string, productLotId: string) => {
            setStatus('fetching-hash');
            setError(null);

            try {
                // Validate Network
                const chainId = await getChainId();
                if (chainId !== config.chain.id) {
                    throw new Error(`Please connect your wallet to the correct network (Chain ID: ${config.chain.id}).`);
                }

                // Get Data Hash
                const hashResponse = await fetchWithAuth(
                    `${config.api.baseUrl}/api/product-events/${productEventId}/hash`,
                );

                if (!hashResponse.ok) {
                    const errorResult = await hashResponse.json();
                    throw new Error(errorResult.message ?? 'Failed to get product event hash');
                }

                const hashResult = await hashResponse.json();

                const { dataHash, messageHash } = hashResult.data;

                const signer = await getSigner();

                // Generate Message Hash & Sign
                setStatus('waiting-signature');
                
                const signature = await signer.signMessage(ethers.getBytes(messageHash));

                // Submit to Contract
                setStatus('submitting');
                const supplyChainTracker = new ethers.Contract(
                    config.contract.address,
                    SMART_CONTRACT_ABI,
                    signer
                );

                const tx = await supplyChainTracker.addProductEvent(
                    productEventId,
                    productLotId,
                    dataHash,
                    signature
                );

                setStatus('waiting-confirmation');
                const receipt = await tx.wait();
                if (receipt.status === 0) {
                    throw new Error('Transaction reverted on the blockchain.');
                }

                // Save Transaction Hash Off-Chain
                setStatus('saving-tx');
                const saveResponse = await fetchWithAuth(
                    `${config.api.baseUrl}/api/product-events/${productEventId}/save-txhash`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            txHash: tx.hash,
                        }),
                    },
                );

                if (!saveResponse.ok) {
                    const errorResult = await saveResponse.json();
                    throw new Error(errorResult.message ?? 'Failed to save transaction hash');
                }

                setStatus('success');
                return true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error(err);

                let message = 'Blockchain submission failed. Please try again.';
                
                if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
                    message = 'Transaction was rejected by the wallet.';
                } else if (err.reason && err.reason.includes('Unauthorized actor')) {
                    message = 'The connected wallet is not registered as a product-event actor.';
                } else if (err.reason && err.reason.includes('Product event already exists')) {
                    message = 'This product event has already been registered on the blockchain.';
                } else if (err.reason && err.reason.includes('Invalid signature')) {
                    message = 'Invalid signature';
                } else if (err.message) {
                    message = err.message.length < 100 ? err.message : message;
                }

                setError(message);
                setStatus('error');
                return false;
            }
        },
        [],
    );

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
    }, []);

    return {
        submit,
        reset,
        status,
        error,
        isIdle: status === 'idle',
        isFetchingHash: status === 'fetching-hash',
        isWaitingSignature: status === 'waiting-signature',
        isSubmitting: status === 'submitting',
        isWaitingConfirmation: status === 'waiting-confirmation',
        isSavingTx: status === 'saving-tx',
        isSuccess: status === 'success',
        isError: status === 'error',
        isPending: ['fetching-hash', 'waiting-signature', 'submitting', 'waiting-confirmation', 'saving-tx'].includes(status),
    };
}
