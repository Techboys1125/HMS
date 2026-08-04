import { useAuthStore } from "../features/auth/index";
import type { AppPermission } from "./types";
import {
  LEGACY_PERMISSION_MAP,
  ROLE_PERMISSIONS,
} from "./permissions.constants";
/**
 * Hook to verify current user's permissions and role
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const can = (permission: AppPermission | string): boolean => {
    if (!user) return false;

    const roleKey = String(user.role).toUpperCase();

    // SUPER_ADMIN, HOSPITAL_ADMIN, and ADMIN have master permission access
    if (
      roleKey === "SUPER_ADMIN" ||
      roleKey === "HOSPITAL_ADMIN" ||
      roleKey === "ADMIN"
    ) {
      return true;
    }

    const checkPermission = (perm: string): boolean => {
      // 1. If explicit permissions are configured on the user object, check them
      if (user.permissions && user.permissions.length > 0) {
        if (user.permissions.includes(perm)) return true;
      }

      // 2. Fallback: Lookup permissions by mapped uppercase role
      const permissions = ROLE_PERMISSIONS[roleKey];
      if (permissions && permissions.includes(perm as AppPermission)) {
        return true;
      }

      return false;
    };

    if (checkPermission(permission)) return true;

    // Check legacy mappings
    const mapped = LEGACY_PERMISSION_MAP[permission];
    if (mapped && checkPermission(mapped)) return true;

    return false;
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    const userRole = String(user.role).toUpperCase();
    return allowed.map((r) => r.toUpperCase()).includes(userRole);
  };

  return {
    can,
    hasRole,
    user,
    role: user?.role ? String(user.role).toUpperCase() : null,
  };
};