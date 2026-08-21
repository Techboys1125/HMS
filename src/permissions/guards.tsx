import { Navigate, Outlet } from "react-router";
import type { ReactNode } from "react";
import type { AppPermission } from "./types";

import { usePermissions } from "./usePermissions";

// --- Reusable Guards ---

interface RouteGuardProps {
  requiredPermission: AppPermission | string;
  children?: ReactNode;
  fallbackPath?: string;
}

/**
 * Route Guard: Protect views. If permission check fails, redirects to dashboard.
 */
export function RouteGuard({
  requiredPermission,
  children,
  fallbackPath = "/dashboard",
}: RouteGuardProps) {
  const { can } = usePermissions();

  if (!can(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
