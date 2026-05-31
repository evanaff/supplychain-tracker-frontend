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
        return <Navigate to="/grower/dashboard" replace />;

      case "DISTRIBUTOR":
        return <Navigate to="/distributor/dashboard" replace />;

      case "RETAILER":
        return <Navigate to="/retailer/dashboard" replace />;

      case "CONSUMER":
        return <Navigate to="/consumer/dashboard" replace />;

      default:
        break;
    }
  }

  return children;
}