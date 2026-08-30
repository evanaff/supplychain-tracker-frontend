import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from '@/components/shared/SearchBar';
import { Pagination } from '@/components/shared/Pagination';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ErrorStateWithRetry } from '@/components/shared/ErrorState';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { productLotsApi } from '@/api/product-lots.api';
import { usePagination } from '@/hooks/usePagination';
import { useAuth } from '@/hooks/useAuth';
import {
    CreateProductLotSchema,
    type CreateProductLotFormValues,
} from './schemas/productLot.schema';
import config from '@/config';
import type { SupplyChainActivity } from '@/types/index';
import { ProductCombobox } from '@/components/shared/ProductCombobox';

const productEventSequence = [
    'CREATED',
    'HARVESTING',
    'SHIPPING',
    'RECEIVING',
    'SELLING',
] as const;

const FILTER_OPTIONS: Array<{ value: SupplyChainActivity | ''; label: string }> = [
    { value: '', label: 'All statuses' },
    ...productEventSequence.map((a) => ({ value: a as SupplyChainActivity, label: a })),
];

export default function ProductLotsPage() {
    useDocumentTitle(`Product Lots - ${config.app.name}`);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { page, limit, setPage } = usePagination();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<SupplyChainActivity | ''>('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const { isGrower } = useAuth();

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
        queryKey: ['product-lots', page, limit, search, statusFilter],
        queryFn: () =>
            productLotsApi
                .list({ page, limit, search: search || undefined, filter: statusFilter || undefined })
                .then((r) => r.data.data),
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateProductLotFormValues>({
        resolver: zodResolver(CreateProductLotSchema),
    });

    const createMutation = useMutation({
        mutationFn: (values: CreateProductLotFormValues) => productLotsApi.create(values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['product-lots'] });
            setDialogOpen(false);
            reset();
        },
    });

    const onSubmit = (values: CreateProductLotFormValues) => {
        createMutation.mutate(values);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Product Lots</h1>
                        <p className="text-muted-foreground text-sm">
                            Product lots being tracked through the supply chain
                        </p>
                    </div>
                    <RoleGuard allowedRoles={['GROWER']}>
                        <Button
                            id="create-lot-button"
                            onClick={() => setDialogOpen(true)}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Create Lot
                        </Button>
                    </RoleGuard>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchBar
                        placeholder="Search by lot number or ID…"
                        onSearch={setSearch}
                        className="flex-1 max-w-sm"
                    />
                    <Select
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter(v as SupplyChainActivity | '')}
                    >
                        <SelectTrigger className="w-full sm:w-48" id="status-filter">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {FILTER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        id="refresh-product-lots"
                        variant="outline"
                        size="icon"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        title="Refresh data"
                    >
                        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {isError ? (
                    <ErrorStateWithRetry onRetry={() => void refetch()} description={error?.message} />
                ) : (
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Lot Number</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Last Event</TableHead>
                                    <TableHead className="w-16" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                {Array.from({ length: 5 }).map((_, j) => (
                                                    <TableCell key={j}>
                                                        <Skeleton className="h-4 w-full" />
                                                    </TableCell>
                                                ))}
                                                <TableCell />
                                            </TableRow>
                                        ))
                                    : data?.productLots.map((pl) => (
                                            <TableRow
                                                key={pl.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => navigate(`/product-lots/${pl.id}`)}
                                            >
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {pl.id}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {pl.lotNumber}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {pl.product?.varietyName ?? pl.product.gtin}
                                                </TableCell>
                                                <TableCell>
                                                    {pl.quantity.toLocaleString()}
                                                    {pl.product?.unitOfMeasure ? ` ${pl.product.unitOfMeasure}` : ''}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge activity={pl.currentActivity} />
                                                </TableCell>
                                                <TableCell>
                                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={data?.pagination.totalPages ?? 1}
                    onPageChange={setPage}
                />
            </div>

            {/* Create Product Lot Dialog */}
            {isGrower && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Create Product Lot</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="gtin-select">Product</Label>
                                <Controller
                                    name="gtin"
                                    control={control}
                                    render={({ field }) => (
                                    <ProductCombobox
                                    id="gtin-select"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.gtin}
                                    />
                                    )}
                                />
                                {errors.gtin && (
                                    <p className="text-xs text-destructive">{errors.gtin.message}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    {...register('quantity', { valueAsNumber: true })}
                                />
                                {errors.quantity && (
                                    <p className="text-xs text-destructive">{errors.quantity.message}</p>
                                )}
                            </div>

                            {createMutation.isError && (
                                <p className="text-sm text-destructive">
                                    {createMutation.error.message}
                                </p>
                            )}

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); reset(); }}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating…' : 'Add Product Lot'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

