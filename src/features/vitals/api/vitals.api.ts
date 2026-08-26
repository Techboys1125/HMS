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
   * Get Patient Vitals with Audit Info (Swagger specification)
   */
  async getVitals(appointmentId: string | number): Promise<
    NurseVitalsApiResponse<{
      vitalsId?: number;
      appointmentId?: number;
      chiefComplaint?: string;
      symptoms?: string;
      diagnosis?: string;
      clinicalNotes?: string;
      temperature?: number;
      weight?: number;
      height?: number;
      bloodPressure?: string;
      bloodPressureSystolic?: number;
      bloodPressureDiastolic?: number;
      pulse?: number;
      heartRate?: number;
      spo2?: number;
      oxygenSaturation?: number;
      respiratoryRate?: number;
      respRate?: number;
      bloodSugar?: number;
      sugar?: number;
      notes?: string;
      status?: string;
      message?: string;
      version?: number;
      recordedBy?: { employeeId?: string; name?: string };
      recordedAt?: string;
      lastUpdatedBy?: { employeeId?: string; name?: string };
      lastUpdatedAt?: string;
      lastReviewedBy?: { employeeId?: string; name?: string };
      lastReviewedAt?: string;
    } | null>
  > {
    try {
      try {
        const primaryRes = await apiClient.get<
          NurseVitalsApiResponse<{
            vitalsId?: number;
            appointmentId?: number;
            chiefComplaint?: string;
            symptoms?: string;
            diagnosis?: string;
            clinicalNotes?: string;
            temperature?: number;
            weight?: number;
            height?: number;
            bloodPressure?: string;
            bloodPressureSystolic?: number;
            bloodPressureDiastolic?: number;
            pulse?: number;
            heartRate?: number;
            spo2?: number;
            oxygenSaturation?: number;
            respiratoryRate?: number;
            respRate?: number;
            bloodSugar?: number;
            sugar?: number;
            notes?: string;
            status?: string;
            message?: string;
            version?: number;
            recordedBy?: { employeeId?: string; name?: string };
            recordedAt?: string;
            lastUpdatedBy?: { employeeId?: string; name?: string };
            lastUpdatedAt?: string;
            lastReviewedBy?: { employeeId?: string; name?: string };
            lastReviewedAt?: string;
          } | null>
        >(`/api/v1/nurse/appointments/${appointmentId}/vitals`);
        return primaryRes.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          const fallbackRes = await apiClient.get<
            NurseVitalsApiResponse<{
              vitalsId?: number;
              appointmentId?: number;
              chiefComplaint?: string;
              symptoms?: string;
              diagnosis?: string;
              clinicalNotes?: string;
              temperature?: number;
              weight?: number;
              height?: number;
              bloodPressure?: string;
              bloodPressureSystolic?: number;
              bloodPressureDiastolic?: number;
              pulse?: number;
              heartRate?: number;
              spo2?: number;
              respiratoryRate?: number;
              respRate?: number;
              bloodSugar?: number;
              sugar?: number;
              status?: string;
              message?: string;
              version?: number;
              recordedBy?: { employeeId?: string; name?: string };
              recordedAt?: string;
              lastUpdatedBy?: { employeeId?: string; name?: string };
              lastUpdatedAt?: string;
              lastReviewedBy?: { employeeId?: string; name?: string };
              lastReviewedAt?: string;
            } | null>
          >(`/api/v1/appointments/${appointmentId}/vitals`);
          return fallbackRes.data;
        }
        throw err;
      }
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
   * GET /api/v1/encounters/{encounterId}/vitals
   * Fetch vitals directly for an encounter (Swagger spec B)
   */
  async getVitalsByEncounterId(encounterId: string | number) {
    try {
      const response = await apiClient.get<NurseVitalsApiResponse<unknown> | Record<string, unknown>>(
        `/api/v1/encounters/${encounterId}/vitals`,
      );
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * POST /api/v1/nurse/appointments/{appointmentId}/vitals
   * Submit recorded patient vitals (Swagger specification)
   */
  async recordVitals(
    appointmentId: string | number,
    payload: NurseVitalsPayload,
  ): Promise<NurseVitalsApiResponse<unknown>> {
    try {
      try {
        const primaryRes = await apiClient.post<NurseVitalsApiResponse<unknown>>(
          `/api/v1/nurse/appointments/${appointmentId}/vitals`,
          payload,
        );
        return primaryRes.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          const fallbackRes = await apiClient.post<NurseVitalsApiResponse<unknown>>(
            `/api/v1/appointments/${appointmentId}/vitals`,
            payload,
          );
          return fallbackRes.data;
        }
        throw err;
      }
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
