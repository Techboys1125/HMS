import { apiClient, axios } from "../../../lib/axios";
import type {
  AddDiagnosisRequest,
  AddMedicationRequest,
  Consultation,
  CreateEncounterRequest,
  CreatePrescriptionRequest,
  Diagnosis,
  Encounter,
  FinalizeEncounterRequest,
  FinalizePrescriptionRequest,
  FinalizePrescriptionResponse,
  Prescription,
  SaveConsultationRequest,
} from "../types/encounter.types";

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

/**
 * Layered API module for the encounter / prescription management flow.
 * One function per backend endpoint, no business logic, no UI concerns.
 */
export const encountersApi = {
  /**
   * POST /api/v1/encounters
   */
  createEncounter: async (
    payload: CreateEncounterRequest,
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        "/api/v1/encounters",
        payload,
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/consultation
   */
  saveConsultation: async (
    encounterId: string | number,
    payload: SaveConsultationRequest,
  ): Promise<Consultation> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<Consultation> | Consultation
      >(`/api/v1/encounters/${encounterId}/consultation`, payload);
      return unwrap<Consultation>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/diagnoses
   */
  addDiagnosis: async (
    encounterId: string | number,
    payload: AddDiagnosisRequest,
  ): Promise<Diagnosis> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Diagnosis> | Diagnosis>(
        `/api/v1/encounters/${encounterId}/diagnoses`,
        payload,
      );
      return unwrap<Diagnosis>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/finalize
   */
  finalizeEncounter: async (
    encounterId: string | number,
    payload: FinalizeEncounterRequest,
  ): Promise<Encounter> => {
    try {
      const response = await apiClient.post<ApiEnvelope<Encounter> | Encounter>(
        `/api/v1/encounters/${encounterId}/finalize`,
        payload,
      );
      return unwrap<Encounter>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/prescription
   */
  createPrescription: async (
    encounterId: string | number,
    payload: CreatePrescriptionRequest,
  ): Promise<Prescription> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<Prescription> | Prescription
      >(`/api/v1/encounters/${encounterId}/prescription`, payload);
      return unwrap<Prescription>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/medications
   */
  addMedication: async (
    prescriptionId: string | number,
    payload: AddMedicationRequest,
  ): Promise<Prescription | null> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<Prescription> | Prescription
      >(`/api/v1/prescriptions/${prescriptionId}/medications`, payload);
      return unwrap<Prescription>(response.data);
    } catch {
      return null;
    }
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/finalize
   */
  finalizePrescription: async (
    prescriptionId: string | number,
    payload: FinalizePrescriptionRequest = { confirmation: true },
  ): Promise<FinalizePrescriptionResponse | null> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<FinalizePrescriptionResponse> | FinalizePrescriptionResponse
      >(`/api/v1/prescriptions/${prescriptionId}/finalize`, payload);
      return unwrap<FinalizePrescriptionResponse>(response.data);
    } catch {
      return null;
    }
  },

  /**
   * PUT /api/v1/prescriptions/{prescriptionId}/advice
   */
  savePrescriptionAdvice: async (
    prescriptionId: string | number,
    payload: {
      generalAdvice?: string;
      dietAdvice?: string;
      precautions?: string;
    },
  ): Promise<Prescription | null> => {
    try {
      const response = await apiClient.put<{ data?: Prescription; status?: number }>(
        `/api/v1/prescriptions/${prescriptionId}/advice`,
        payload,
      );
      return response.data?.data || response.data;
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/validate
   */
  validatePrescription: async (
    prescriptionId: string | number,
  ): Promise<{ valid: boolean; errors: string[]; warnings: string[] } | null> => {
    try {
      const response = await apiClient.post<
        ApiEnvelope<{ valid: boolean; errors: string[]; warnings: string[] }>
      >(`/api/v1/prescriptions/${prescriptionId}/validate`);
      return unwrap(response.data);
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/finalization-check
   */
  getFinalizationCheck: async (
    encounterId: string | number,
  ): Promise<{ ready: boolean; checks: { code: string; passed: boolean }[] } | null> => {
    try {
      const response = await apiClient.get<
        ApiEnvelope<{ ready: boolean; checks: { code: string; passed: boolean }[] }>
      >(`/api/v1/encounters/${encounterId}/finalization-check`);
      return unwrap(response.data);
    } catch {
      return null;
    }
  },
};

export default encountersApi;
