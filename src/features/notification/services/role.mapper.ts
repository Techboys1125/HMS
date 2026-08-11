import type { UserRole } from "../types/notifications.types";

const ROLE_MAP: Record<string, UserRole> = {
  HOSPITAL_ADMIN: "Hospital Admin",
  ADMIN: "Hospital Admin",
  SUPER_ADMIN: "Hospital Admin",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
  ACCOUNTANT: "Accountant",
  NURSE: "Nurse",
  PATIENT: "Patient Portal",
  "Patient Portal": "Patient Portal",
  "Hospital Admin": "Hospital Admin",
  Doctor: "Doctor",
  Receptionist: "Receptionist",
  Accountant: "Accountant",
  Nurse: "Nurse",
};

export function normalizeRole(role: string | undefined): UserRole {
  return ROLE_MAP[String(role ?? "").toUpperCase()] ?? "Hospital Admin";
}
