/**
 * Medical Record types for Patient Profile → Medical Records Tab
 * Fetches from existing OPD/Vitals/Consultation endpoints
 * No duplicate modules — just display types
 */

export interface ConsultationRecord {
  id: string | number;
  consultationDate: string;
  doctorName: string;
  department: string;
  chiefComplaint?: string;
  diagnosis?: string;
  clinicalNotes?: string;
  followUpDate?: string;
  status: "Completed" | "In-Progress" | "Follow-up Required" | "Cancelled";
  prescriptionIssued?: boolean;
}

export interface VitalsRecord {
  id: string | number;
  recordedAt: string;
  recordedBy?: string;
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  spo2?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  respiratoryRate?: string;
  notes?: string;
}

export interface DiagnosisRecord {
  id: string | number;
  date: string;
  doctorName: string;
  diagnosisCode?: string;
  diagnosisName: string;
  severity?: "Mild" | "Moderate" | "Severe" | "Critical";
  notes?: string;
  status: "Active" | "Resolved" | "Chronic";
}

export interface MedicalHistoryEntry {
  id: string | number;
  type: "consultation" | "vitals" | "diagnosis" | "prescription" | "lab_result";
  date: string;
  title: string;
  description: string;
  doctorName?: string;
  department?: string;
  status?: string;
}

export interface PatientMedicalSummary {
  consultations: ConsultationRecord[];
  vitals: VitalsRecord[];
  diagnoses: DiagnosisRecord[];
  timeline: MedicalHistoryEntry[];
  totalVisits: number;
  lastVisitDate?: string;
}

export interface PatientReport {
  id: string;
  type: "billing" | "visit" | "prescription";
  title: string;
  generatedAt: string;
  period?: { from: string; to: string };
  summary: Record<string, string | number>;
  status: "Generated" | "Pending" | "Error";
}
