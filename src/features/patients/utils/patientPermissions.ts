export type Role = "ADMIN" | "RECEPTIONIST" | "DOCTOR" | "NURSE" | "PATIENT" | "ACCOUNTANT";

export type PatientAction =
  | "list"
  | "register"
  | "editProfile"
  | "viewProfile"
  | "manageFamilyMembers"
  | "viewAppointments"
  | "manageAppointments"
  | "viewQueue"
  | "checkIn"
  | "generateToken"
  | "recordVitals"
  | "viewPrescriptions"
  | "editPrescriptions"
  | "viewBilling"
  | "manageBilling";

const PERMISSION_MATRIX: Record<Role, Record<PatientAction, boolean>> = {
  ADMIN: {
    list: true,
    register: true,
    editProfile: true,
    viewProfile: true,
    manageFamilyMembers: true,
    viewAppointments: true,
    manageAppointments: true,
    viewQueue: true,
    checkIn: true,
    generateToken: true,
    recordVitals: true,
    viewPrescriptions: true,
    editPrescriptions: true,
    viewBilling: true,
    manageBilling: true,
  },
  RECEPTIONIST: {
    list: true,
    register: true,
    editProfile: true,
    viewProfile: true,
    manageFamilyMembers: true,
    viewAppointments: true,
    manageAppointments: true,
    viewQueue: true,
    checkIn: true,
    generateToken: true,
    recordVitals: false,
    viewPrescriptions: false,
    editPrescriptions: false,
    viewBilling: false,
    manageBilling: false,
  },
  DOCTOR: {
    list: false,
    register: false,
    editProfile: false,
    viewProfile: true,
    manageFamilyMembers: false,
    viewAppointments: true,
    manageAppointments: false,
    viewQueue: true,
    checkIn: false,
    generateToken: false,
    recordVitals: false,
    viewPrescriptions: true,
    editPrescriptions: true,
    viewBilling: false,
    manageBilling: false,
  },
  NURSE: {
    list: false,
    register: false,
    editProfile: false,
    viewProfile: true,
    manageFamilyMembers: false,
    viewAppointments: false,
    manageAppointments: false,
    viewQueue: true,
    checkIn: false,
    generateToken: false,
    recordVitals: true,
    viewPrescriptions: false,
    editPrescriptions: false,
    viewBilling: false,
    manageBilling: false,
  },
  PATIENT: {
    list: false,
    register: true,
    editProfile: true,
    viewProfile: true,
    manageFamilyMembers: true,
    viewAppointments: true,
    manageAppointments: true,
    viewQueue: true,
    checkIn: false,
    generateToken: false,
    recordVitals: false,
    viewPrescriptions: true,
    editPrescriptions: false,
    viewBilling: true,
    manageBilling: false,
  },
  ACCOUNTANT: {
    list: true,
    register: false,
    editProfile: false,
    viewProfile: true,
    manageFamilyMembers: false,
    viewAppointments: false,
    manageAppointments: false,
    viewQueue: false,
    checkIn: false,
    generateToken: false,
    recordVitals: false,
    viewPrescriptions: false,
    editPrescriptions: false,
    viewBilling: true,
    manageBilling: true,
  },
};

export function can(
  role: Role,
  action: PatientAction,
  isOwnRecord: boolean = false,
): boolean {
  const rolePermissions = PERMISSION_MATRIX[role];
  if (!rolePermissions) return false;

  const permission = rolePermissions[action];
  if (permission === undefined) return false;
  if (!permission) return false;

  if (isOwnRecord) {
    if (action === "editProfile" && role === "PATIENT") return true;
    if (action === "manageFamilyMembers" && role === "PATIENT") return true;
    if (action === "manageAppointments" && role === "PATIENT") return true;
    if (action === "viewQueue" && role === "PATIENT") return true;
    if (action === "viewPrescriptions" && role === "PATIENT") return true;
    if (action === "viewBilling" && role === "PATIENT") return true;
  }

  if (action === "editProfile" && role === "PATIENT" && !isOwnRecord) return false;
  if (action === "manageFamilyMembers" && role === "PATIENT" && !isOwnRecord) return false;
  if (action === "manageAppointments" && role === "PATIENT" && !isOwnRecord) return false;

  return permission;
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Hospital Admin",
  RECEPTIONIST: "Receptionist",
  DOCTOR: "Doctor",
  NURSE: "Nurse",
  PATIENT: "Patient",
  ACCOUNTANT: "Accountant",
};