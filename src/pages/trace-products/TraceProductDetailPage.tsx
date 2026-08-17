import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EventTimeline } from '@/components/shared/EventTimeline';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BlockchainSubmitButton } from '@/components/shared/BlockchainSubmitButton';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { ErrorState } from '@/components/shared/ErrorState';
import { traceProductsApi } from '@/api/trace-products.api';
import { traceEventsApi } from '@/api/trace-events.api';
import { AsyncLocationCombobox } from '@/components/shared/AsyncLocationCombobox';
import { formatDateTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import config from '@/config';
import type { SupplyChainActivity } from '@/types';
import { QRCodeCanvas } from 'qrcode.react';

export default function TraceProductDetailPage() {
    useDocumentTitle(`Trace Product Detail - ${config.app.name}`);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isGrower, isDistributor, isRetailer } = useAuth();

    const [destinationGln, setDestinationGln] = useState('');
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: tp, isLoading, isError, error } = useQuery({
        queryKey: ['trace-product', id],
        queryFn: () => traceProductsApi.getById(id!).then((r) => r.data.data.traceProduct),
        enabled: Boolean(id),
    });

    const { data: history } = useQuery({
        queryKey: ['trace-history', id],
        queryFn: () => traceProductsApi.getHistory(id!).then((r) => r.data.data),
        enabled: Boolean(id),
    });

    const createEventMutation = useMutation({
        mutationFn: async (eventType: SupplyChainActivity) => {
            switch (eventType) {
                case 'HARVESTING':
                    return traceEventsApi.createHarvesting({ traceProductId: id! });
                case 'SHIPPING':
                    return traceEventsApi.createShipping({ traceProductId: id!, destinationLocationGln: destinationGln });
                case 'RECEIVING':
                    return traceEventsApi.createReceiving({ traceProductId: id! });
                case 'SELLING':
                    return traceEventsApi.createSelling({ traceProductId: id! });
            }
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['trace-product', id] });
            void queryClient.invalidateQueries({ queryKey: ['trace-history', id] });
            setActionError(null);
        },
        onError: (err: Error) => {
            setActionError(err.message ?? 'Failed to create event.');
        },
    });

    const currentActivity = tp?.currentActivity;
    const publicTraceUrl = `${window.location.origin}/trace-history/${id}`;

    if (isError) {
        return (
            <ErrorState
                variant="not-found"
                title="Trace product not found"
                description={error?.message}
                action={<Button variant="outline" onClick={() => navigate('/trace-products')}>Back</Button>}
            />
        );
    }

    const canHarvest = isGrower && currentActivity === 'CREATED';
    const canShipAsGrower = isGrower && currentActivity === 'HARVESTING';
    const canReceiveAsDistributor = isDistributor && currentActivity === 'SHIPPING';
    const canShipAsDistributor = isDistributor && currentActivity === 'RECEIVING';
    const canReceiveAsRetailer = isRetailer && currentActivity === 'SHIPPING';
    const canSell = isRetailer && currentActivity === 'RECEIVING';

    const canShip = canShipAsGrower || canShipAsDistributor;

    const pendingEvent = history?.traceEvents.find((e) => !e.isRecorded);

    const handleDownloadQR = () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        if (canvas) {
            const padding = 24; // 24px white padding
            const newCanvas = document.createElement('canvas');
            newCanvas.width = canvas.width + padding * 2;
            newCanvas.height = canvas.height + padding * 2;

            const ctx = newCanvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
                ctx.drawImage(canvas, padding, padding);
            }

            const pngUrl = newCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `trace-product-${tp?.lotNumber ?? id}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <>
            
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/trace-products')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        {isLoading ? (
                            <Skeleton className="h-7 w-48" />
                        ) : (
                            <h1 className="text-2xl font-bold tracking-tight font-mono">{tp?.lotNumber ?? 'Trace Detail'}</h1>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-start">
                        <div className="space-y-6 md:col-span-1 lg:col-span-3">
                            {/* Section 1: QR Code */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Public Trace QR Code</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border inline-block">
                                        <QRCodeCanvas
                                            id="qr-canvas"
                                            value={publicTraceUrl}
                                            size={200}
                                            level="H"
                                            className="mx-auto rounded-md"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md mx-auto">
                                        <code className="text-xs w-full sm:flex-1 truncate p-2.5 bg-muted rounded-md border text-center sm:text-left">{publicTraceUrl}</code>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 sm:flex-none gap-1"
                                                onClick={() => void navigator.clipboard.writeText(publicTraceUrl)}
                                            >
                                                <Copy className="h-3 w-3" />
                                                Copy Link
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="flex-1 sm:flex-none gap-1"
                                                onClick={handleDownloadQR}
                                            >
                                                <Download className="h-3 w-3" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 2: Product Information */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Product Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {tp?.product?.imageUrl && (
                                            <div className="shrink-0">
                                                <img
                                                    src={tp.product.imageUrl}
                                                    alt={tp.product.varietyName}
                                                    className="h-24 w-24 object-cover rounded-md border"
                                                />
                                            </div>
                                        )}
                                        <div className="grid gap-4 sm:grid-cols-2 text-sm flex-1">
                                            <div>
                                                <p className="text-muted-foreground mb-1">Name / Variety</p>
                                                <p className="font-semibold">{tp?.product?.varietyName ?? '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">GTIN</p>
                                                <p className="font-semibold font-mono">{tp?.product?.gtin ?? '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">Unit of Measure</p>
                                                <p className="font-semibold">{tp?.product?.unitOfMeasure ?? '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 3: Trace Product Information */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Trace Product Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-1">Lot Number</p>
                                            <p className="font-semibold font-mono">{tp?.lotNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Status</p>
                                            {tp && <StatusBadge activity={tp.currentActivity} />}
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Creation Date</p>
                                            <p className="font-semibold">{tp ? formatDateTime(tp.createdAt) : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Owner</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                {tp?.owner?.name ?? '-'}
                                                {tp?.owner?.role && (
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        ({tp.owner.role.toLowerCase()})
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Location</p>
                                            <p className="font-semibold">{tp?.owner?.location?.name ?? '-'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {tp?.owner?.location?.city ? `${tp.owner?.location.city}, ` : ''}
                                                {tp?.owner?.location?.province ?? ''}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Quantity</p>
                                            <p className="font-semibold">
                                                {tp?.quantity.toLocaleString()} {tp?.product?.unitOfMeasure ?? 'units'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action panel */}
                            <RoleGuard allowedRoles={['GROWER', 'DISTRIBUTOR', 'RETAILER']}>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Record Next Event</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {canHarvest && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Record that this lot has been harvested.</p>
                                                <Button
                                                    onClick={() => createEventMutation.mutate('HARVESTING')}
                                                    disabled={createEventMutation.isPending}
                                                >
                                                    {createEventMutation.isPending ? 'Recording…' : 'Record Harvesting'}
                                                </Button>
                                            </div>
                                        )}

                                        {canShip && (
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label htmlFor="destination-select">Destination Location</Label>
                                                    <AsyncLocationCombobox
                                                        id="destination-select"
                                                        value={destinationGln}
                                                        onChange={(val) => setDestinationGln(val)}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() => createEventMutation.mutate('SHIPPING')}
                                                    disabled={createEventMutation.isPending || !destinationGln}
                                                >
                                                    {createEventMutation.isPending ? 'Recording…' : 'Record Shipping'}
                                                </Button>
                                            </div>
                                        )}

                                        {(canReceiveAsDistributor || canReceiveAsRetailer) && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Confirm receipt of this shipment at your location.</p>
                                                <Button
                                                    onClick={() => createEventMutation.mutate('RECEIVING')}
                                                    disabled={createEventMutation.isPending}
                                                >
                                                    {createEventMutation.isPending ? 'Recording…' : 'Record Receiving'}
                                                </Button>
                                            </div>
                                        )}

                                        {canSell && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Mark this lot as sold to end consumers.</p>
                                                <Button
                                                    onClick={() => createEventMutation.mutate('SELLING')}
                                                    disabled={createEventMutation.isPending}
                                                >
                                                    {createEventMutation.isPending ? 'Recording…' : 'Record Selling'}
                                                </Button>
                                            </div>
                                        )}

                                        {!canHarvest && !canShip && !canReceiveAsDistributor && !canReceiveAsRetailer && !canSell && (
                                            <p className="text-sm text-muted-foreground">
                                                No actions available for your role at the current status ({currentActivity}).
                                            </p>
                                        )}

                                        {actionError && <p className="text-sm text-destructive">{actionError}</p>}

                                        {/* Blockchain submit for pending events */}
                                        {pendingEvent && (
                                            <>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Submit to Blockchain</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Event <span className="font-mono">{pendingEvent.id}</span> has been recorded
                                                        but not yet submitted to the blockchain.
                                                    </p>
                                                    <BlockchainSubmitButton
                                                        eventId={pendingEvent.id}
                                                        invalidateKeys={[
                                                            ['trace-product', id!],
                                                            ['trace-history', id!],
                                                        ]}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </RoleGuard>
                        </div>

                        <div className="space-y-6 md:col-span-1 lg:col-span-2 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
                            {/* Section 4: Event Timeline */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Event Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <EventTimeline events={history?.traceEvents ?? []} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

