import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
import { ErrorStateWithRetry } from '@/components/shared/ErrorState';
import { shortenAddress } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';

import config from '@/config';
import { useAuth } from '@/hooks/useAuth';
import { fetchWithAuth } from '@/lib/fetch';
import type { Actor } from '@/types';

const FILTER_OPTIONS: Array<{ value: string; label: string }> = [
    { value: '', label: 'All roles' },
    { value: 'GROWER', label: 'GROWER' },
    { value: 'DISTRIBUTOR', label: 'DISTRIBUTOR' },
    { value: 'RETAILER', label: 'RETAILER' },
];

const roleBadgeClass: Record<string, string> = {
    GROWER: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-transparent',
    DISTRIBUTOR: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-transparent',
    RETAILER: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-transparent',
};

export default function ActorsPage() {
    useDocumentTitle(`Actors - ${config.app.name}`);

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { page, limit, setPage } = usePagination();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [actors, setActors] = useState<Actor[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [completedRequestKey, setCompletedRequestKey] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 300);
    const requestKey = [
        page,
        limit,
        debouncedSearch,
        roleFilter,
        retryCount,
    ].join('|');
    const isLoading = completedRequestKey !== requestKey;

    useEffect(() => {
        let isActive = true;

        const fetchActors = async () => {
            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (debouncedSearch) {
                    params.set('search', debouncedSearch);
                }

                if (roleFilter) {
                    params.set('filter', roleFilter);
                }

                const response = await fetchWithAuth(
                    `${config.api.baseUrl}/api/actors?${params.toString()}`,
                );

                if (!response.ok) {
                    const errorResult = await response.json();
                    throw new Error(errorResult.message ?? 'Failed to load actors');
                }

                const result = await response.json();

                if (!isActive) return;

                setActors(result.data.actors);
                setTotalPages(result.data.pagination.totalPages);
                setError(null);
            } catch (err) {
                if (!isActive) return;

                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Failed to load actors');
                }
            } finally {
                if (isActive) {
                    setCompletedRequestKey(requestKey);
                }
            }
        };

        fetchActors();

        return () => {
            isActive = false;
        };
    }, [page, limit, debouncedSearch, roleFilter, retryCount, requestKey, isAdmin]);

    if (!isAdmin) {
        return <Navigate to="/product-lots" replace />;
    }

    return (
        <>
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Actor List</h1>
                        <p className="text-muted-foreground text-sm">
                            Registered supply chain actor list
                        </p>
                    </div>
                    <Button id="create-actor-button" onClick={() => navigate('/actors/new')} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Actor
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchBar
                        placeholder="Search by name…"
                        onSearch={setSearch}
                        className="flex-1 max-w-sm"
                    />
                    <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val ?? '')}>
                        <SelectTrigger className="w-full sm:w-44" id="role-filter">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            {FILTER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                {error ? (
                    <ErrorStateWithRetry onRetry={() => setRetryCount((value) => value + 1)} />
                ) : (
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Blockchain Address</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Tx Hash</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: 4 }).map((_, j) => (
                                                <TableCell key={j}>
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                    : actors.map((actor) => (
                                        <TableRow
                                            key={actor.blockchainAddress}
                                        >
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {shortenAddress(actor.blockchainAddress)}
                                            </TableCell>
                                            <TableCell className="font-medium">{actor.name}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={roleBadgeClass[actor.role] ?? ''}
                                                >
                                                    {actor.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {actor.location.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {actor.txHash ? (
                                                    config.chain.blockchainExplorerUrl ? (
                                                        <a
                                                            href={`${config.chain.blockchainExplorerUrl}/tx/${actor.txHash}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 font-mono text-primary hover:text-primary/80 hover:underline transition-colors"
                                                            title="View on Block Explorer"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            {actor.txHash.slice(0, 8)}...{actor.txHash.slice(-6)}
                                                        </a>
                                                    ) : (
                                                        <span className="font-mono">
                                                            {actor.txHash.slice(0, 8)}...{actor.txHash.slice(-6)}
                                                        </span>
                                                    )
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
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

