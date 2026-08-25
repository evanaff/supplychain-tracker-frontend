import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppShell } from './components/shared/AppShell/AppShell';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { setApiClientNavigate, setApiClientClearAuth } from './api/client';
import { useAuth } from './hooks/useAuth';

// Pages
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const ActorsPage = lazy(() => import('./pages/actors/ActorsPage'));
const CreateActorPage = lazy(() => import('./pages/actors/CreateActorPage'));
const LocationsPage = lazy(() => import('./pages/locations/LocationsPage'));
const CreateLocationPage = lazy(() => import('./pages/locations/CreateLocationPage'));
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'));
const CreateProductPage = lazy(() => import('./pages/products/CreateProductPage'));
const TraceProductsPage = lazy(() => import('./pages/trace-products/TraceProductsPage'));
const TraceProductDetailPage = lazy(() => import('./pages/trace-products/TraceProductDetailPage'));
const ScanPage = lazy(() => import('./pages/scan/ScanPage'));
const ProductHistoryPage = lazy(() => import('./pages/product-history/ProductHistoryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
}

export default function App() {
    const navigate = useNavigate();
    const { clearAuth } = useAuth();

    useEffect(() => {
        setApiClientNavigate((path: string) => navigate(path));
        setApiClientClearAuth(() => clearAuth());
    }, [navigate, clearAuth]);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/trace-history/:id" element={<ProductHistoryPage />} />

                {/* Protected routes inside AppShell */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppShell />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="actors" element={<ActorsPage />} />
                    <Route path="actors/new" element={<CreateActorPage />} />
                    <Route path="locations" element={<LocationsPage />} />
                    <Route path="locations/new" element={<CreateLocationPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/new" element={<CreateProductPage />} />
                    <Route path="trace-products" element={<TraceProductsPage />} />
                    <Route path="trace-products/:id" element={<TraceProductDetailPage />} />
                    <Route path="scan" element={<ScanPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </Suspense>
    );
}
