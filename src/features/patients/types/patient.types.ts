export type PatientStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DECEASED"
  | "DUPLICATE_CANDIDATE";

export type AgeBasis = "EXACT" | "APPROXIMATE";

export interface EmergencyContact {
  name: string;
  relationship: string;
  mobile: string;
}

export interface Patient {
  id: number;
  name: string;
  patientId: string;
  mrn: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  assignedDoctor: string;
  registrationDate: string;
}

export interface PatientStatistics {
  totalPatients: number;
  activePatients: number;
  inactivePatients: number;
  duplicateCandidates: number;
  deceasedPatients: number;
  newRegistrationsToday: number;
}

export interface DuplicateCheckRequest {
  fullName: string;
  dob: string | null;
  mobile: string;
  email?: string;
  gender: string;
}

export interface DuplicateOverrideRequest {
  reason: string;
}

export interface MergePatientsRequest {
  sourceMrn: string;
  targetMrn: string;
  reason: string;
}

export interface CreatePatientRequest {
  relationship: string;
  fullName: string;
  gender: string; // MALE, FEMALE, OTHER
  dateOfBirth: string | null;
  bloodGroup: string;
  phone: string;
  email: string;
  address: {
    value: string;
  };
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  reason?: string;
}

export interface PatientSearchResult extends Patient {
  fullName: string;
}

export interface PatientFormInput extends CreatePatientRequest {}
