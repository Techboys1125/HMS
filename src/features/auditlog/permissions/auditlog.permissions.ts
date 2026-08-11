export interface AuditLogPermission {
  canView: boolean;
  canExport: boolean;
  canPrint: boolean;
}

const ROLE_AUDITLOG_PERMISSIONS: Record<string, AuditLogPermission> = {
  SUPER_ADMIN: { canView: true, canExport: true, canPrint: true },
  ADMIN: { canView: true, canExport: true, canPrint: true },
  HOSPITAL_ADMIN: { canView: true, canExport: true, canPrint: true },
  DOCTOR: { canView: false, canExport: false, canPrint: false },
  RECEPTIONIST: { canView: false, canExport: false, canPrint: false },
  ACCOUNTANT: { canView: false, canExport: false, canPrint: false },
  NURSE: { canView: false, canExport: false, canPrint: false },
  PATIENT: { canView: false, canExport: false, canPrint: false },
};

export function getAuditLogPermission(
  role: string | undefined,
): AuditLogPermission {
  const normalizedRole = String(role ?? "")
    .toUpperCase()
    .replace(/\s+/g, "_");
  return (
    ROLE_AUDITLOG_PERMISSIONS[normalizedRole] ?? {
      canView: false,
      canExport: false,
      canPrint: false,
    }
  );
}

export function canAccessAuditLog(role: string | undefined): boolean {
  return getAuditLogPermission(role).canView;
}
