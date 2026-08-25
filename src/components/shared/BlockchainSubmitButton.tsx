import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBlockchainSubmit } from '@/hooks/useBlockchainSubmit';
import { Loader2, AlertTriangle, Link } from 'lucide-react';

interface BlockchainSubmitButtonProps {
    eventId: string;
    invalidateKeys?: string[][];
    onSuccess?: () => void;
    className?: string;
    disabled?: boolean;
}

const statusLabel: Record<string, string> = {
    idle: 'Submit to Blockchain',
    'fetching-hash': 'Fetching hash…',
    'waiting-signature': 'Waiting for signature…',
    submitting: 'Submitting transaction…',
    'waiting-confirmation': 'Waiting for confirmation…',
    'saving-tx': 'Saving record…',
    success: 'Submitted',
    error: 'Retry Submission',
};

export function BlockchainSubmitButton({
    eventId,
    invalidateKeys,
    onSuccess,
    className,
    disabled,
}: BlockchainSubmitButtonProps) {
    const { submit, reset, status, error, isPending } = useBlockchainSubmit({
        invalidateKeys,
    });

    const handleClick = async () => {
        const ok = await submit(eventId);
        if (ok) {
        onSuccess?.();
        reset();
        }
    };

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <Button
                id={`blockchain-submit-${eventId}`}
                onClick={() => void handleClick()}
                disabled={disabled || isPending}
                className="gap-2 transition-all"
            >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === 'error' && <AlertTriangle className="h-4 w-4" />}
                {!isPending && status !== 'error' && (
                    <Link className="h-4 w-4" />
                )}
                {statusLabel[status] ?? 'Submit to Blockchain'}
            </Button>

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}

            {status === 'waiting-signature' && (
                <p className="text-xs text-muted-foreground">
                    Check your wallet - a signature request is pending.
                </p>
            )}

            {status === 'waiting-confirmation' && (
                <p className="text-xs text-muted-foreground">
                    Transaction submitted. Waiting for blockchain confirmation...
                </p>
            )}
        </div>
    );
}
