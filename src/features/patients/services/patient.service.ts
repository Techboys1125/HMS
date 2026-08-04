/**
 * Patient Service – Business logic layer
 * Orchestrates patient operations between API, auth, and state
 */
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import type { Patient, CreatePatientRequest } from "../types/patient.types";

export const patientService = {
  /**
   * Register a new patient and return the mapped record.
   * Called after auth registration or by Admin/Receptionist.
   */
  async registerPatient(payload: CreatePatientRequest): Promise<Patient> {
    const response = await patientsApi.create(payload);
    const raw = response.data || response;
    return mapApiPatientToPatientRecord(raw as Patient);
  },

  /**
   * Get patient by MRN with mapped fields
   */
  async getPatientProfile(mrn: string): Promise<Patient> {
    const raw = await patientsApi.getPatientByMrn(mrn);
    return mapApiPatientToPatientRecord(raw);
  },

  /**
   * Update patient profile with partial payload
   */
  async updatePatientProfile(
    mrn: string,
    payload: Record<string, unknown>,
  ): Promise<Patient> {
    const raw = await patientsApi.updatePatient(mrn, payload);
    return mapApiPatientToPatientRecord(raw);
  },

  /**
   * List all patients with mapped fields
   */
  async listPatients(params?: {
    query?: string;
    page?: number;
    size?: number;
    status?: string;
  }) {
    const response = await patientsApi.listPatients(params);
    return {
      ...response,
      items: response.items.map(mapApiPatientToPatientRecord),
    };
  },

  /**
   * Create patient record from auth registration data.
   * Called after POST /api/v1/auth/patient/register succeeds
   * to ensure the patient also appears in Patient Management.
   */
  async createPatientFromAuth(authData: {
    fullName: string;
    email: string;
    mobile: string;
  }): Promise<Patient | null> {
    try {
      const payload: CreatePatientRequest = {
        fullName: authData.fullName,
        email: authData.email,
        mobileNumber: authData.mobile,
        gender: "OTHER", // Will be updated during profile completion
        relationship: "SELF",
        registrationType: "ONLINE",
      };
      return await patientService.registerPatient(payload);
    } catch (error) {
      // If backend already created the patient record during auth,
      // this will fail with a duplicate error — that's expected
      console.warn(
        "[patientService] Auto-create patient from auth (may already exist):",
        error,
      );
      return null;
    }
  },

  /**
   * Get patient audit trail
   */
  async getAuditTrail(mrn: string) {
    return patientsApi.getPatientAudit(mrn);
  },

  /**
   * Get patient statistics
   */
  async getStatistics() {
    return patientsApi.getStatistics();
  },
};
