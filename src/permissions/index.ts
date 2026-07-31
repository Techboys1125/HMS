import { useAuthStore } from "../features/auth/index";

// Permission utilities

export type PermissionAction =
  | "VIEW"
  | "CREATE"
  | "EDIT"
  | "DELETE"
  | "CANCEL"
  | "APPROVE"
  | "PRINT"
  | "EXPORT"
  | "ADMINISTER";

export type AppPermission =
  | "DASHBOARD_VIEW"
  | "USER_VIEW"
  | "USER_CREATE"
  | "USER_EDIT"
  | "USER_DEACTIVATE"
  | "PATIENT_VIEW"
  | "PATIENT_VIEW_MINIMAL"
  | "PATIENT_CREATE"
  | "PATIENT_EDIT"
  | "PATIENT_VIEW_HISTORY"
  | "PATIENT_STATUS_UPDATE"
  | "PATIENT_DUPLICATE_OVERRIDE"
  | "PATIENT_MERGE"
  | "PATIENT_VIEW_SELF"
  | "PATIENT_EDIT_SELF"
  | "DOCTOR_VIEW"
  | "DOCTOR_VIEW_OWN"
  | "DOCTOR_CREATE"
  | "DOCTOR_EDIT"
  | "DOCTOR_SCHEDULE_MANAGE"
  | "APPOINTMENT_VIEW"
  | "APPOINTMENT_CREATE"
  | "APPOINTMENT_EDIT"
  | "APPOINTMENT_RESCHEDULE"
  | "APPOINTMENT_CANCEL"
  | "APPOINTMENT_CHECK_IN"
  | "APPOINTMENT_MARK_NO_SHOW"
  | "APPOINTMENT_VIEW_HISTORY"
  | "APPOINTMENT_VIEW_QUEUE"
  | "RECEPTION_VIEW"
  | "OPD_VIEW"
  | "OPD_CREATE"
  | "OPD_EDIT"
  | "PRESCRIPTION_VIEW"
  | "PRESCRIPTION_CREATE"
  | "PRESCRIPTION_PRINT"
  | "BILLING_VIEW"
  | "BILLING_CREATE"
  | "BILLING_EDIT"
  | "REPORT_VIEW"
  | "REPORT_EXPORT"
  | "CHECKIN_CREATE"
  | "CHECKIN_EDIT_LIMITED"
  | "QUEUE_VIEW"
  | "VITALS_CREATE"
  | "VITALS_EDIT"
  | "PAYMENT_RECEIVE"
  | "REFUND_CREATE"
  | "PROFILE_VIEW"
  | "PROFILE_EDIT"
  | "MY_APPOINTMENTS_VIEW"
  | "MY_PRESCRIPTIONS_VIEW"
  | "MY_BILLS_VIEW";

// Default permissions fallback for local role mapping
export const ROLE_PERMISSIONS: Record<string, AppPermission[]> = {
  SUPER_ADMIN: [
    "DASHBOARD_VIEW",
    "USER_VIEW",
    "USER_CREATE",
    "USER_EDIT",
    "USER_DEACTIVATE",
    "PATIENT_VIEW",
    "PATIENT_CREATE",
    "PATIENT_EDIT",
    "DOCTOR_VIEW",
    "DOCTOR_CREATE",
    "DOCTOR_EDIT",
    "APPOINTMENT_VIEW",
    "APPOINTMENT_CREATE",
    "APPOINTMENT_EDIT",
    "APPOINTMENT_CANCEL",
    "RECEPTION_VIEW",
    "OPD_VIEW",
    "OPD_CREATE",
    "OPD_EDIT",
    "PRESCRIPTION_VIEW",
    "PRESCRIPTION_CREATE",
    "PRESCRIPTION_PRINT",
    "BILLING_VIEW",
    "BILLING_CREATE",
    "BILLING_EDIT",
    "REPORT_VIEW",
    "REPORT_EXPORT",
    "CHECKIN_CREATE",
    "CHECKIN_EDIT_LIMITED",
    "QUEUE_VIEW",
    "VITALS_CREATE",
    "VITALS_EDIT",
    "PAYMENT_RECEIVE",
    "REFUND_CREATE",
  ],
  HOSPITAL_ADMIN: [
    "DASHBOARD_VIEW",
    "USER_VIEW",
    "USER_CREATE",
    "USER_EDIT",
    "USER_DEACTIVATE",
    "PATIENT_VIEW",
    "PATIENT_CREATE",
    "PATIENT_EDIT",
    "DOCTOR_VIEW",
    "DOCTOR_CREATE",
    "DOCTOR_EDIT",
    "APPOINTMENT_VIEW",
    "APPOINTMENT_CREATE",
    "APPOINTMENT_EDIT",
    "APPOINTMENT_CANCEL",
    "RECEPTION_VIEW",
    "OPD_VIEW",
    "OPD_CREATE",
    "OPD_EDIT",
    "PRESCRIPTION_VIEW",
    "PRESCRIPTION_CREATE",
    "PRESCRIPTION_PRINT",
    "BILLING_VIEW",
    "BILLING_CREATE",
    "BILLING_EDIT",
    "REPORT_VIEW",
    "REPORT_EXPORT",
    "CHECKIN_CREATE",
    "CHECKIN_EDIT_LIMITED",
    "QUEUE_VIEW",
    "VITALS_CREATE",
    "VITALS_EDIT",
    "PAYMENT_RECEIVE",
    "REFUND_CREATE",
  ],
  ADMIN: [
    "DASHBOARD_VIEW",
    "USER_VIEW",
    "USER_CREATE",
    "USER_EDIT",
    "USER_DEACTIVATE",
    "PATIENT_VIEW",
    "PATIENT_CREATE",
    "PATIENT_EDIT",
    "DOCTOR_VIEW",
    "DOCTOR_CREATE",
    "DOCTOR_EDIT",
    "APPOINTMENT_VIEW",
    "APPOINTMENT_CREATE",
    "APPOINTMENT_EDIT",
    "APPOINTMENT_CANCEL",
    "RECEPTION_VIEW",
    "OPD_VIEW",
    "OPD_CREATE",
    "OPD_EDIT",
    "PRESCRIPTION_VIEW",
    "PRESCRIPTION_CREATE",
    "PRESCRIPTION_PRINT",
    "BILLING_VIEW",
    "BILLING_CREATE",
    "BILLING_EDIT",
    "REPORT_VIEW",
    "REPORT_EXPORT",
    "CHECKIN_CREATE",
    "CHECKIN_EDIT_LIMITED",
    "QUEUE_VIEW",
    "VITALS_CREATE",
    "VITALS_EDIT",
    "PAYMENT_RECEIVE",
    "REFUND_CREATE",
  ],
  RECEPTIONIST: [
    "DASHBOARD_VIEW",
    "PATIENT_VIEW",
    "PATIENT_CREATE",
    "PATIENT_EDIT",
    "APPOINTMENT_VIEW",
    "APPOINTMENT_CREATE",
    "APPOINTMENT_EDIT",
    "APPOINTMENT_CANCEL",
    "CHECKIN_CREATE",
    "QUEUE_VIEW",
    "BILLING_VIEW",
    "BILLING_CREATE",
  ],
  DOCTOR: [
    "DASHBOARD_VIEW",
    "PATIENT_VIEW",
    "DOCTOR_VIEW_OWN",
    "APPOINTMENT_VIEW",
    "OPD_VIEW",
    "OPD_CREATE",
    "OPD_EDIT",
    "PRESCRIPTION_VIEW",
    "PRESCRIPTION_CREATE",
    "PRESCRIPTION_PRINT",
  ],
  NURSE: [
    "DASHBOARD_VIEW",
    "PATIENT_VIEW",
    "QUEUE_VIEW",
    "CHECKIN_EDIT_LIMITED",
    "VITALS_CREATE",
    "VITALS_EDIT",
    "OPD_VIEW",
  ],
  ACCOUNTANT: [
    "DASHBOARD_VIEW",
    "PATIENT_VIEW_MINIMAL",
    "BILLING_VIEW",
    "BILLING_CREATE",
    "BILLING_EDIT",
    "PAYMENT_RECEIVE",
    "REFUND_CREATE",
    "REPORT_VIEW",
    "REPORT_EXPORT",
  ],
  PATIENT: [
    "PROFILE_VIEW",
    "PROFILE_EDIT",
    "MY_APPOINTMENTS_VIEW",
    "MY_PRESCRIPTIONS_VIEW",
    "MY_BILLS_VIEW",
  ],
};

/**
 * Hook to verify current user's permissions and role
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const can = (permission: AppPermission): boolean => {
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

    // 1. If explicit permissions are configured on the user object, check them
    if (user.permissions && user.permissions.length > 0) {
      return user.permissions.includes(permission);
    }

    // 2. Fallback: Lookup permissions by mapped uppercase role
    const permissions = ROLE_PERMISSIONS[roleKey];
    if (permissions) {
      return permissions.includes(permission as AppPermission);
    }

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
