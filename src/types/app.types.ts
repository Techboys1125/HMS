import type React from "react";

export type NavId =
  | "dashboard"
  | "patients"
  | "doctors"
  | "appointments"
  | "checkin"
  | "consultation"
  | "vitals"
  | "prescriptions"
  | "billing"
  | "payments"
  | "payment-history"
  | "daily-billing-report"
  | "operational-reports"
  | "financial-reports"
  | "audit-logs"
  | "notifications"
  | "settings"
  | "profile"
  | "hospital-management"
  | "user-management"
  | "roles-permissions"
  | "medical-history"
  | "visit-history"
  | "patient-timeline"
  | "patient-search"
  | "bills-payments"
  | "reports"
  | "family-members"
  | "reception"
  | "opd"
  | "queue-status"
  | "my-schedule"
  | "my-queue"
  | "book-appointment";

export type Role =
  | "super-admin"
  | "admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "accountant"
  | "patient";

export type AppStatus =
  | "scheduled"
  | "checked-in"
  | "in-progress"
  | "waiting"
  | "completed"
  | "cancelled";

export type ReportView =
  | "dashboard"
  | "daily-appointments"
  | "daily-revenue"
  | "patient-report"
  | "doctor-report"
  | "billing-report"
  | "kpi-detail";

export type NavItem = {
  id: NavId;
  Icon: React.ElementType;
  label: string;
  badge?: number;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};
