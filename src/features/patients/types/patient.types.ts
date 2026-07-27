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
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string | null;
  ageBasis: AgeBasis;
  approximateAge?: number;
  gender: "Male" | "Female" | "Other";
  mobile: string;
  email?: string;
  address: string;
  status: PatientStatus;
  emergencyContact: EmergencyContact;
  language?: string;
  communicationPreference?: string;
  consentIndicators?: Record<string, boolean>;
  version: number;
  createdAt: string;
  updatedAt: string;
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
  firstName: string;
  lastName: string;
  dob: string | null;
  mobile: string;
  email?: string;
  gender: "Male" | "Female" | "Other";
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
  firstName: string;
  lastName: string;
  dob: string | null;
  ageBasis: AgeBasis;
  approximateAge?: number;
  gender: "Male" | "Female" | "Other";
  mobile: string;
  email?: string;
  address: string;
  emergencyContact: EmergencyContact;
  language?: string;
  communicationPreference?: string;
  consentIndicators?: Record<string, boolean>;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  reason?: string;
}

export interface PatientSearchResult extends Patient {
  fullName: string;
}

export interface PatientFormInput extends CreatePatientRequest {}
