export type ConsultationStatus =
  | "Waiting"
  | "Called"
  | "In Progress"
  | "Completed"
  | "Follow-up Scheduled"
  | "Cancelled";
export type VisitType =
  "First Visit" | "Follow-up" | "Walk-In" | "New Consultation";

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ConsultationRecord {
  id: string;
  appointmentId?: string | number;
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
  vitals?: {
    height?: string;
    weight?: string;
    bmi?: string;
    bp: string;
    pulse: string;
    temp: string;
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
  duration?: string;
}

export interface ConsultationFormData {
  visitDate: string;
  doctorName: string;
  department: string;
  visitType: "New Consultation" | "Follow-up";
  chiefComplaint: string;
  durationOfSymptoms: string;
  // Vitals
  height: string;
  weight: string;
  temperature: string;
  bp: string;
  pulse: string;
  respiratoryRate: string;
  spo2: string;
  bloodSugar: string;
  // Examination
  clinicalExamination: string;
  provisionalDiagnosis: string;
  finalDiagnosis: string;
  icdCode: string;
  // Prescription
  medicines: MedicineItem[];
  // Investigation Recommendations
  investigations: {
    cbc: boolean;
    ecg: boolean;
    xray: boolean;
    ultrasound: boolean;
    other: boolean;
  };
  customInvestigation: string;
  investigationRemarks: string;
  // Clinical Notes
  symptoms: string;
  assessment: string;
  advice: string;
  lifestyleRecommendations: string;
  // Follow-up
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
