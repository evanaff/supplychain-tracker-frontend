import type { ReactNode } from 'react';
import { AlertTriangle, PackageSearch, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorStateVariant = 'empty' | 'error' | 'forbidden' | 'not-found';

interface ErrorStateProps {
    variant?: ErrorStateVariant;
    title?: string;
    description?: string;
    action?: ReactNode;
}

const defaults: Record<ErrorStateVariant, { icon: ReactNode; title: string; description: string }> = {
    empty: {
        icon: <PackageSearch className="h-12 w-12 text-muted-foreground/40" />,
        title: 'Nothing here yet',
        description: 'No results found. Try adjusting your search or filters.',
    },
    error: {
        icon: <AlertTriangle className="h-12 w-12 text-destructive/50" />,
        title: 'Something went wrong',
        description: 'Failed to load data. Please try again.',
    },
    forbidden: {
        icon: <ShieldOff className="h-12 w-12 text-muted-foreground/40" />,
        title: 'Access denied',
        description: "You don't have permission to view this content.",
    },
    'not-found': {
        icon: <PackageSearch className="h-12 w-12 text-muted-foreground/40" />,
        title: 'Not found',
        description: "The item you're looking for doesn't exist or has been removed.",
    },
};

export function ErrorState({
    variant = 'empty',
    title,
    description,
    action,
}: ErrorStateProps) {
    const d = defaults[variant];

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-fade-in">
            {d.icon}
            <div className="space-y-1">
                <p className="font-semibold text-foreground">{title ?? d.title}</p>
                <p className="text-sm text-muted-foreground max-w-sm">{description ?? d.description}</p>
            </div>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

interface ErrorStateWithRetryProps extends ErrorStateProps {
    onRetry: () => void;
}

export function ErrorStateWithRetry({ onRetry, ...props }: ErrorStateWithRetryProps) {
    return (
        <ErrorState
            variant="error"
            {...props}
            action={
                <Button variant="outline" size="sm" onClick={onRetry}>
                    Try again
                </Button>
            }
        />
    );
}
