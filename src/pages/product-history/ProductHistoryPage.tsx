import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    ShieldCheck,
    ShieldX,
    AlertTriangle,
    Loader2,
    AppleIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductEventTimeline } from '@/components/shared/ProductEventTimeline';
import { StatusBadge } from '@/components/shared/StatusBadge';

import { productLotsApi } from '@/api/product-lots.api';
import config from '@/config';

import type { VerificationResult } from '@/types/product-event.types';

export default function ProductHistoryPage() {
    useDocumentTitle(`Product History - ${config.app.name}`);

    const { id } = useParams<{ id: string }>();

    const [verificationResult, setVerificationResult] =
        useState<VerificationResult | null>(null);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['product-history', id],
        queryFn: () =>
            productLotsApi
                .getHistory(id!)
                .then((r) => r.data.data),
        enabled: Boolean(id),
    });

    const verifyMutation = useMutation({
        mutationFn: () =>
            productLotsApi
                .verify(id!)
                .then((r) => r.data.data),

        onSuccess: (result) => {
            setVerificationResult(result);
        },
    });

    const pl = data?.productLot;
    const events = data?.productEvents ?? [];

    const referenceEvent = events[0];

    const hasVerificationIssue =
        verificationResult !== null &&
        (
            verificationResult.invalidEvents.length > 0 ||
            verificationResult.unrecordedEvents.length > 0 ||
            verificationResult.missingEvents.length > 0
        );

    const generateReportMailto = () => {
        if (!verificationResult || !pl) return '#';

        const subject = encodeURIComponent(
            'Blockchain Verification Issue Report',
        );

        const invalidEventsStr =
            verificationResult.invalidEvents.length > 0
                ? verificationResult.invalidEvents.join('\n')
                : 'None';

        const unrecordedEventsStr =
            verificationResult.unrecordedEvents.length > 0
                ? verificationResult.unrecordedEvents.join('\n')
                : 'None';

        const missingEventsStr =
            verificationResult.missingEvents.length > 0
                ? verificationResult.missingEvents.join('\n')
                : 'None';

        const body = encodeURIComponent(`Hello,

I found an issue while verifying a product lot.

Product Lot ID:
${pl.id}

Invalid Event IDs:
${invalidEventsStr}

Unrecorded Event IDs:
${unrecordedEventsStr}

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
                    pl
                        ? `Product history for lot ${pl.lotNumber} - ${
                            pl.product?.varietyName ??
                            pl.product?.gtin ??
                            '-'
                        }. View full supply chain journey and blockchain verification.`
                        : 'View supply chain product history and blockchain verification.'
                }
            />

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
                {/* Public Header */}
                <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="container max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <AppleIcon className="h-4 w-4 text-primary-foreground" />
                        </div>

                        <div>
                            <p className="text-sm font-bold leading-tight">
                                {config.app.name}
                            </p>

                            <p className="text-xs text-muted-foreground leading-tight">
                                Product History
                            </p>
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
                    ) : isError || !pl ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />

                            <div>
                                <p className="font-semibold text-destructive">
                                    Product lot not found
                                </p>

                                <p className="text-sm text-muted-foreground mt-1">
                                    {error?.message ||
                                        'This product lot ID does not exist or has been removed.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Product Summary */}
                            <Card className="overflow-hidden">
                                <CardContent className="p-0 sm:p-6">
                                    <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                                        {/* Image Section */}
                                        {pl.product?.imageUrl && (
                                            <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-square relative bg-muted shrink-0">
                                                <img
                                                    src={pl.product.imageUrl}
                                                    alt={
                                                        pl.product?.varietyName ??
                                                        'Product'
                                                    }
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}

                                        {/* Info Section */}
                                        <div className="flex-1 space-y-4 p-6 sm:p-0">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <StatusBadge
                                                        activity={
                                                            pl.currentActivity
                                                        }
                                                    />
                                                </div>

                                                <h1 className="text-2xl font-bold tracking-tight">
                                                    {referenceEvent?.productJson
                                                        ?.varietyName ??
                                                        pl.product
                                                            ?.varietyName ??
                                                        '-'}
                                                </h1>
                                            </div>

                                            <div className="flex flex-col gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                                                <div>
                                                    <p className="text-muted-foreground text-xs mb-1">
                                                        GTIN
                                                    </p>

                                                    <p className="font-medium">
                                                        {referenceEvent
                                                            ?.productJson
                                                            ?.gtin ??
                                                            pl.product
                                                                ?.gtin ??
                                                            '-'}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-muted-foreground text-xs mb-1">
                                                            Lot Number
                                                        </p>

                                                        <p className="font-medium">
                                                            {referenceEvent
                                                                ?.productLotJson
                                                                ?.lotNumber ??
                                                                pl.lotNumber}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-muted-foreground text-xs mb-1">
                                                            Quantity
                                                        </p>

                                                        <p className="font-medium">
                                                            {(
                                                                referenceEvent
                                                                    ?.productLotJson
                                                                    ?.quantity ??
                                                                pl.quantity
                                                            ).toLocaleString()}{' '}
                                                            {referenceEvent
                                                                ?.productJson
                                                                ?.unitOfMeasure ??
                                                                pl.product
                                                                    ?.unitOfMeasure ??
                                                                'units'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Blockchain Verification */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-base">
                                        Blockchain Verification
                                    </CardTitle>

                                    <Button
                                        id="verify-blockchain-button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() =>
                                            verifyMutation.mutate()
                                        }
                                        disabled={
                                            verifyMutation.isPending
                                        }
                                    >
                                        {verifyMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ShieldCheck className="h-4 w-4" />
                                        )}

                                        {verifyMutation.isPending
                                            ? 'Verifying…'
                                            : 'Verify Product History'}
                                    </Button>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">
                                                Network
                                            </p>

                                            <p className="font-medium">
                                                {config.chain.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">
                                                Status
                                            </p>

                                            {verificationResult ? (
                                                !hasVerificationIssue ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                                        <ShieldCheck className="h-4 w-4" />

                                                        <span className="font-medium text-xs">
                                                            Verified
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-red-600">
                                                        <ShieldX className="h-4 w-4" />

                                                        <span className="font-medium text-xs">
                                                            Unverified
                                                        </span>
                                                    </div>
                                                )
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">
                                                    -
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!verificationResult &&
                                        !verifyMutation.isPending && (
                                            <p className="text-sm text-muted-foreground">
                                                Click "Verify Product
                                                History" to check the
                                                integrity of all events for
                                                this product lot.
                                            </p>
                                        )}

                                    {verificationResult && (
                                        <div className="space-y-4 pt-2 animate-slide-up">
                                            {/* Verification Counts */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                                {/* Valid */}
                                                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                                                    <p className="text-2xl font-bold text-emerald-700">
                                                        {
                                                            verificationResult
                                                                .validEvents
                                                                .length
                                                        }
                                                    </p>

                                                    <p className="text-xs text-emerald-600 mt-1">
                                                        Valid
                                                    </p>
                                                </div>

                                                {/* Invalid */}
                                                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                                                    <p className="text-2xl font-bold text-red-700">
                                                        {
                                                            verificationResult
                                                                .invalidEvents
                                                                .length
                                                        }
                                                    </p>

                                                    <p className="text-xs text-red-600 mt-1">
                                                        Invalid
                                                    </p>
                                                </div>

                                                {/* Missing */}
                                                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                                                    <p className="text-2xl font-bold text-amber-700">
                                                        {
                                                            verificationResult
                                                                .missingEvents
                                                                .length
                                                        }
                                                    </p>

                                                    <p className="text-xs text-amber-600 mt-1">
                                                        Missing
                                                    </p>
                                                </div>

                                                {/* Unrecorded */}
                                                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                                                    <p className="text-2xl font-bold text-gray-700">
                                                        {
                                                            verificationResult
                                                                .unrecordedEvents
                                                                .length
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Unrecorded
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Verification Message */}
                                            {!hasVerificationIssue ? (
                                                <div className="flex items-center gap-2.5 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                                                    <ShieldCheck className="h-4 w-4 shrink-0" />

                                                    All{' '}
                                                    {
                                                        verificationResult.totalEvents
                                                    }{' '}
                                                    events verified on the
                                                    blockchain
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                                    <ShieldX className="h-4 w-4 shrink-0" />

                                                    Some events are
                                                    invalid, unrecorded, or
                                                    missing. Please report
                                                    this verification
                                                    result.
                                                </div>
                                            )}

                                            {/* Report Button */}
                                            {hasVerificationIssue && (
                                                <div className="pt-4 flex justify-end">
                                                    <Button
                                                        className="bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-sm font-semibold gap-3 h-10 px-5 transition-colors"
                                                        onClick={() => {
                                                            window.location.href =
                                                                generateReportMailto();
                                                        }}
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
                                    <CardTitle className="text-lg">
                                        Product Event Timeline
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <ProductEventTimeline
                                        events={events}
                                        verificationResult={
                                            verificationResult
                                        }
                                        hideChainStatus={true}
                                    />
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}