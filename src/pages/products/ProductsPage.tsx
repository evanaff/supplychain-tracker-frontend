import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from '@/components/shared/SearchBar';
import { Pagination } from '@/components/shared/Pagination';
import { ErrorStateWithRetry } from '@/components/shared/ErrorState';
import { usePagination } from '@/hooks/usePagination';
import { useAuth } from '@/hooks/useAuth';
import config from '@/config';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { fetchWithAuth } from '@/lib/fetch';

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
                            <span className="text-[11px] font-medium text-foreground">
                                {product.gtin}
                            </span>
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
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [completedRequestKey, setCompletedRequestKey] = useState<string | null>(null);

    const requestKey = [
        page,
        limit,
        search,
        retryCount,
    ].join('|');
    const isLoading = completedRequestKey !== requestKey;

    useEffect(() => {
        let isActive = true;

        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (search) {
                    params.set('search', search);
                }

                const response = await fetchWithAuth(
                    `${config.api.baseUrl}/api/products?${params.toString()}`,
                );

                if (!response.ok) {
                    const errorResult = await response.json();
                    throw new Error(errorResult.message ?? 'Failed to load products');
                }

                const result = await response.json();

                if (!isActive) return;

                setProducts(result.data.products);
                setTotalPages(result.data.pagination.totalPages);
                setError(null);
            } catch (err) {
                if (!isActive) return;

                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Failed to load products');
                }
            } finally {
                if (isActive) {
                    setCompletedRequestKey(requestKey);
                }
            }
        };

        fetchProducts();

        return () => {
            isActive = false;
        };
    }, [page, limit, search, retryCount, requestKey]);

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Product List</h1>
                        <p className="text-muted-foreground text-sm">Traceable product list</p>
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

                {error ? (
                    <ErrorStateWithRetry onRetry={() => setRetryCount((value) => value + 1)} description={error} />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                            : products.map((product) => (
                                <ProductCard key={product.gtin} product={product} />
                            ))}
                    </div>
                )}

                {!isLoading && products.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No products found.
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
}

