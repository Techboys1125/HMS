/**
 * Medical Record types for Patient Profile → Medical Records Tab
 * Uses real backend API response shapes:
 *   - GET /api/v1/patients/{mrn}/prescriptions
 *   - GET /api/v1/billing/patient/{mrn}
 */

/** Maps to PatientPrescriptionSummaryResponse from backend */
export interface PrescriptionSummary {
  prescriptionId: string;
  appointmentId?: string;
  encounterId?: string;
  visitDateTime?: string;
  doctor?: {
    doctorId?: string;
    doctorName?: string;
    doctorSpecialization?: string;
  };
  department?: {
    departmentId?: string;
    departmentName?: string;
  };
  diagnosis?: {
    primaryDiagnosis?: string;
    icd10Code?: string;
  };
  medications?: {
    totalMedicines?: number;
    highRiskMedicine?: boolean;
    sampleMedicines?: string[];
    containsControlledMedicine?: boolean;
  };
  prescriptionStatus?: string;
  followUp?: {
    required?: boolean;
    followUpDate?: string;
  };
  billing?: {
    invoiceNumber?: string;
    billingStatus?: string;
  };
  documents?: {
    prescriptionDocumentId?: string;
    pdfAvailable?: boolean;
    digitalSignature?: boolean;
    downloadable?: boolean;
  };
  createdAt?: string;
}

/** Maps to billing history response from backend */
export interface BillingSummaryRecord {
  billId: number | string;
  billNumber?: string;
  date?: string;
  doctor?: string;
  billStatus?: string;
  paymentStatus?: string;
  amount?: number;
}

/** Billing history wrapper */
export interface PatientBillingHistory {
  mrn?: string;
  patientName?: string;
  summary?: {
    totalBills?: number;
    totalPaid?: number;
    totalOutstanding?: number;
  };
  bills: BillingSummaryRecord[];
}

export interface MedicalHistoryEntry {
  id: string | number;
  type:
    | "prescription"
    | "billing"
    | "consultation"
    | "vitals"
    | "diagnosis"
    | "lab_result";
  date: string;
  title: string;
  description: string;
  doctorName?: string;
  department?: string;
  status?: string;
}

export interface PatientMedicalSummary {
  prescriptions: PrescriptionSummary[];
  billing: PatientBillingHistory;
  timeline: MedicalHistoryEntry[];
  totalVisits: number;
  lastVisitDate?: string;
}

// Keep legacy types for backward compatibility (unused but prevents import errors)
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

export interface PatientReport {
  id: string;
  type: "billing" | "visit" | "prescription";
  title: string;
  generatedAt: string;
  period?: { from: string; to: string };
  summary: Record<string, string | number>;
  status: "Generated" | "Pending" | "Error";
}
