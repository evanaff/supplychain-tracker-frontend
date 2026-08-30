import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ProductEventTimeline } from '@/components/shared/ProductEventTimeline';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BlockchainSubmitButton } from '@/components/shared/BlockchainSubmitButton';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { ErrorState } from '@/components/shared/ErrorState';
import { productLotsApi } from '@/api/product-lots.api';
import { productEventsApi } from '@/api/product-events.api';
import { LocationCombobox } from '@/components/shared/LocationCombobox';
import { formatDateTime } from '@/lib/utils';
import config from '@/config';
import type { SupplyChainActivity } from '@/types';
import { QRCodeCanvas } from 'qrcode.react';

export default function ProductLotDetailPage() {
    useDocumentTitle(`Product Lot Detail - ${config.app.name}`);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [destinationGln, setDestinationGln] = useState('');
    const [actionError, setActionError] = useState<string | null>(null);
    const [selectedPendingEventId, setSelectedPendingEventId] = useState<string>('');

    const [selectedActivity, setSelectedActivity] = useState<SupplyChainActivity | ''>('');

    const { data: history, isLoading, isError, error } = useQuery({
        queryKey: ['product-lot', id],
        queryFn: () => productLotsApi.getHistory(id!).then((r) => r.data.data),
        enabled: Boolean(id),
    });

    const createEventMutation = useMutation({
        mutationFn: async (payload: { activity: SupplyChainActivity; destinationGln?: string }) => {
            return productEventsApi.create({
                productLotId: id!,
                supplyChainActivity: payload.activity,
                destinationLocationGln: payload.destinationGln,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['product-lot', id] });
            void queryClient.invalidateQueries({ queryKey: ['product-history', id] });
            setActionError(null);
            setSelectedActivity('');
            setDestinationGln('');
        },
        onError: (err: Error) => {
            setActionError(err.message ?? 'Failed to create event.');
        },
    });

    const productHistoryUrl = `${window.location.origin}/product-history/${id}`;

    if (isError) {
        return (
            <ErrorState
                variant="not-found"
                title="Product Lot not found"
                description={error?.message}
                action={<Button variant="outline" onClick={() => navigate('/product-lots')}>Back</Button>}
            />
        );
    }

    const pendingEvents = history?.productEvents.filter((e) => !e.isSubmitted) ?? [];
    const activePendingEventId =
        pendingEvents.length === 1
        ? pendingEvents[0].id
        : selectedPendingEventId;
    
    const handleDownloadQR = () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        if (canvas) {
            const padding = 24;
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
            downloadLink.download = `product-lot-${history?.productLot.lotNumber ?? id}.png`;
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
                    <Button variant="ghost" size="icon" onClick={() => navigate('/product-lots')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        {isLoading ? (
                            <Skeleton className="h-7 w-48" />
                        ) : (
                            <h1 className="text-2xl font-bold tracking-tight font-mono">{history?.productLot.lotNumber ?? 'Product Lot Detail'}</h1>
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
                                    <CardTitle className="text-lg">Product History QR Code</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border inline-block">
                                        <QRCodeCanvas
                                            id="qr-canvas"
                                            value={productHistoryUrl}
                                            size={200}
                                            level="H"
                                            className="mx-auto rounded-md"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md mx-auto">
                                        <code className="text-xs w-full sm:flex-1 truncate p-2.5 bg-muted rounded-md border text-center sm:text-left">{productHistoryUrl}</code>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 sm:flex-none gap-1"
                                                onClick={() => void navigator.clipboard.writeText(productHistoryUrl)}
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
                                        {history?.productLot.product?.imageUrl && (
                                            <div className="shrink-0">
                                                <img
                                                    src={history.productLot.product.imageUrl}
                                                    alt={history.productLot.product.varietyName}
                                                    className="h-24 w-24 object-cover rounded-md border"
                                                />
                                            </div>
                                        )}
                                        <div className="grid gap-4 sm:grid-cols-2 text-sm flex-1">
                                            <div>
                                                <p className="text-muted-foreground mb-1">Variety Name</p>
                                                <p className="font-semibold">{history?.productLot.product?.varietyName ?? '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">GTIN</p>
                                                <p className="font-semibold font-mono">{history?.productLot.product?.gtin ?? '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">Unit of Measure</p>
                                                <p className="font-semibold">{history?.productLot.product?.unitOfMeasure ?? '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section 3: Product Lot Information */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Product Lot Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-1">ID</p>
                                            <p className="font-semibold font-mono">{history?.productLot.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Lot Number</p>
                                            <p className="font-semibold font-mono">{history?.productLot.lotNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Last Event</p>
                                            {history && <StatusBadge activity={history.productLot.currentActivity} />}
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Created At</p>
                                            <p className="font-semibold">{history ? formatDateTime(history.productLot.createdAt) : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Current Owner</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                {history?.productLot.owner?.name ?? '-'}
                                                {history?.productLot.owner?.role && (
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        ({history.productLot.owner.role.toLowerCase()})
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Quantity</p>
                                            <p className="font-semibold">
                                                {history?.productLot.quantity.toLocaleString()} {history?.productLot.product?.unitOfMeasure ?? 'units'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action panel */}
                            <RoleGuard allowedRoles={['GROWER', 'DISTRIBUTOR', 'RETAILER']}>
                                <Card className="overflow-visible">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Record Next Event</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="activity-select">Supply Chain Activity</Label>
                                                <Select
                                                    value={selectedActivity}
                                                    onValueChange={(val) => setSelectedActivity(val as SupplyChainActivity)}
                                                >
                                                    <SelectTrigger id="activity-select">
                                                        <SelectValue placeholder="Select activity" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="HARVESTING">Harvesting</SelectItem>
                                                        <SelectItem value="SHIPPING">Shipping</SelectItem>
                                                        <SelectItem value="RECEIVING">Receiving</SelectItem>
                                                        <SelectItem value="SELLING">Selling</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {selectedActivity === 'SHIPPING' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="destination-select">Destination Location</Label>
                                                    <LocationCombobox
                                                        id="destination-select"
                                                        value={destinationGln}
                                                        onChange={(val) => setDestinationGln(val)}
                                                    />
                                                </div>
                                            )}

                                            {actionError && <p className="text-sm text-destructive">{actionError}</p>}

                                            <Button
                                                className="w-full"
                                                onClick={() => createEventMutation.mutate({ activity: selectedActivity as SupplyChainActivity, destinationGln })}
                                                disabled={
                                                !selectedActivity ||
                                                createEventMutation.isPending ||
                                                (selectedActivity === 'SHIPPING' && !destinationGln)
                                                }
                                            >
                                                {createEventMutation.isPending ? 'Recording…' : 'Record'}
                                            </Button>
                                        </div>

                                        {pendingEvents.length > 0 && (
                                        <>
                                            <Separator />
                                            <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium">Submit to Blockchain</p>
                                            </div>

                                            <div className="space-y-3">
                                                <Select
                                                value={activePendingEventId}
                                                onValueChange={(val) => setSelectedPendingEventId(val ?? '')}
                                                >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select product event ID" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {pendingEvents.map((event) => (
                                                    <SelectItem key={event.id} value={event.id}>
                                                        {event.id}
                                                    </SelectItem>
                                                    ))}
                                                </SelectContent>
                                                </Select>

                                                <BlockchainSubmitButton
                                                eventId={activePendingEventId}
                                                disabled={!activePendingEventId}
                                                invalidateKeys={[
                                                    ['product-lot', id!],
                                                    ['product-history', id!],
                                                ]}
                                                />
                                            </div>
                                            </div>
                                        </>
                                        )}
                                    </CardContent>
                                </Card>
                            </RoleGuard>
                        </div>

                        <div className="space-y-6 md:col-span-1 lg:col-span-2 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
                            {/* Section 4: Product Event Timeline */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Product Event Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ProductEventTimeline events={history?.productEvents ?? []} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

