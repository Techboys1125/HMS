import type {
  PatientSummary,
  DoctorSummary,
  AppointmentRecord,
} from "../types/appointment.types";

export const PP = "Poppins, sans-serif";
export const RB = "Roboto, sans-serif";

export type ChipVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "teal"
  | "default";

export const PATIENT_DATABASE: PatientSummary[] = [];
export const DOCTOR_DATABASE: Record<string, DoctorSummary> = {};
export const DOCTOR_AVAILABILITY_DATA: Record<
  string,
  {
    specialty: string;
    department: string;
    opdRoom: string;
    slotDuration: string;
    slots: { time: string; available: boolean }[];
  }
> = {};
export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [];

export type AppointmentStatus =
  | "Scheduled"
  | "Checked-In"
  | "Waiting"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export const STATUS_CONFIG: Record<
  AppointmentStatus,
  { bg: string; text: string; dot: string; border: string }
> = {
  Scheduled: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
    border: "border-slate-200",
  },
  "Checked-In": {
    bg: "bg-blue-50",
    text: "text-[#0D47A1]",
    dot: "bg-[#0D47A1]",
    border: "border-blue-200",
  },
  Waiting: {
    bg: "bg-amber-50",
    text: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    border: "border-amber-200",
  },
  "In Progress": {
    bg: "bg-teal-50",
    text: "text-[#009688]",
    dot: "bg-[#009688]",
    border: "border-teal-200",
  },
  Completed: {
    bg: "bg-green-50",
    text: "text-[#66BB6A]",
    dot: "bg-[#66BB6A]",
    border: "border-green-200",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
    border: "border-red-200",
  },
};

export const EMPTY_AVAILABILITY = {
  specialty: "",
  department: "",
  opdRoom: "",
  slotDuration: "15 Minutes",
  slots: [] as { time: string; available: boolean }[],
};

import type { PatientSummary as PS } from "../types/appointment.types";
export const appointmentToPatientSummary = (apt: AppointmentRecord): PS => ({
  id: apt.patientId,
  mrn: apt.patientMrn || apt.mrn || "",
  name: apt.patientName,
  age: apt.patientAge || 0,
  gender: (apt.patientGender as PS["gender"]) || "Other",
  bloodGroup: "",
  phone: apt.patientPhone || "",
  emergencyContact: "",
  assignedDoctor: apt.doctorName,
});
