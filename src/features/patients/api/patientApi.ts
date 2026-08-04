import { apiClient } from "../../../lib/axios";
import type {
  Patient,
  PatientApiResponse,
  PaginatedResponse,
  ApiPatientFamilyMember,
  ApiPatientAppointment,
  ApiPatientPrescription,
  ApiPatientInvoice,
} from "../types/patient.types";

export const patientApi = {
  listPatients: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    query?: string;
    status?: string;
  }): Promise<PaginatedResponse<Patient>> => {
    try {
      const searchParams = new URLSearchParams();
      const queryVal =
        ((params as Record<string, unknown> | undefined)?.query as
          | string
          | undefined) || params?.search;
      if (queryVal) searchParams.append("query", queryVal);
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.limit) searchParams.append("limit", String(params.limit));
      if (params?.status) searchParams.append("status", params.status);

      const url = `/api/v1/patients${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      let response;
      try {
        response = await apiClient.get<
          PatientApiResponse<Patient[]> | Patient[]
        >(url);
      } catch {
        // Fallback endpoint if primary /api/v1/patients returns 500
        const fallbackUrl = queryVal
          ? `/api/v1/patients/search?query=${encodeURIComponent(queryVal)}`
          : "/api/v1/admin/users?role=PATIENT";
        response = await apiClient.get<
          PatientApiResponse<Patient[]> | Patient[]
        >(fallbackUrl);
      }

      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as { data?: Patient[]; content?: Patient[] })?.data ||
          (response.data as { data?: Patient[]; content?: Patient[] })
            ?.content ||
          [];

      return {
        items: data,
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(data.length / (params?.limit || 10)) || 1,
      };
    } catch (error) {
      console.warn("[patientApi] Fallback error fetching patient list:", error);
      return {
        items: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      };
    }
  },

  getPatientByMrn: async (mrn: string): Promise<Patient> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<Patient> | Patient
      >(`/api/v1/patients/${mrn}`);
      const data =
        (response.data as PatientApiResponse<Patient>)?.data ||
        (response.data as Patient);
      if (!data) throw new Error(`Patient ${mrn} not found`);
      return data as Patient;
    } catch (error) {
      console.error(`[patientApi] Failed to fetch patient ${mrn}:`, error);
      throw error;
    }
  },

  registerPatient: async (
    payload: Record<string, unknown>,
  ): Promise<Patient> => {
    try {
      const response = await apiClient.post<PatientApiResponse<Patient>>(
        "/api/v1/patients",
        payload,
      );
      const data = response.data?.data || (response.data as unknown as Patient);
      if (!data) throw new Error("Failed to register patient");
      return data;
    } catch (error) {
      console.error("[patientApi] Patient registration failed:", error);
      throw error;
    }
  },

  updatePatient: async (
    mrn: string,
    payload: Record<string, unknown>,
  ): Promise<Patient> => {
    try {
      const response = await apiClient.put<PatientApiResponse<Patient>>(
        `/api/v1/patients/${mrn}`,
        payload,
      );
      const data = response.data?.data || (response.data as unknown as Patient);
      if (!data) throw new Error("Failed to update patient");
      return data;
    } catch (error) {
      console.error(`[patientApi] Failed to update patient ${mrn}:`, error);
      throw error;
    }
  },

  getFamilyMembers: async (mrn: string): Promise<ApiPatientFamilyMember[]> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientFamilyMember[]>
      >(`/api/v1/patients/${mrn}/family-members`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  addFamilyMember: async (
    mrn: string,
    payload: Record<string, unknown>,
  ): Promise<ApiPatientFamilyMember | null> => {
    try {
      const response = await apiClient.post<
        PatientApiResponse<ApiPatientFamilyMember>
      >(`/api/v1/patients/${mrn}/family-members`, payload);
      return (
        response.data?.data ||
        (response.data as unknown as ApiPatientFamilyMember) ||
        null
      );
    } catch {
      return null;
    }
  },

  updateFamilyMember: async (
    mrn: string,
    memberId: string,
    payload: Record<string, unknown>,
  ): Promise<ApiPatientFamilyMember | null> => {
    try {
      const response = await apiClient.put<
        PatientApiResponse<ApiPatientFamilyMember>
      >(`/api/v1/patients/${mrn}/family-members/${memberId}`, payload);
      return (
        response.data?.data ||
        (response.data as unknown as ApiPatientFamilyMember) ||
        null
      );
    } catch {
      return null;
    }
  },

  deleteFamilyMember: async (
    mrn: string,
    memberId: string,
  ): Promise<boolean> => {
    try {
      await apiClient.delete(
        `/api/v1/patients/${mrn}/family-members/${memberId}`,
      );
      return true;
    } catch {
      return false;
    }
  },

  getAppointments: async (mrn: string): Promise<ApiPatientAppointment[]> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientAppointment[]>
      >(`/api/v1/appointments?mrn=${mrn}`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  getPatientQueue: async (mrn?: string) => {
    try {
      type QueueData = {
        queueStatus: string;
        position?: number;
        token?: string;
      };
      const response = await apiClient.get<
        PatientApiResponse<QueueData> | QueueData
      >(mrn ? `/api/v1/patients/${mrn}/queue` : `/api/v1/patients/me/queue`);
      return (
        (response.data as PatientApiResponse<QueueData>)?.data ||
        (response.data as QueueData) ||
        null
      );
    } catch {
      return null;
    }
  },

  getReceptionQueue: async () => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<{
          queue: Array<{
            appointmentId: string;
            mrn: string;
            patientName: string;
            token: string;
            status: string;
          }>;
        }>
      >(`/api/v1/reception/queue`);
      return response.data?.data?.queue || [];
    } catch {
      return [];
    }
  },

  checkInAppointment: async (appointmentId: string): Promise<boolean> => {
    try {
      await apiClient.patch(
        `/api/v1/reception/appointments/${appointmentId}/check-in`,
      );
      return true;
    } catch {
      return false;
    }
  },

  generateToken: async (
    appointmentId: string,
  ): Promise<{ token: string } | null> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<{ token: string }>
      >(`/api/v1/reception/appointments/${appointmentId}/token`);
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  getNurseVitalsWaiting: async () => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<
          Array<{
            mrn: string;
            fullName: string;
            age: number;
            gender: string;
            doctor: string;
            department: string;
            appointmentId: string;
          }>
        >
      >(`/api/v1/nurse/vitals/waiting`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  submitVitals: async (
    appointmentId: string,
    payload: Record<string, unknown>,
  ): Promise<boolean> => {
    try {
      await apiClient.post(
        `/api/v1/nurse/appointments/${appointmentId}/vitals`,
        payload,
      );
      return true;
    } catch {
      return false;
    }
  },

  getPrescriptions: async (mrn: string): Promise<ApiPatientPrescription[]> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientPrescription[]>
      >(`/api/v1/patient/prescriptions?mrn=${mrn}`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  getPrescriptionById: async (
    id: string,
  ): Promise<ApiPatientPrescription | null> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientPrescription>
      >(`/api/v1/patient/prescriptions/${id}`);
      return (
        response.data?.data ||
        (response.data as unknown as ApiPatientPrescription) ||
        null
      );
    } catch {
      return null;
    }
  },

  getBilling: async (mrn: string): Promise<ApiPatientInvoice[]> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientInvoice[]>
      >(`/api/v1/billing/patient/${mrn}`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  getPatientAudit: async (mrn: string) => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<
          Array<{
            action: string;
            timestamp: string;
            performedBy: string;
            details: string;
          }>
        >
      >(`/api/v1/patients/${mrn}/audit`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },
};
