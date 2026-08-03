export const ROUTES = {
  ROOT: "/",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",

  DASHBOARD: "/dashboard",

  PATIENTS: "/patients",
  PATIENT_REGISTER: "/patients/register",
  PATIENT_PROFILE: "/patients/profile",
  FAMILY_MEMBERS: "/patients/family",

  APPOINTMENTS: "/appointments",
  BOOK_APPOINTMENT: "/appointments/book",
  APPOINTMENT_DETAILS: "/appointments/:id",

  QUEUE: "/queue",

  VITALS: "/vitals",

  CONSULTATION: "/consultation",

  PRESCRIPTIONS: "/prescriptions",

  BILLING: "/billing",

  DOCTORS: "/doctors",
  DOCTOR_SCHEDULE: "/doctors/schedule",

  REPORTS: "/reports",

  SETTINGS: "/settings",

  PROFILE: "/profile",

  USER_MANAGEMENT: "/users",
  AUDIT_LOGS: "/audit-logs",
  NOTIFICATIONS: "/notifications",

  NOT_FOUND: "*",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];
