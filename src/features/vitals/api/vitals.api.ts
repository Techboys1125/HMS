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
          throw new Error(data.message);
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
          throw new Error(data.message);
        }
      }
      throw error;
    }
  },
};
