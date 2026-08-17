import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ShieldCheck, ShieldX, AlertTriangle, Loader2, AppleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EventTimeline } from '@/components/shared/EventTimeline';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { traceProductsApi } from '@/api/trace-products.api';
import config from '@/config';
import type { TraceVerificationResult } from '@/types/trace-event.types';

const ROLE_BADGE_COLORS: Record<string, string> = {
    GROWER: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-transparent',
    DISTRIBUTOR: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-transparent',
    RETAILER: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-transparent',
};

export default function TraceHistoryPage() {
    useDocumentTitle(`Trace History - ${config.app.name}`);

    const { id } = useParams<{ id: string }>();
    const [verificationResult, setVerificationResult] = useState<TraceVerificationResult | null>(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['trace-history-public', id],
        queryFn: () => traceProductsApi.getHistory(id!).then((r) => r.data.data),
        enabled: Boolean(id),
    });

    const verifyMutation = useMutation({
        mutationFn: () => traceProductsApi.verify(id!).then((r) => r.data.data),
        onSuccess: (result) => setVerificationResult(result),
    });

    const tp = data?.traceProduct;
    const events = data?.traceEvents ?? [];

    const generateReportMailto = () => {
        if (!verificationResult || !tp) return '#';

        const subject = encodeURIComponent('Blockchain Verification Issue Report');
        
        const invalidEventsStr = verificationResult.invalidEvents.length > 0 
            ? verificationResult.invalidEvents.join('\n')
            : 'None';
            
        const missingEventsStr = verificationResult.missingEvents.length > 0
            ? verificationResult.missingEvents.join('\n')
            : 'None';

        const body = encodeURIComponent(`Hello,

I found an issue while verifying a trace product.

Trace Product ID:
${tp.id}

Invalid Event IDs:
${invalidEventsStr}

Missing Event IDs:
${missingEventsStr}

Thank you.`);

        return `mailto:evan22002@mail.unpad.ac.id?subject=${subject}&body=${body}`;
    };

    return (
        <>
            
                <meta
                    name="description"
                    content={
                        tp
                            ? `Trace history for lot ${tp.lotNumber} - ${tp.product?.varietyName ?? tp.product.gtin}. View full supply chain journey and blockchain verification.`
                            : 'View supply chain trace history and blockchain verification.'
                    }
                />
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
                {/* Public header */}
                <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="container max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <AppleIcon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight">{config.app.name}</p>
                            <p className="text-xs text-muted-foreground leading-tight">Supply Chain Trace</p>
                        </div>
                    </div>
                </header>

                <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6 animate-slide-up">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Skeleton className="h-32 w-full rounded-xl" />
                                <Skeleton className="h-32 w-full rounded-xl" />
                            </div>
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                    ) : isError || !tp ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-destructive">Trace not found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {error?.message || "This trace ID does not exist or has been removed."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Product Summary */}
                            <Card className="overflow-hidden">
                                <CardContent className="p-0 sm:p-6">
                                    <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                                        {/* Image section */}
                                        {tp.product?.imageUrl && (
                                            <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-square relative bg-muted shrink-0">
                                                <img
                                                    src={tp.product.imageUrl}
                                                    alt={tp.product.varietyName}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}

                                        {/* Info section */}
                                        <div className="flex-1 space-y-4 p-6 sm:p-0">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <StatusBadge activity={tp.currentActivity} />
                                                </div>
                                                <h1 className="text-2xl font-bold tracking-tight">
                                                    {tp.product?.varietyName ?? tp.product.gtin}
                                                </h1>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                                                <div>
                                                    <p className="text-muted-foreground text-xs mb-1">GTIN</p>
                                                    <p className="font-medium">{tp.product?.gtin ?? tp.product.gtin ?? '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-xs mb-1">Lot Number</p>
                                                    <p className="font-medium font-mono text-xs">{tp.lotNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-xs mb-1">Quantity</p>
                                                    <p className="font-medium">{tp.quantity.toLocaleString()} {tp.product?.unitOfMeasure ?? 'units'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Current status */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Current Owner
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col items-start gap-1">
                                            {tp.owner?.role && (
                                                <Badge
                                                    variant="outline"
                                                    className={`uppercase px-3 py-1 text-xs font-semibold tracking-wider ${ROLE_BADGE_COLORS[tp.owner.role] ?? ''}`}
                                                >
                                                    {tp.owner.role}
                                                </Badge>
                                            )}
                                            <p className="font-semibold text-lg mt-1">{tp.owner?.name ?? '-'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                                            Current Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-semibold text-lg">{tp.owner?.location?.name ?? '-'}</p>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {tp.owner?.location?.address ? (
                                                <>{tp.owner.location.address}<br /></>
                                            ) : null}
                                            {tp.owner?.location?.city ? `${tp.owner.location.city}, ` : ''}
                                            {tp.owner?.location?.province ?? ''}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Blockchain Verification */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-base">Blockchain Verification</CardTitle>
                                    <Button
                                        id="verify-blockchain-button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => verifyMutation.mutate()}
                                        disabled={verifyMutation.isPending}
                                    >
                                        {verifyMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ShieldCheck className="h-4 w-4" />
                                        )}
                                        {verifyMutation.isPending ? 'Verifying…' : 'Verify Full History'}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">Network</p>
                                            <p className="font-medium">{config.chain.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">Status</p>
                                            {verificationResult ? (
                                                verificationResult.invalidEvents.length === 0 && verificationResult.missingEvents.length === 0 ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                                        <ShieldCheck className="h-4 w-4" />
                                                        <span className="font-medium text-xs">Verified</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-red-600">
                                                        <ShieldX className="h-4 w-4" />
                                                        <span className="font-medium text-xs">Unverified</span>
                                                    </div>
                                                )
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Pending Verification</span>
                                            )}
                                        </div>

                                    </div>

                                    {!verificationResult && !verifyMutation.isPending && (
                                        <p className="text-sm text-muted-foreground">
                                            Click "Verify Full History" to check the integrity of all events for this product lot against the blockchain.
                                        </p>
                                    )}

                                    {verificationResult && (
                                        <div className="space-y-4 pt-2 animate-slide-up">
                                            <div className="grid grid-cols-3 gap-3 text-center">
                                                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                                    <p className="text-2xl font-bold text-emerald-700">
                                                        {verificationResult.validEvents.length}
                                                    </p>
                                                    <p className="text-xs text-emerald-600 mt-1">Valid</p>
                                                </div>
                                                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                                    <p className="text-2xl font-bold text-red-700">
                                                        {verificationResult.invalidEvents.length}
                                                    </p>
                                                    <p className="text-xs text-red-600 mt-1">Invalid</p>
                                                </div>
                                                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                                                    <p className="text-2xl font-bold text-amber-700">
                                                        {verificationResult.missingEvents.length}
                                                    </p>
                                                    <p className="text-xs text-amber-600 mt-1">Missing</p>
                                                </div>
                                            </div>

                                            {verificationResult.invalidEvents.length === 0 &&
                                                verificationResult.missingEvents.length === 0 ? (
                                                <div className="flex items-center gap-2.5 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                                                    <ShieldCheck className="h-4 w-4 shrink-0" />
                                                    All {verificationResult.totalEvents} events verified on the blockchain. This product&apos;s traceability record is authentic.
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                                    <ShieldX className="h-4 w-4 shrink-0" />
                                                    Some events could not be verified. This may indicate data inconsistency or tampering.
                                                </div>
                                            )}

                                            {(verificationResult.invalidEvents.length > 0 || verificationResult.missingEvents.length > 0) && (
                                                <div className="pt-4 flex justify-end">
                                                    <Button 
                                                        className="bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-sm font-semibold gap-3 h-10 px-5 transition-colors"
                                                        onClick={() => window.location.href = generateReportMailto()}
                                                    >
                                                        <AlertTriangle className="h-5 w-5" />
                                                        Report Issue
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Event Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <EventTimeline events={events} verificationResult={verificationResult} />
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

