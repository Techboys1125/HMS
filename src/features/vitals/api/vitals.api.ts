import { apiClient, axios } from "../../../lib/axios";
import type {
  NurseVitalsPayload,
  NurseWaitingPatient,
  NurseVitalsApiResponse,
} from "../types/vitals.types";

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

export const vitalsApi = {
  /**
   * GET /api/v1/nurse/vitals/waiting
   * Fetch list of patients waiting for vitals recording
   */
  async getWaitingPatients(): Promise<NurseWaitingPatient[]> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await apiClient.get<
        NurseVitalsApiResponse<NurseWaitingPatient[]>
      >(`/api/v1/nurse/vitals/waiting?date=${today}`);
      const data = response.data?.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  /**
   * GET /api/v1/nurse/appointments/{appointmentId}/vitals
   * Fetch recorded vitals for an appointment (with audit info)
   */
  async getVitals(appointmentId: string | number): Promise<
    NurseVitalsApiResponse<{
      vitalsId?: number;
      appointmentId?: number;
      temperature?: number;
      weight?: number;
      height?: number;
      bloodPressure?: string;
      bloodPressureSystolic?: number;
      bloodPressureDiastolic?: number;
      heartRate?: number;
      pulse?: number;
      respiratoryRate?: number;
      respRate?: number;
      oxygenSaturation?: number;
      spo2?: number;
      bloodSugar?: number;
      sugar?: number;
      painScore?: number;
      notes?: string;
      recordedBy?: { employeeId?: string; name?: string };
      recordedAt?: string;
      lastUpdatedBy?: { employeeId?: string; name?: string };
      lastUpdatedAt?: string;
    } | null>
  > {
    try {
      const response = await apiClient.get<
        NurseVitalsApiResponse<{
          vitalsId?: number;
          appointmentId?: number;
          temperature?: number;
          weight?: number;
          height?: number;
          bloodPressure?: string;
          bloodPressureSystolic?: number;
          bloodPressureDiastolic?: number;
          heartRate?: number;
          pulse?: number;
          respiratoryRate?: number;
          respRate?: number;
          oxygenSaturation?: number;
          spo2?: number;
          bloodSugar?: number;
          sugar?: number;
          painScore?: number;
          notes?: string;
          recordedBy?: { employeeId?: string; name?: string };
          recordedAt?: string;
          lastUpdatedBy?: { employeeId?: string; name?: string };
          lastUpdatedAt?: string;
        } | null>
      >(`/api/v1/nurse/appointments/${appointmentId}/vitals`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  /**
   * POST /api/v1/encounters
   * Create an encounter for an appointment (backend contract)
   */
  async createEncounter(
    appointmentId: string | number,
  ): Promise<{ encounterId: string | number }> {
    try {
      const response = await apiClient.post<
        | ApiEnvelope<{ encounterId: string | number }>
        | { encounterId: string | number }
      >("/api/v1/encounters", { appointmentId });
      return unwrap(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  /**
   * POST /api/v1/encounters/{encounterId}/vitals
   * Record vitals for an encounter (backend contract)
   */
  async recordEncounterVitals(
    encounterId: string | number,
    payload: {
      tempValue?: number;
      bpSystolicVal?: number;
      bpDiastolicVal?: number;
      pulseVal?: number;
      spo2Val?: number;
      weightVal?: number;
      heightVal?: number;
    },
  ): Promise<NurseVitalsApiResponse<unknown>> {
    try {
      const response = await apiClient.post<NurseVitalsApiResponse<unknown>>(
        `/api/v1/encounters/${encounterId}/vitals`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  /**
   * POST /api/v1/nurse/appointments/{appointmentId}/vitals
   * Submit recorded patient vitals (legacy endpoint)
   */
  async recordVitals(
    appointmentId: string | number,
    payload: NurseVitalsPayload,
  ): Promise<NurseVitalsApiResponse<unknown>> {
    try {
      const response = await apiClient.post<NurseVitalsApiResponse<unknown>>(
        `/api/v1/nurse/appointments/${appointmentId}/vitals`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },
};
