import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Sprout, Truck, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/api/dashboard.api';
import config from '@/config';
import type { DashboardStats } from '@/types/dashboard.types';

function StatCard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <Card className="hover:shadow-md transition-shadow border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value.toLocaleString()}</div>
            </CardContent>
        </Card>
    );
}

function AdminDashboard() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboard', 'admin'],
        queryFn: () => dashboardApi.getAdminStats().then((r) => r.data.data),
    });

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (isError || !data) {
        return <p className="text-destructive text-sm">{error?.message || "Failed to load dashboard stats."}</p>;
    }

    const stats = data as DashboardStats;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Growers"
                value={stats.totalGrowers}
                icon={<Sprout className="h-4 w-4 text-emerald-700" />}
                color="bg-emerald-50"
            />
            <StatCard
                title="Distributors"
                value={stats.totalDistributors}
                icon={<Truck className="h-4 w-4 text-blue-700" />}
                color="bg-blue-50"
            />
            <StatCard
                title="Retailers"
                value={stats.totalRetailers}
                icon={<ShoppingBag className="h-4 w-4 text-violet-700" />}
                color="bg-violet-50"
            />
            <StatCard
                title="Locations"
                value={stats.totalLocations}
                icon={<MapPin className="h-4 w-4 text-amber-700" />}
                color="bg-amber-50"
            />
        </div>
    );
}

export default function DashboardPage() {
    useDocumentTitle(`Dashboard - ${config.app.name}`);

    const { actor, isAdmin } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/trace-products" replace />;
    }

    return (
        <>
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-sm">
                        Welcome back, {actor?.name ?? 'user'}.
                    </p>
                </div>

                <AdminDashboard />
            </div>
        </>
    );
}

