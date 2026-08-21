import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../features/auth/store/auth.store";
import { ROUTES } from "./routes";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
