import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Navigate } from 'react-router-dom';
import { MapPin, Sprout, Truck, Store, Apple, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import config from '@/config';
import type { DashboardData } from '@/types';
import { fetchWithAuth } from '@/lib/fetch';
import { useEffect, useState } from 'react';

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
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
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
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetchWithAuth(
                    `${config.api.baseUrl}/api/dashboard`,
                );

                if (!response.ok) {
                    const errorResult = await response.json();
                    throw new Error(errorResult.message ?? 'Failed to load dashboard stats');
                }

                const result = await response.json();
                setData(result.data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Failed to load dashboard stats');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();   
    }, []);

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
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

    if (error || !data) {
        return <p className="text-destructive text-sm">{error ?? "Failed to load dashboard stats."}</p>;
    }

    return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
                title="Total Growers"
                value={data.totalGrowers}
                icon={<Sprout className="h-9 w-9 text-emerald-700" />}
                color="bg-emerald-50"
            />
            <StatCard
                title="Total Distributors"
                value={data.totalDistributors}
                icon={<Truck className="h-9 w-9 text-blue-700" />}
                color="bg-blue-50"
            />
            <StatCard
                title="Total Retailers"
                value={data.totalRetailers}
                icon={<Store className="h-9 w-9 text-violet-700" />}
                color="bg-violet-50"
            />
            <StatCard
                title="Total Locations"
                value={data.totalLocations}
                icon={<MapPin className="h-9 w-9 text-amber-700" />}
                color="bg-amber-50"
            />
            <StatCard
                title="Total Products"
                value={data.totalProducts}
                icon={<Apple className="h-9 w-9 text-rose-700" />}
                color="bg-rose-50"
            />
            <StatCard
                title="Total Product Lots"
                value={data.totalProductLots}
                icon={<Package className="h-9 w-9 text-cyan-700" />}
                color="bg-cyan-50"
            />
        </div>
    );
}

export default function DashboardPage() {
    useDocumentTitle(`Dashboard - ${config.app.name}`);

    const { actor, isAdmin } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/product-lots" replace />;
    }

    return (
        <>
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-sm">
                        Welcome back, {actor?.name ?? 'user'}
                    </p>
                </div>

                <AdminDashboard />
            </div>
        </>
    );
}

