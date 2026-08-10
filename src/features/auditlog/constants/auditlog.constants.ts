export const AUDIT_LOG_ROUTES = {
  LIST: "/audit-logs",
  DETAILS: "/audit-logs/:id",
} as const;

export const AUDIT_CATEGORIES = [
  "All Logs",
  "Login History",
  "User Activities",
  "Data Changes",
  "Deleted Records",
  "System Logs",
] as const;

export const AUDIT_SEVERITIES = [
  "Information",
  "Success",
  "Warning",
  "Critical",
] as const;

export const AUDIT_STATUSES = [
  "Success",
  "Failed",
  "Warning",
  "Blocked",
] as const;

export const AUDIT_MODULES = [
  "Patient Management",
  "Doctor Management",
  "Appointments",
  "Consultation",
  "Prescription",
  "Billing",
  "Reception",
  "Reports",
  "Settings",
  "Authentication",
] as const;

export const AUDIT_DEPARTMENTS = [
  "Administration",
  "Cardiology",
  "Pediatrics",
  "OPD Reception",
  "Accounts & Billing",
  "IT Systems",
] as const;

export const AUDIT_ROLES = [
  "Hospital Admin",
  "Doctor",
  "Receptionist",
  "Accountant",
  "Nurse",
  "System",
] as const;
