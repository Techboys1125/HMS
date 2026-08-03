import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../features/auth";
import { ROUTES } from "./routes";

interface PublicRouteProps {
  children?: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PublicRoute;
