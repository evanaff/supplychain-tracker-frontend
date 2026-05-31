import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import GrowerDashboardPage from "../pages/grower/DashboardPage";
import DistributorDashboardPage from "../pages/distributor/DistributorDashboardPage";
import RetailerDashboardPage from "../pages/retailer/RetailerDashboardPage";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RolesRoute";

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

                {/* GROWER */}
                <Route
                    element={<RoleRoute allowedRoles={["GROWER"]} />}
                >
                    <Route
                        path="/grower/dashboard"
                        element={<GrowerDashboardPage />}
                    />
                </Route>

                {/* DISTRIBUTOR */}
                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["DISTRIBUTOR"]}
                        />
                    }
                >
                    <Route
                        path="/distributor/dashboard"
                        element={<DistributorDashboardPage />}
                    />
                </Route>

                {/* RETAILER */}
                <Route
                    element={<RoleRoute allowedRoles={["RETAILER"]} />}
                >
                    <Route
                        path="/retailer/dashboard"
                        element={<RetailerDashboardPage />}
                    />
                </Route>
            </Route>

            {/* 404 */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}