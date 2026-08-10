import { ROLES, type UserRole } from "../constants/reports.constants";

export interface ReportPermission {
  canView: boolean;
  canExport: boolean;
  canPrint: boolean;
}

const ROLE_REPORT_PERMISSIONS: Record<UserRole, Record<string, ReportPermission>> = {
  [ROLES.ADMIN]: {
    "daily-appointments": { canView: true, canExport: true, canPrint: true },
    "daily-revenue": { canView: true, canExport: true, canPrint: true },
    "patient-registrations": { canView: true, canExport: true, canPrint: true },
    "doctor-performance": { canView: true, canExport: true, canPrint: true },
    "billing-report": { canView: true, canExport: true, canPrint: true },
    "collection-rate": { canView: true, canExport: true, canPrint: true },
  },
  [ROLES.DOCTOR]: {
    "daily-appointments": { canView: true, canExport: true, canPrint: false },
    "patient-registrations": { canView: true, canExport: true, canPrint: false },
    "doctor-performance": { canView: true, canExport: true, canPrint: false },
  },
  [ROLES.RECEPTIONIST]: {
    "daily-appointments": { canView: true, canExport: true, canPrint: true },
    "patient-registrations": { canView: true, canExport: true, canPrint: true },
  },
  [ROLES.ACCOUNTANT]: {
    "daily-revenue": { canView: true, canExport: true, canPrint: true },
    "billing-report": { canView: true, canExport: true, canPrint: true },
    "collection-rate": { canView: true, canExport: true, canPrint: true },
  },
};

export function getReportPermission(role: string | undefined, reportKey: string): ReportPermission {
  const normalizedRole = String(role ?? "").toUpperCase() as UserRole;
  const permissions = ROLE_REPORT_PERMISSIONS[normalizedRole];
  if (!permissions) {
    return ROLE_REPORT_PERMISSIONS[ROLES.ADMIN][reportKey] ?? { canView: false, canExport: false, canPrint: false };
  }
  return permissions[reportKey] ?? { canView: false, canExport: false, canPrint: false };
}

export function canAccessReport(role: string | undefined, reportKey: string): boolean {
  return getReportPermission(role, reportKey).canView;
}

export function getAvailableReports(role: string | undefined): string[] {
  const normalizedRole = String(role ?? "").toUpperCase() as UserRole;
  const permissions = ROLE_REPORT_PERMISSIONS[normalizedRole];
  if (!permissions) return Object.keys(ROLE_REPORT_PERMISSIONS[ROLES.ADMIN]);
  return Object.keys(permissions);
}
