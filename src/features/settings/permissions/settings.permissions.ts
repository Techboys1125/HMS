// ─── Settings Module RBAC ───
// Only privileged administrative roles may configure the hospital.

export type SettingsPermission = {
  canView: boolean;
  canManage: boolean;
};

const ROLE_SETTINGS_PERMISSIONS: Record<string, SettingsPermission> = {
  SUPER_ADMIN: { canView: true, canManage: true },
  ADMIN: { canView: true, canManage: true },
  HOSPITAL_ADMIN: { canView: true, canManage: true },
  DOCTOR: { canView: false, canManage: false },
  RECEPTIONIST: { canView: false, canManage: false },
  ACCOUNTANT: { canView: false, canManage: false },
  NURSE: { canView: false, canManage: false },
  PATIENT: { canView: false, canManage: false },
};

export function getSettingsPermission(
  role: string | undefined,
): SettingsPermission {
  const normalizedRole = String(role ?? "")
    .toUpperCase()
    .replace(/\s+/g, "_");
  return (
    ROLE_SETTINGS_PERMISSIONS[normalizedRole] ?? {
      canView: false,
      canManage: false,
    }
  );
}

export function canAccessSettings(role: string | undefined): boolean {
  return getSettingsPermission(role).canView;
}

export function canManageSettings(role: string | undefined): boolean {
  return getSettingsPermission(role).canManage;
}
