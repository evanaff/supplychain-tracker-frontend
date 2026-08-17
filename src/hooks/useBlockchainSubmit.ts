import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { getSigner, getChainId } from '@/lib/ethers';
import { traceEventsApi } from '@/api/trace-events.api';
import config from '@/config';
import { SMART_CONTRACT_ABI } from '@/config/abi';

export type BlockchainSubmitStatus =
    | 'idle'
    | 'fetching-hash'
    | 'waiting-signature'
    | 'submitting'
    | 'waiting-confirmation'
    | 'saving-tx'
    | 'success'
    | 'error';

interface UseBlockchainSubmitOptions {
    invalidateKeys?: string[][];
}

export function useBlockchainSubmit(options: UseBlockchainSubmitOptions = {}) {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<BlockchainSubmitStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(
        async (eventId: string) => {
            setStatus('fetching-hash');
            setError(null);

            try {
                // Validate Network
                const chainId = await getChainId();
                if (chainId !== config.chain.id) {
                    throw new Error(`Please connect your wallet to the correct network (Chain ID: ${config.chain.id}).`);
                }

                // Get Data Hash
                const hashRes = await traceEventsApi.getDataHash(eventId);
                const { dataHash } = hashRes.data.data;

                const signer = await getSigner();
                const actor = await signer.getAddress();

                // Generate Message Hash & Sign
                setStatus('waiting-signature');
                
                const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
                    ['string', 'address', 'bytes32'],
                    [eventId, actor, dataHash]
                );
                const messageHash = ethers.keccak256(encoded);
                const signature = await signer.signMessage(ethers.getBytes(messageHash));

                // Submit to Contract
                setStatus('submitting');
                const supplyChainTracker = new ethers.Contract(
                    config.contract.address,
                    SMART_CONTRACT_ABI,
                    signer
                );

                const tx = await supplyChainTracker.addTraceEvent(
                    eventId,
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
                await traceEventsApi.saveTxHash(eventId, tx.hash);

                // Invalidate Relevant Caches
                if (options.invalidateKeys) {
                    await Promise.all(
                        options.invalidateKeys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
                    );
                }

                setStatus('success');
                return true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                let message = 'Blockchain submission failed. Please try again.';
                
                if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
                    message = 'Transaction was rejected by the wallet.';
                } else if (err.reason && err.reason.includes('Unauthorized executor')) {
                    message = 'The connected wallet is not registered as a trace-event executor.';
                } else if (err.reason && err.reason.includes('Trace event already exists')) {
                    message = 'This trace event has already been registered on the blockchain.';
                } else if (err.message) {
                    message = err.message.length < 100 ? err.message : message;
                }

                setError(message);
                setStatus('error');
                return false;
            }
        },
        [queryClient, options.invalidateKeys],
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
