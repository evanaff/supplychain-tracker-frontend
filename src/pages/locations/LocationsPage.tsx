import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
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
import { locationsApi } from '@/api/locations.api';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import type { AllowedRole } from '@/types/location.types';

import config from '@/config';
import { useAuth } from '@/hooks/useAuth';

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

export default function LocationsPage() {
    useDocumentTitle(`Locations - ${config.app.name}`);

    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { page, limit, setPage } = usePagination();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');

    const debouncedSearch = useDebounce(search, 300);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['locations', page, limit, debouncedSearch, roleFilter],
        queryFn: () =>
            locationsApi.list({ page, limit, search: debouncedSearch || undefined, filter: roleFilter as AllowedRole || undefined }).then((r) => r.data.data),
    });

    if (!isAdmin) {
        return <Navigate to="/product-lots" replace />;
    }

    return (
        <>
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Location List</h1>
                        <p className="text-muted-foreground text-sm">
                            Supply chain location list
                        </p>
                    </div>
                    <Button id="create-location-button" onClick={() => navigate('/locations/new')} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Location
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                <SearchBar
                    placeholder="Search by name or GLN…"
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

                {isError ? (
                    <ErrorStateWithRetry onRetry={() => void refetch()} description={error?.message} />
                ) : (
                    <div className="rounded-lg border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>GLN</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Province</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Allowed Role</TableHead>
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
                                    : data?.locations.map((loc) => (
                                        <TableRow key={loc.gln}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {loc.gln}
                                            </TableCell>
                                            <TableCell className="font-medium">{loc.name}</TableCell>
                                            <TableCell>{loc.province}</TableCell>
                                            <TableCell>{loc.city}</TableCell>
                                            <TableCell>{loc.address || '-'}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={roleBadgeClass[loc.allowedRole] ?? ''}
                                                >
                                                    {loc.allowedRole}
                                                </Badge>
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


        </>
    );
}

