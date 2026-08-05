import type {
  DoctorRecord,
  DoctorAppointment,
  DoctorPatient,
  WeeklySchedule,
  DoctorTimeline,
  PrescriptionRecord,
  VitalSign,
  Medication,
} from "../types/doctors.types";

export const PP = "Poppins, sans-serif";
export const RB = "Roboto, sans-serif";

export const FREQUENCY_OPTIONS = [
  "Once Daily",
  "Twice Daily",
  "Three Times Daily",
  "Every 6 Hours",
  "Every 8 Hours",
  "SOS",
  "Custom",
];

export const ROUTE_OPTIONS = [
  "Oral",
  "Injection",
  "IV",
  "Topical",
  "Eye Drops",
  "Ear Drops",
  "Nasal",
  "Inhalation",
];

export const COMMON_MEDICINES = [
  "Amlodipine",
  "Metformin",
  "Atorvastatin",
  "Aspirin",
  "Ramipril",
  "Hydrochlorothiazide",
  "Rosuvastatin",
  "Pantoprazole",
  "Clopidogrel",
  "Losartan",
  "Omeprazole",
  "Amoxicillin",
  "Paracetamol",
  "Ibuprofen",
];

export const INITIAL_DOCTORS: DoctorRecord[] = [];
export const MOCK_DOCTOR_APPOINTMENTS: DoctorAppointment[] = [];
export const MOCK_DOCTOR_PATIENTS: DoctorPatient[] = [];
export const MOCK_WEEKLY_SCHEDULE: WeeklySchedule[] = [];
export const MOCK_DOCTOR_TIMELINE: DoctorTimeline[] = [];
export const DEPARTMENTS: string[] = [];
export const SPECIALTIES: string[] = [];
export interface WeeklyConsultation {
  day: string;
  count: number;
}

export const VITALS_DATA: VitalSign[] = [];
export const MEDICATIONS: Medication[] = [];
export const WEEKLY_CONSULTATIONS: WeeklyConsultation[] = [];
export const TIMELINE: DoctorTimeline[] = [];
export const MY_PRESCRIPTIONS_DATA: PrescriptionRecord[] = [];
