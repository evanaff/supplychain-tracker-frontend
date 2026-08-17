import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/shared/SearchBar';
import { Pagination } from '@/components/shared/Pagination';
import { ErrorStateWithRetry } from '@/components/shared/ErrorState';
import { productsApi } from '@/api/products.api';
import { usePagination } from '@/hooks/usePagination';
import { useAuth } from '@/hooks/useAuth';
import config from '@/config';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product.types';

function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer shadow-sm border-border/80">
            <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-900/50 rounded-t-lg overflow-hidden flex items-center justify-center p-6">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.varietyName}
                            className="max-h-full max-w-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <Package className="h-10 w-10 text-muted-foreground/30" />
                    )}
                </div>
                <div className="p-3.5 flex flex-col gap-3">
                    <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
                        {product.varietyName}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                GTIN
                            </span>
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono font-normal w-fit">
                                {product.gtin}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Unit of Measure
                            </span>
                            <span className="text-[11px] font-medium text-foreground">
                                {product.unitOfMeasure}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ProductCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-0">
                <Skeleton className="aspect-[4/3] rounded-t-lg" />
                <div className="p-3.5 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function ProductsPage() {
    useDocumentTitle(`Products - ${config.app.name}`);

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { page, limit, setPage } = usePagination();
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['products', page, limit, search],
        queryFn: () =>
            productsApi.list({ page, limit, search: search || undefined }).then((r) => r.data.data),
    });

    return (
        <>
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground text-sm">Browse the traceable product catalog.</p>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => navigate('/products/new')} className="shrink-0">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    )}
                </div>

                <SearchBar
                    placeholder="Search by variety name…"
                    onSearch={setSearch}
                    className="max-w-sm"
                />

                {isError ? (
                    <ErrorStateWithRetry onRetry={() => void refetch()} description={error?.message} />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                            : data?.products.map((product) => (
                                <ProductCard key={product.gtin} product={product} />
                            ))}
                    </div>
                )}

                {!isLoading && data?.products.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No products found.
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={data?.pagination.totalPages ?? 1}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
}

