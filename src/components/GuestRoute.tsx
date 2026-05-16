import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({
  children,
}: GuestRouteProps) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {

    if (role === "ADMIN") {
      return <Navigate to="/admin/actors" replace />;
    }

    if (role === "GROWER") {
      return <Navigate to="/grower/trace-products" replace />;
    }

    if (role === "DISTRIBUTOR") {
      return <Navigate to="/distributor" replace />;
    }

    if (role === "RETAILER") {
      return <Navigate to="/retailer" replace />;
    }
  }

  return children;
}