export type ConsultationStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "SCHEDULED"
  | "WAITING"
  | "WAITING_FOR_VITALS"
  | "WAITING_FOR_DOCTOR"
  | "WAITING_FOR_DOCTOR_CALL"
  | "CALLED"
  | "IN_CONSULTATION"
  | "CONSULTATION_COMPLETED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "FOLLOW_UP_SCHEDULED";

import {
  isDoctorConsultationStatus as _isDoctorConsultationStatus,
  isDoctorActiveStatus as _isDoctorActiveStatus,
  isDoctorWaitingStatus as _isDoctorWaitingStatus,
  DOCTOR_CONSULTATION_LIST_STATUSES,
} from "../../../lib/status-utils";

/**
 * Only appointments that have completed the vitals stage may be handled in
 * the doctor consultation queue. Completed appointments remain available for
 * the consultation history/list, but are never part of the active queue.
 */
export const DOCTOR_CONSULTATION_WAITING_STATUSES = [
  "WAITING_FOR_DOCTOR",
  "WAITING_FOR_DOCTOR_CALL",
] as const satisfies readonly ConsultationStatus[];

export function isDoctorConsultationStatus(
  status: unknown,
): status is (typeof DOCTOR_CONSULTATION_LIST_STATUSES)[number] {
  return _isDoctorConsultationStatus(status as string);
}

export function isDoctorActiveStatus(
  status: unknown,
): boolean {
  return _isDoctorActiveStatus(status as string);
}

export function isDoctorWaitingStatus(
  status: unknown,
): boolean {
  return _isDoctorWaitingStatus(status as string);
}

export const appointmentStatusMap: Record<ConsultationStatus, string> = {
  BOOKED: "Booked",
  CONFIRMED: "Confirmed",
  SCHEDULED: "Scheduled",
  WAITING: "Waiting for Doctor",
  WAITING_FOR_VITALS: "Waiting for Vitals",
  WAITING_FOR_DOCTOR: "Waiting for Doctor",
  WAITING_FOR_DOCTOR_CALL: "Waiting for Doctor",
  CALLED: "Called",
  IN_CONSULTATION: "In Consultation",
  CONSULTATION_COMPLETED: "Consultation Completed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
  FOLLOW_UP_SCHEDULED: "Follow-up Scheduled",
};

export type VisitType =
  "First Visit" | "Follow-up" | "Walk-In" | "New Consultation";

export type OauthRole = "doctor" | "admin";

export type AdminStatus = "All" | ConsultationStatus;

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ConsultationRecord {
  durationOfSymptoms?: string;
  doctorName?: string;
  completionTime?: string;
  allergies?: string[];
  bloodGroup?: string;
  doctorSpecialty?: string;
  doctorExperience?: string;
  id: string;
  appointmentId?: string | number;
  encounterId?: string | number;
  tokenNo: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  doctor: string;
  department: string;
  appointmentTime: string;
  visitType: VisitType;
  status: ConsultationStatus;
  chiefComplaint: string;
  opdRoom: string;
  date: string;
  duration?: string;
  visitDate?: string;
  vitals?: {
    height?: string;
    weight?: string;
    bmi?: string;
    bp: string;
    pulse: string;
    temp: string;
    temperature?: string;
    spo2: string;
    respiratoryRate?: string;
    bloodSugar?: string;
  };
  clinicalExamination?: string;
  provisionalDiagnosis?: string;
  finalDiagnosis?: string;
  icdCode?: string;
  medicines?: MedicineItem[];
  investigations?: string[];
  investigationRemarks?: string;
  symptoms?: string;
  assessment?: string;
  advice?: string;
  lifestyleRecommendations?: string;
  followupRequired?: string | boolean;
  nextVisitDate?: string;
  followupNotes?: string;
  consultationFee?: string;
  billingStatus?: string;
  createdDate?: string;
  completedDate?: string;
}

export interface AdminConsultationRecord {
  id: string;
  tokenNo: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  doctor: string;
  department: string;
  appointmentTime: string;
  visitType: VisitType;
  status: ConsultationStatus;
  duration: string;
  chiefComplaint: string;
  opdRoom: string;
  date: string;
}

export interface DoctorWorkload {
  name: string;
  dept: string;
  assigned: number;
  completed: number;
  waiting: number;
  inProgress: number;
  status: string;
  opdRoom: string;
}

export interface DepartmentSummary {
  dept: string;
  total: number;
  completed: number;
  waiting: number;
  inProgress: number;
}

export interface ConsultationFormData {
  visitDate: string;
  doctorName: string;
  department: string;
  visitType: "New Consultation" | "Follow-up";
  chiefComplaint: string;
  durationOfSymptoms: string;
  height: string;
  weight: string;
  temperature: string;
  bp: string;
  pulse: string;
  respiratoryRate: string;
  spo2: string;
  bloodSugar: string;
  clinicalExamination: string;
  provisionalDiagnosis: string;
  finalDiagnosis: string;
  icdCode: string;
  medicines: MedicineItem[];
  investigations: {
    cbc: boolean;
    ecg: boolean;
    xray: boolean;
    ultrasound: boolean;
    other: boolean;
  };
  customInvestigation: string;
  investigationRemarks: string;
  symptoms: string;
  assessment: string;
  advice: string;
  lifestyleRecommendations: string;
  followupRequired: boolean;
  nextVisitDate: string;
  followupNotes: string;
}

export interface TimelineConsultationItem {
  id: string;
  date: string;
  time: string;
  doctor: string;
  department: string;
  visitType: string;
  status: string;
  chiefComplaint: string;
  diagnosis: string;
  icdCode: string;
  medicinesCount: number;
  investigationsCount: number;
  followupStatus: string;
  nextFollowupDate?: string;
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
    bmi: string;
  };
  medicines: Array<{
    name: string;
    dosage: string;
    freq: string;
    duration: string;
  }>;
  investigations: string[];
  examinationFindings: string;
  clinicalNotes: string;
}
