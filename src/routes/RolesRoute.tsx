import { Navigate, Outlet } from "react-router-dom";

interface RoleRouteProps {
    allowedRoles: string[];
}

export default function RoleRoute({
    allowedRoles,
}: RoleRouteProps) {
    const role = localStorage.getItem("role");

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}