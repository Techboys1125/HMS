import { apiClient, axios } from "../../../lib/axios";
import type {
  NurseVitalsPayload,
  NurseWaitingPatient,
  NurseVitalsApiResponse,
} from "../types/vitals.types";

export const vitalsApi = {
  /**
   * GET /api/v1/nurse/vitals/waiting
   * Fetch list of patients waiting for vitals recording
   */
  async getWaitingPatients(): Promise<NurseWaitingPatient[]> {
    try {
      const response = await apiClient.get<
        NurseVitalsApiResponse<NurseWaitingPatient[]>
      >("/api/v1/nurse/vitals/waiting");
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
  async getVitals(
    appointmentId: string | number,
  ): Promise<NurseVitalsApiResponse<{
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
  } | null>> {
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
   * POST /api/v1/nurse/appointments/{appointmentId}/vitals
   * Submit recorded patient vitals
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
