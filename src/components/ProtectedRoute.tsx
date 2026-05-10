import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // role tidak sesuai
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}