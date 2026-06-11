import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import AdminDashboardPage from "../pages/admin/DashboardPage";
import ActorListPage from "../pages/admin/ActorListPage";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RolesRoute";
import CreateActorPage from "../pages/admin/CreateActorPage";
import LocationListPage from "../pages/admin/LocationListPage";
import CreateLocationPage from "../pages/admin/CreateLocationPage";
import DashboardPage from "../pages/executor/dashboard/DashboardPage";
import TraceProductListPage from "../pages/executor/trace-product/TraceProductListPage";
import CreateTraceProductPage from "../pages/executor/trace-product/CreateTraceProductPage";
import TraceProductDetailPage from "../pages/executor/trace-product/TraceProductDetailPage";
import TraceEventDetailPage from "../pages/executor/trace-event/TraceEventDetailPage";
import CreateTraceEventPage from "../pages/executor/trace-event/CreateTraceEventPage";
import ReviewTraceEventPage from "../pages/executor/trace-event/ReviewTraceEventPage";
import ScanTraceProductPage from "../pages/executor/scan/ScanTraceProductPage";
import TraceProductHistoryPage from "../pages/consumer/TraceProductHistoryPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* ROOT */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* PUBLIC */}
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                }
            />
            <Route
                path="/trace-products/:id"
                element={
                    <TraceProductHistoryPage />
                }
            />

            {/* PROTECTED */}
            <Route element={<ProtectedRoute />}>
                {/* ADMIN */}
                <Route
                    element={<RoleRoute allowedRoles={["ADMIN"]} />}
                >
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboardPage />}
                    />

                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["ADMIN"]} />}
                >
                    <Route
                        path="/admin/actors"
                        element={<ActorListPage />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["ADMIN"]} />}
                >
                    <Route
                        path="/admin/actors/add"
                        element={<CreateActorPage />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["ADMIN"]} />}
                >
                    <Route
                        path="/admin/locations"
                        element={<LocationListPage />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["ADMIN"]} />}
                >
                    <Route
                        path="/admin/locations/add"
                        element={<CreateLocationPage />}
                    />
                </Route>

                {/* GROWER */}
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/dashboard"
                        element={<DashboardPage role="GROWER" />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/trace-products"
                        element={<TraceProductListPage role="GROWER" />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/trace-products/create"
                        element={<CreateTraceProductPage />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/trace-products/:id"
                        element={<TraceProductDetailPage role="GROWER" />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/trace-events/:id"
                        element={<TraceEventDetailPage role="GROWER"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/trace-products/:id/harvesting"
                        element={<CreateTraceEventPage role="GROWER" eventType="HARVESTING"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/trace-products/:id/shipping"
                        element={<CreateTraceEventPage role="GROWER" eventType="SHIPPING"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/trace-events/:id/review"
                        element={<ReviewTraceEventPage role="GROWER" />}
                    />
                </Route>
                 <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/scan"
                        element={<ScanTraceProductPage role="GROWER" />}
                    />
                </Route>

                {/* DISTRIBUTOR */}
                <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/dashboard"
                        element={<DashboardPage role="DISTRIBUTOR" />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/trace-products"
                        element={<TraceProductListPage role="DISTRIBUTOR" />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/trace-products/:id"
                        element={<TraceProductDetailPage role="DISTRIBUTOR" />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/trace-events/:id"
                        element={<TraceEventDetailPage role="DISTRIBUTOR"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/trace-products/:id/receiving"
                        element={<CreateTraceEventPage role="DISTRIBUTOR" eventType="RECEIVING"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/trace-products/:id/shipping"
                        element={<CreateTraceEventPage role="DISTRIBUTOR" eventType="SHIPPING"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/trace-events/:id/review"
                        element={<ReviewTraceEventPage role="DISTRIBUTOR" />}
                    />
                </Route>
                 <Route
                    element={<RoleRoute allowedRoles={["DISTRIBUTOR"]} />}
                >
                    <Route
                        path="/distributor/scan"
                        element={<ScanTraceProductPage role="DISTRIBUTOR" />}
                    />
                </Route>

                {/* RETAILER */}
                <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/dashboard"
                        element={<DashboardPage role="RETAILER" />}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/trace-products"
                        element={<TraceProductListPage role="RETAILER" />}
                    />
                </Route>
                </Route>
                    <Route
                        element={<RoleRoute allowedRoles={["RETAILER"]} />}
                    >
                        <Route
                            path="/retailer/trace-products/:id"
                            element={<TraceProductDetailPage role="RETAILER" />}
                        />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/trace-events/:id"
                        element={<TraceEventDetailPage role="RETAILER"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/trace-products/:id/receiving"
                        element={<CreateTraceEventPage role="RETAILER" eventType="RECEIVING"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/trace-products/:id/selling"
                        element={<CreateTraceEventPage role="RETAILER" eventType="SELLING"/>}
                    />
                </Route>
                <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/trace-events/:id/review"
                        element={<ReviewTraceEventPage role="RETAILER" />}
                    />
                </Route>
                 <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/scan"
                        element={<ScanTraceProductPage role="RETAILER" />}
                    />
                </Route>

                {/* 404 */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
        </Routes>
    );
}