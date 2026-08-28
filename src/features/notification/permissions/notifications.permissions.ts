import { ALL_ROLES } from "../constants/notifications.constants";

export type NotificationRoleKey = (typeof ALL_ROLES)[number];

export interface NotificationPermission {
  canView: boolean;
  canManageRules: boolean;
  canManageTemplates: boolean;
  canSendTest: boolean;
  canViewFailures: boolean;
  canUpdatePreferences: boolean;
  canExport: boolean;
}

const ROLE_NOTIFICATION_PERMISSIONS: Record<
  NotificationRoleKey,
  NotificationPermission
> = {
  "Hospital Admin": {
    canView: true,
    canManageRules: true,
    canManageTemplates: true,
    canSendTest: true,
    canViewFailures: true,
    canUpdatePreferences: true,
    canExport: true,
  },
  Doctor: {
    canView: true,
    canManageRules: false,
    canManageTemplates: false,
    canSendTest: false,
    canViewFailures: false,
    canUpdatePreferences: true,
    canExport: false,
  },
  Receptionist: {
    canView: true,
    canManageRules: false,
    canManageTemplates: false,
    canSendTest: false,
    canViewFailures: false,
    canUpdatePreferences: true,
    canExport: false,
  },
  Accountant: {
    canView: true,
    canManageRules: false,
    canManageTemplates: false,
    canSendTest: false,
    canViewFailures: false,
    canUpdatePreferences: true,
    canExport: true,
  },
  Nurse: {
    canView: true,
    canManageRules: false,
    canManageTemplates: false,
    canSendTest: false,
    canViewFailures: false,
    canUpdatePreferences: true,
    canExport: false,
  },
  "Patient Portal": {
    canView: true,
    canManageRules: false,
    canManageTemplates: false,
    canSendTest: false,
    canViewFailures: false,
    canUpdatePreferences: true,
    canExport: false,
  },
};

export function getNotificationPermission(
  role: string | undefined,
): NotificationPermission {
  const normalized = normalizeNotificationRole(role);
  return (
    ROLE_NOTIFICATION_PERMISSIONS[normalized] ??
    ROLE_NOTIFICATION_PERMISSIONS["Hospital Admin"]
  );
}

function normalizeNotificationRole(
  role: string | undefined,
): NotificationRoleKey {
  const upper = String(role ?? "").toUpperCase();
  if (upper === "PATIENT" || upper === "PATIENT PORTAL")
    return "Patient Portal";
  if (upper === "NURSE") return "Nurse";
  if (upper === "ACCOUNTANT") return "Accountant";
  if (upper === "RECEPTIONIST") return "Receptionist";
  if (upper === "DOCTOR") return "Doctor";
  return "Hospital Admin";
}
