export const PP = "Poppins, system-ui, sans-serif";
export const RB = "Roboto, system-ui, sans-serif";

export const REPORT_IDS = {
  DAILY_APPOINTMENTS: "REP-001",
  DAILY_REVENUE: "REP-002",
  PATIENT_REGISTRATIONS: "REP-003",
  DOCTOR_PERFORMANCE: "REP-004",
  BILLING_REPORT: "REP-005",
  DASHBOARD_KPI: "REP-006",
} as const;

export const REPORT_ROUTES = {
  [REPORT_IDS.DAILY_APPOINTMENTS]: "daily-appointments",
  [REPORT_IDS.DAILY_REVENUE]: "daily-revenue",
  [REPORT_IDS.PATIENT_REGISTRATIONS]: "patient-registrations",
  [REPORT_IDS.DOCTOR_PERFORMANCE]: "doctor-performance",
  [REPORT_IDS.BILLING_REPORT]: "billing-report",
  [REPORT_IDS.DASHBOARD_KPI]: "collection-rate",
} as const;

export const ROLES = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  RECEPTIONIST: "RECEPTIONIST",
  ACCOUNTANT: "ACCOUNTANT",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
