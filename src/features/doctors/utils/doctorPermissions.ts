export type Role = "ADMIN" | "RECEPTIONIST" | "DOCTOR" | "NURSE" | "PATIENT";

export type DoctorAction =
  | "list"
  | "viewProfile"
  | "editProfile"
  | "deactivate"
  | "editSchedule"
  | "viewSchedule"
  | "manageExceptions"
  | "viewDailyAvailability"
  | "viewMonthlyCalendar"
  | "viewAppointments"
  | "viewAssignedPatients";

const PERMISSION_MATRIX: Record<Role, Record<DoctorAction, boolean>> = {
  ADMIN: {
    list: true,
    viewProfile: true,
    editProfile: true,
    deactivate: true,
    editSchedule: true,
    viewSchedule: true,
    manageExceptions: true,
    viewDailyAvailability: true,
    viewMonthlyCalendar: true,
    viewAppointments: true,
    viewAssignedPatients: true,
  },
  RECEPTIONIST: {
    list: true,
    viewProfile: true,
    editProfile: false,
    deactivate: false,
    editSchedule: false,
    viewSchedule: true,
    manageExceptions: false,
    viewDailyAvailability: true,
    viewMonthlyCalendar: true,
    viewAppointments: true,
    viewAssignedPatients: true,
  },
  DOCTOR: {
    list: false,
    viewProfile: true,
    editProfile: true,
    deactivate: false,
    editSchedule: true,
    viewSchedule: true,
    manageExceptions: true,
    viewDailyAvailability: true,
    viewMonthlyCalendar: true,
    viewAppointments: true,
    viewAssignedPatients: true,
  },
  NURSE: {
    list: false,
    viewProfile: false,
    editProfile: false,
    deactivate: false,
    editSchedule: false,
    viewSchedule: false,
    manageExceptions: false,
    viewDailyAvailability: false,
    viewMonthlyCalendar: false,
    viewAppointments: false,
    viewAssignedPatients: false,
  },
  PATIENT: {
    list: false,
    viewProfile: false,
    editProfile: false,
    deactivate: false,
    editSchedule: false,
    viewSchedule: false,
    manageExceptions: false,
    viewDailyAvailability: false,
    viewMonthlyCalendar: false,
    viewAppointments: false,
    viewAssignedPatients: false,
  },
};

export function normalizeRole(roleInput: string | Role): Role {
  const r = String(roleInput || "").toUpperCase();
  if (
    r === "ADMIN" ||
    r === "HOSPITAL_ADMIN" ||
    r === "SUPER_ADMIN" ||
    r === "SUPER-ADMIN"
  ) {
    return "ADMIN";
  }
  if (r === "RECEPTIONIST") return "RECEPTIONIST";
  if (r === "DOCTOR") return "DOCTOR";
  if (r === "NURSE") return "NURSE";
  if (r === "PATIENT") return "PATIENT";
  return "ADMIN";
}

export function can(
  roleInput: Role | string,
  action: DoctorAction,
  isOwnRecord: boolean = false,
): boolean {
  const role = normalizeRole(roleInput);
  const rolePermissions = PERMISSION_MATRIX[role];
  if (!rolePermissions) return false;

  const permission = rolePermissions[action];
  if (permission === undefined || permission === false) return false;

  if (role === "DOCTOR") {
    if (action === "deactivate") return false;
    if (action === "list") return false;
    if (
      (action === "editProfile" ||
        action === "manageExceptions" ||
        action === "editSchedule" ||
        action === "viewAppointments" ||
        action === "viewAssignedPatients") &&
      !isOwnRecord
    ) {
      return false;
    }
  }

  return permission;
}
