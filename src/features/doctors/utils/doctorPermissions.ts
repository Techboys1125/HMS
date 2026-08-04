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
  PATIENT: {
    list: true,
    viewProfile: true,
    editProfile: false,
    deactivate: false,
    editSchedule: false,
    viewSchedule: false,
    manageExceptions: false,
    viewDailyAvailability: true,
    viewMonthlyCalendar: true,
    viewAppointments: false,
    viewAssignedPatients: false,
  },
};

export function normalizeRole(roleInput: string | Role): Role {
  const r = String(roleInput || "").toUpperCase();
  if (r === "ADMIN" || r === "HOSPITAL_ADMIN" || r === "SUPER_ADMIN" || r === "SUPER-ADMIN") {
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

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Hospital Admin",
  RECEPTIONIST: "Receptionist",
  DOCTOR: "Doctor",
  NURSE: "Nurse",
  PATIENT: "Patient",
};

export const DOCTOR_ACTION_LABELS: Record<DoctorAction, string> = {
  list: "View Doctor List",
  viewProfile: "View Doctor Profile",
  editProfile: "Edit Doctor Profile",
  deactivate: "Activate/Deactivate Doctor",
  editSchedule: "Edit Weekly Schedule",
  viewSchedule: "View Weekly Schedule",
  manageExceptions: "Manage Schedule Exceptions",
  viewDailyAvailability: "View Daily Availability",
  viewMonthlyCalendar: "View Monthly Calendar",
  viewAppointments: "View Appointments",
  viewAssignedPatients: "View Assigned Patients",
};