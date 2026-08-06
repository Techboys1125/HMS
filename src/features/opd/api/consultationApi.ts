import { apiClient, axios } from "../../../lib/axios";
import type { Encounter, Consultation, Diagnosis } from "../types/encounter";
import type { PatientVitals } from "../types/vitals";

export interface EncounterPrescription {
  id: number;
  prescriptionId: string;
  encounterId: number;
  encounterNumber: string;
  patient?: {
    fullName: string;
    mrn: string;
    gender: string;
    age: string;
  };
  prescriber?: {
    doctorId: string;
    fullName: string;
    registrationNumber: string;
    department: string;
  };
  status: "DRAFT" | "FINALIZED";
  outcome: string;
  currentVersion: number;
  amendmentReason?: string;
  amendedFromVersion?: number;
  medications: Array<{
    medicationId: number;
    displayOrder?: number;
    source: string;
    medicineId?: number;
    medicineName: string;
    strength?: string;
    form?: string;
    route?: string;
    dose?: { value: number; unit: string };
    frequency?: { code: string; display: string };
    duration?: { value: number; unit: string };
    quantity?: { value: number; unit: string };
    instructions?: string;
  }>;
  advice?: {
    general?: string;
    diet?: string;
    precautions?: string;
    additionalInstructions?: string;
  };
  followUp?: {
    instructions?: string;
    type?: string;
    intervalValue?: number;
    intervalUnit?: string;
    followUpDate?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  finalizedAt?: string;
}

interface ApiEnvelope<T> {
  success?: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data?: T;
  errors?: Record<string, unknown>;
}

const unwrap = <T>(body: ApiEnvelope<T> | T): T => {
  if (
    body !== null &&
    typeof body === "object" &&
    "data" in body &&
    (body as ApiEnvelope<T>).data !== undefined
  ) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
};

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) {
      throw new Error(data.message);
    }
  }
  throw error;
};

export const consultationApi = {
  /**
   * PATCH /api/v1/doctor/appointments/{appointmentId}/start
   * Note: Backend requires status IN_CONSULTATION or CALLED/WAITING_FOR_DOCTOR_CALL
   */
  startAppointment: async (
    appointmentId: string | number,
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await apiClient.patch<
        ApiEnvelope<{ success: boolean; status: string }> | { success: boolean; status: string }
      >(`/api/v1/doctor/appointments/${appointmentId}/start`, {});
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * PATCH /api/v1/doctor/appointments/{appointmentId}/complete
   */
  completeAppointment: async (
    appointmentId: string | number,
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await apiClient.patch<
        ApiEnvelope<{ success: boolean; status: string }> | { success: boolean; status: string }
      >(`/api/v1/doctor/appointments/${appointmentId}/complete`, {});
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters
   * Create an encounter for an appointment
   */
  createEncounter: async (
    appointmentId: string | number,
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        "/api/v1/encounters",
        { appointmentId },
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/consultation
   * Initialize consultation draft
   */
  initializeConsultation: async (
    encounterId: string | number,
    chiefComplaint: string = "",
  ): Promise<Consultation> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<Consultation> | Consultation
      >(`/api/v1/encounters/${encounterId}/consultation`, { chiefComplaint });
      return unwrap<Consultation>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/vitals
   * Load patient vitals for the encounter
   */
  loadEncounterVitals: async (
    encounterId: string | number,
  ): Promise<PatientVitals | null> => {
    if (!encounterId || String(encounterId).startsWith("ENC-") || String(encounterId) === "ENC-1001") {
      return null;
    }
    try {
      const response = await apiClient.get<
        ApiEnvelope<PatientVitals> | PatientVitals
      >(`/api/v1/encounters/${encounterId}/vitals`);
      return unwrap<PatientVitals>(response.data);
    } catch {
      return null;
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/vitals
   * Update vitals for the encounter
   */
  updateVitals: async (
    encounterId: string | number,
    vitals: Partial<PatientVitals>,
  ): Promise<PatientVitals> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<PatientVitals> | PatientVitals
      >(`/api/v1/encounters/${encounterId}/vitals`, vitals);
      return unwrap<PatientVitals>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/diagnoses
   * Add a diagnosis to the encounter
   */
  addDiagnosis: async (
    encounterId: string | number,
    diagnosis: { diagnosisCode: string; diagnosisName: string },
  ): Promise<Diagnosis> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Diagnosis> | Diagnosis>(
        `/api/v1/encounters/${encounterId}/diagnoses`,
        diagnosis,
      );
      return unwrap<Diagnosis>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/finalize
   * Finalize the encounter (also completes the appointment)
   */
  finalizeConsultation: async (
    encounterId: string | number,
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        `/api/v1/encounters/${encounterId}/finalize`,
        { confirmation: true },
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/consultations/{consultationId}
   * Get consultation details
   */
  getConsultationDetails: async (
    consultationId: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any | null> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.get<any>(
        `/api/v1/consultations/${consultationId}`,
      );
      return response.data?.data || response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}
   * Get encounter details
   */
  getEncounter: async (
    encounterId: string | number,
  ): Promise<Encounter | null> => {
    try {
      const response = await apiClient.get<any>(
        `/api/v1/encounters/${encounterId}`,
      );
      return response.data?.data || response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/diagnoses
   * Get all diagnoses for an encounter
   */
  getDiagnoses: async (
    encounterId: string | number,
  ): Promise<Diagnosis[]> => {
    try {
      const response = await apiClient.get<any>(
        `/api/v1/encounters/${encounterId}/diagnoses`,
      );
      const list = response.data?.data || response.data;
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/prescription
   * Get encounter prescription workspace
   */
  getPrescription: async (
    encounterId: string | number,
  ): Promise<EncounterPrescription | null> => {
    try {
      const response = await apiClient.get<ApiEnvelope<EncounterPrescription> | EncounterPrescription>(
        `/api/v1/encounters/${encounterId}/prescription`,
      );
      return unwrap<EncounterPrescription>(response.data);
    } catch {
      return null;
    }
  },

  /**
   * PATCH /api/v1/queue/{appointmentId}/call
   * Doctor calls a patient from the queue
   */
  callPatientFromQueue: async (
    appointmentId: string | number,
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await apiClient.patch<
        ApiEnvelope<{ success: boolean; status: string }> | { success: boolean; status: string }
      >(`/api/v1/queue/${appointmentId}/call`);
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * PUT /api/v1/nurse/appointments/{appointmentId}/vitals
   * Doctor or Nurse update patient vitals
   */
  updateAppointmentVitals: async (
    appointmentId: string | number,
    vitals: Record<string, unknown>,
  ): Promise<{ success: boolean; data: unknown }> => {
    try {
      const response = await apiClient.put<
        ApiEnvelope<{ success: boolean; data: unknown }> | { success: boolean; data: unknown }
      >(`/api/v1/nurse/appointments/${appointmentId}/vitals`, vitals);
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * PUT /api/v1/consultations/{consultationId}/clinical-notes
   * Save SOAP notes for the consultation
   */
  saveClinicalNotes: async (
    consultationId: string | number,
    clinicalNotes: Record<string, unknown>,
  ): Promise<{ success: boolean; data: unknown }> => {
    try {
      const response = await apiClient.put<
        ApiEnvelope<{ success: boolean; data: unknown }> | { success: boolean; data: unknown }
      >(`/api/v1/consultations/${consultationId}/clinical-notes`, clinicalNotes);
      return unwrap(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/finalization-check
   * Validate encounter readiness before finalization
   */
  finalizationCheck: async (
    encounterId: string | number,
  ): Promise<{
    canFinalize: boolean;
    missingItems: string[];
    prescriptionOutcome?: string;
  }> => {
    try {
      const response = await apiClient.get<{
        data?: {
          canFinalize: boolean;
          missingItems: string[];
          prescriptionOutcome?: string;
        };
      }>(`/api/v1/encounters/${encounterId}/finalization-check`);
      return (
        response.data?.data || {
          canFinalize: true,
          missingItems: [],
        }
      );
    } catch {
      return { canFinalize: true, missingItems: [] };
    }
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/validate
   * Validate prescription before finalization
   */
  validatePrescription: async (
    prescriptionId: string | number,
  ): Promise<{ valid: boolean; errors: string[] }> => {
    try {
      const response = await apiClient.post<{
        data?: { valid: boolean; errors: string[] };
      }>(`/api/v1/prescriptions/${prescriptionId}/validate`);
      return response.data?.data || { valid: true, errors: [] };
    } catch {
      return { valid: true, errors: [] };
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/prescription-resolution
   * Set prescription outcome/resolution on the encounter
   */
  setPrescriptionResolution: async (
    encounterId: string | number,
    resolution: { outcome: string },
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        `/api/v1/encounters/${encounterId}/prescription-resolution`,
        resolution,
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/doctors/me/consultation-queue
   * Fetch doctor's consultation queue
   */
  getConsultationQueue: async (): Promise<unknown[]> => {
    try {
      const response = await apiClient.get<any>(
        "/api/v1/doctors/me/consultation-queue",
      );
      const list = response.data?.data || response.data;
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },
};
