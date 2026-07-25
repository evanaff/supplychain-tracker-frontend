import { Navigate } from "react-router-dom";

interface GuestRouteProps {
    children: React.ReactNode;
}

export default function GuestRoute({
    children,
}: GuestRouteProps) {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (accessToken && role) {
        switch (role) {
            case "ADMIN":
                return <Navigate to="/admin/dashboard" replace />;

            case "GROWER":
                return <Navigate to="/grower/trace-products" replace />;

            case "DISTRIBUTOR":
                return <Navigate to="/distributor/trace-products" replace />;

            case "RETAILER":
                return <Navigate to="/retailer/trace-products" replace />;

            default:
                break;
        }
    }

    return children;
}