export type RxStatus = "Draft" | "Issued" | "Completed" | "Cancelled" | "Archived";

export interface EditableMedicine {
  id: string;
  name: string;
  strength: string;
  route: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
}

export interface PrescriptionRecord {
  id: string;
  patientName: string;
  mrn: string;
  consultationId: string;
  department: string;
  consultationDate: string;
  medicineCount: number;
  followup: boolean;
  followupDate?: string;
  status: RxStatus;
  doctorName: string;
  diagnosis: string;
  medicinesList: Array<{ name: string; dose: string; freq: string }>;
}

export interface PatientPrescriptionItem {
  id: string;
  consultationId: string;
  consultationDate: string;
  doctorName: string;
  department: string;
  diagnosisSummary: string;
  medicines: Array<{
    name: string;
    strength?: string;
    route?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  followupDate: string;
  status: "Issued" | "Completed" | "Archived";
  downloadCount?: number;
}

export interface UnifiedPrescription {
  id: string;
  patientName: string;
  mrn: string;
  consultationId: string;
  department: string;
  consultationDate: string;
  medicineCount: number;
  followup: boolean;
  followupDate?: string;
  status: RxStatus;
  doctorName: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    strength?: string;
    route?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
}
