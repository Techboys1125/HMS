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

// ── Nurse Eligibility ─────────────────────────────────────────────────────────
/** Patients the nurse should see in the vitals queue */
export const NURSE_WAITING_STATUSES: readonly string[] = [
  APPOINTMENT_STATUS.WAITING_FOR_VITALS,
  APPOINTMENT_STATUS.CHECKED_IN,
] as const;

export const isNurseEligibleStatus = (status?: string): boolean =>
  NURSE_WAITING_STATUSES.includes(normalizeStatus(status));

// ── Doctor Consultation Eligibility ───────────────────────────────────────────
/** Patients eligible for doctor consultation (active queue) */
export const DOCTOR_CONSULTATION_ACTIVE_STATUSES: readonly string[] = [
  APPOINTMENT_STATUS.WAITING_FOR_DOCTOR,
  APPOINTMENT_STATUS.WAITING_FOR_DOCTOR_CALL,
  "WAITING",
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

/** Waiting tab statuses for doctor consultation */
export const DOCTOR_WAITING_STATUSES: readonly string[] = [
  APPOINTMENT_STATUS.WAITING_FOR_DOCTOR,
  APPOINTMENT_STATUS.WAITING_FOR_DOCTOR_CALL,
  "WAITING",
] as const;

export const isDoctorConsultationStatus = (status?: string): boolean => {
  const normalized = normalizeStatus(status);
  return (DOCTOR_CONSULTATION_LIST_STATUSES as readonly string[]).includes(
    normalized,
  );
};

export const isDoctorActiveStatus = (status?: string): boolean => {
  const normalized = normalizeStatus(status);
  return (
    DOCTOR_CONSULTATION_ACTIVE_STATUSES as readonly string[]
  ).includes(normalized);
};

export const isDoctorWaitingStatus = (status?: string): boolean => {
  const normalized = normalizeStatus(status);
  return (DOCTOR_WAITING_STATUSES as readonly string[]).includes(normalized);
};

// ── Encounter Status ──────────────────────────────────────────────────────────
export const ENCOUNTER_STATUS = {
  CREATED: "CREATED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FINALIZED: "FINALIZED",
} as const;

export const isEncounterEditable = (status?: string): boolean => {
  const normalized = normalizeStatus(status);
  return (
    normalized === ENCOUNTER_STATUS.CREATED ||
    normalized === ENCOUNTER_STATUS.IN_PROGRESS
  );
};

// ── Billing Status ────────────────────────────────────────────────────────────
export const BILLING_READY_STATUSES: readonly string[] = [
  APPOINTMENT_STATUS.READY_FOR_BILLING,
  APPOINTMENT_STATUS.COMPLETED,
  APPOINTMENT_STATUS.CONSULTATION_COMPLETED,
] as const;

export const isBillingReadyStatus = (status?: string): boolean => {
  const normalized = normalizeStatus(status);
  return (BILLING_READY_STATUSES as readonly string[]).includes(normalized);
};

// ── Display Labels ────────────────────────────────────────────────────────────
export const STATUS_DISPLAY_LABELS: Record<string, string> = {
  BOOKED: "Booked",
  CONFIRMED: "Confirmed",
  SCHEDULED: "Scheduled",
  CHECKED_IN: "Checked-In",
  WAITING_FOR_VITALS: "Waiting for Vitals",
  WAITING_FOR_DOCTOR: "Waiting for Doctor",
  WAITING_FOR_DOCTOR_CALL: "Waiting for Doctor",
  CALLED: "Called",
  IN_CONSULTATION: "In Consultation",
  CONSULTATION_COMPLETED: "Consultation Completed",
  COMPLETED: "Completed",
  BILLING_PENDING: "Billing Pending",
  PAYMENT_COMPLETED: "Payment Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
  RESCHEDULED: "Rescheduled",
};

export const getDisplayLabel = (status?: string): string => {
  const normalized = normalizeStatus(status);
  return STATUS_DISPLAY_LABELS[normalized] || status || "Unknown";
};

// ── Backend Error Mapping ─────────────────────────────────────────────────────
export const BACKEND_ERROR_MESSAGES: Record<string, string> = {
  APPOINTMENT_NOT_CHECKED_IN:
    "Patient has not been checked in. Please check in the patient first.",
  ENCOUNTER_NOT_EDITABLE:
    "This encounter is already finalized and cannot be edited.",
  PRESCRIPTION_RESOLUTION_REQUIRED:
    "Please complete prescription resolution before finalizing.",
  VR_CON_003:
    "At least one diagnosis or clinical conclusion is required.",
  VR_CON_001:
    "Encounter vitals are required before consultation.",
  ENCOUNTER_NOT_FOUND:
    "Encounter not found. Please try again.",
  APPOINTMENT_NOT_FOUND:
    "Appointment not found. Please refresh and try again.",
  CONSULTATION_ALREADY_STARTED:
    "Consultation is already in progress for this patient.",
  PATIENT_NOT_IN_QUEUE:
    "Patient is not currently in the queue.",
};

export const mapBackendError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message;
    // Check if the message contains a known backend error code
    for (const [code, userMessage] of Object.entries(BACKEND_ERROR_MESSAGES)) {
      if (message.includes(code)) {
        return userMessage;
      }
    }
    return message;
  }
  return "An unexpected error occurred. Please try again.";
};
