import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { TraceEvent, TraceVerificationResult } from '@/types/trace-event.types';
import {
    CheckCircle2,
    Circle,
    Clock,
    MapPin,
    User,
    ExternalLink,
} from 'lucide-react';
import config from '@/config';

interface EventTimelineProps {
    events: TraceEvent[];
    verificationResult?: TraceVerificationResult | null;
    className?: string;
}

export function EventTimeline({ events, verificationResult, className }: EventTimelineProps) {
    if (events.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-6">
                No events recorded yet.
            </p>
        );
    }

    const sortedEvents = [...events].sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : Infinity;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : Infinity;
        return timeA - timeB;
    });

    return (
        <div className={cn('relative', className)}>
            {sortedEvents.map((event, index) => {
                const isLast = index === sortedEvents.length - 1;

                return (
                    <div key={event.id} className="flex gap-6 sm:gap-8 md:gap-10 animate-slide-up">
                        {/* Timeline Spine */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background shrink-0',
                                    event.isRecorded
                                        ? 'border-emerald-500 text-emerald-500'
                                        : 'border-muted-foreground/40 text-muted-foreground/40',
                                )}
                            >
                                {event.isRecorded ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <Circle className="h-4 w-4" />
                                )}
                            </div>
                            {!isLast && (
                                <div className="mt-1 w-px flex-1 bg-border min-h-[2rem]" />
                            )}
                        </div>

                        {/* Event Content */}
                        <div className={cn('pb-10 flex-1', isLast && 'pb-0')}>
                            <div
                                className={cn(
                                    'rounded-lg border-2 p-3 -m-3 transition-colors',
                                    verificationResult?.validEvents.includes(event.id)
                                        ? 'border-emerald-300 dark:border-emerald-800'
                                        : verificationResult?.invalidEvents.includes(event.id)
                                            ? 'border-red-300 dark:border-red-800'
                                            : verificationResult?.missingEvents.includes(event.id)
                                                ? 'border-amber-300 dark:border-amber-800'
                                                : 'border-transparent'
                                )}
                            >
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <StatusBadge activity={event.supplyChainActivity} />
                                    <Badge
                                        variant="outline"
                                        className={cn('text-xs', event.isRecorded ? 'on-chain' : 'off-chain')}
                                    >
                                        {event.isRecorded ? 'On-chain ✓' : 'Pending blockchain'}
                                    </Badge>
                                </div>

                                <div className="space-y-1.5 text-sm text-muted-foreground">
                                    {event.actorJson && (
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 shrink-0" />
                                            <span>
                                                {event.actorJson.name}{' '}
                                                <span className="text-xs opacity-70">({event.actorJson.role})</span>
                                            </span>
                                        </div>
                                    )}
                                    {event.sourceLocationJson && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                                            <span>
                                                {event.sourceLocationJson.name}, {event.sourceLocationJson.city}
                                            </span>
                                        </div>
                                    )}
                                    {event.destinationLocationJson && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                                            <span>
                                                → {event.destinationLocationJson.name}, {event.destinationLocationJson.city}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 shrink-0" />
                                        <span>{formatDateTime(event.timestamp)}</span>
                                    </div>

                                    {/* Transaction Hash */}
                                    {event.txHash && (
                                        <div className="flex items-center gap-1.5 pt-1">
                                            <span className="text-xs font-semibold">Tx Hash:</span>
                                            {config.chain.blockchainExplorerUrl ? (
                                                <a
                                                    href={`${config.chain.blockchainExplorerUrl}/tx/${event.txHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                                                    title="View on Block Explorer"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    {event.txHash.slice(0, 8)}...{event.txHash.slice(-6)}
                                                </a>
                                            ) : (
                                                <span className="text-xs font-mono font-medium text-muted-foreground">
                                                    {event.txHash.slice(0, 8)}...{event.txHash.slice(-6)}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
