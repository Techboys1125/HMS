/**
 * Centralized Status Utility
 * Single source of truth for appointment/consultation status checks.
 *
 * Uses backend enum values as-is. Do NOT invent new status names.
 */

// ── Appointment Status Constants ──────────────────────────────────────────────
export const APPOINTMENT_STATUS = {
  BOOKED: "BOOKED",
  CONFIRMED: "CONFIRMED",
  SCHEDULED: "SCHEDULED",
  CHECKED_IN: "CHECKED_IN",
  WAITING_FOR_VITALS: "WAITING_FOR_VITALS",
  WAITING_FOR_DOCTOR: "WAITING_FOR_DOCTOR",
  WAITING_FOR_DOCTOR_CALL: "WAITING_FOR_DOCTOR_CALL",
  CALLED: "CALLED",
  IN_CONSULTATION: "IN_CONSULTATION",
  CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED",
  READY_FOR_BILLING: "READY_FOR_BILLING",
  BILLING_PENDING: "BILLING_PENDING",
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
  RESCHEDULED: "RESCHEDULED",
} as const;

export type AppointmentStatusValue =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

// ── Normalization ─────────────────────────────────────────────────────────────
/** Normalize any status string to UPPER_SNAKE_CASE for comparison */
export const normalizeStatus = (status?: string | null): string =>
  String(status || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

// ── Doctor Consultation Eligibility ───────────────────────────────────────────
/** Patients eligible for doctor consultation (active queue) */
export const DOCTOR_CONSULTATION_ACTIVE_STATUSES: readonly string[] = [
  APPOINTMENT_STATUS.WAITING_FOR_DOCTOR,
  APPOINTMENT_STATUS.WAITING_FOR_DOCTOR_CALL,
  APPOINTMENT_STATUS.CALLED,
  APPOINTMENT_STATUS.IN_CONSULTATION,
  "IN_PROGRESS",
] as const;

/** Patients eligible for doctor consultation (includes completed for history) */
export const DOCTOR_CONSULTATION_LIST_STATUSES: readonly string[] = [
  ...DOCTOR_CONSULTATION_ACTIVE_STATUSES,
  APPOINTMENT_STATUS.COMPLETED,
  APPOINTMENT_STATUS.CONSULTATION_COMPLETED,
  APPOINTMENT_STATUS.READY_FOR_BILLING,
  APPOINTMENT_STATUS.BILLING_PENDING,
  APPOINTMENT_STATUS.PAYMENT_COMPLETED,
  "FINALIZED",
  "FINISHED",
  "CLOSED",
  "CHECKED_OUT",
  "DONE",
] as const;

export const isDoctorConsultationStatus = (status?: string): boolean => {
  const normalized = normalizeStatus(status);
  return (DOCTOR_CONSULTATION_LIST_STATUSES as readonly string[]).includes(
    normalized,
  );
};
