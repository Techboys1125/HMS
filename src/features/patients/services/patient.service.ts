import { apiClient, axios } from "../../../lib/axios";
import type {
  CreatePatientRequest,
  DuplicateCheckRequest,
  DuplicateOverrideRequest,
  MergePatientsRequest,
  Patient,
  PatientStatistics,
  UpdatePatientRequest,
} from "../types/patient.types";

const unwrapData = <T>(response: any): T | null => {
  if (!response) return null;
  return (response.data ?? response) as T;
};

export const patientService = {
  async getPatients(params?: {
    query?: string;
    page?: number;
    size?: number;
    status?: string;
  }): Promise<Patient[]> {
    try {
      const search = new URLSearchParams();
      if (params?.query) search.append("query", params.query);
      if (params?.page !== undefined)
        search.append("page", String(params.page));
      if (params?.size !== undefined)
        search.append("size", String(params.size));
      if (params?.status) search.append("status", params.status);
      const url = `/api/v1/patients${search.toString() ? `?${search.toString()}` : ""}`;
      const res = await apiClient.get<any>(url);
      return Array.isArray(res.data?.content)
        ? res.data.content
        : Array.isArray(res.data)
          ? res.data
          : [];
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async searchPatients(query: string): Promise<Patient[]> {
    try {
      const res = await apiClient.get<any>(
        `/api/v1/patients/search?query=${encodeURIComponent(query)}`,
      );
      return Array.isArray(res.data?.content)
        ? res.data.content
        : Array.isArray(res.data)
          ? res.data
          : [];
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async getPatient(mrn: string): Promise<Patient> {
    try {
      const res = await apiClient.get<any>(
        `/api/v1/patients/${encodeURIComponent(mrn)}`,
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async createPatient(payload: CreatePatientRequest): Promise<Patient> {
    try {
      const res = await apiClient.post<any>("/api/v1/patients", payload);
      return unwrapData<Patient>(res) as Patient;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async createPatientWithOverride(
    payload: CreatePatientRequest,
    reason: string,
  ): Promise<Patient> {
    try {
      const res = await apiClient.post<any>("/api/v1/patients/override", {
        ...payload,
        reason,
      });
      return unwrapData<Patient>(res) as Patient;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async updatePatient(
    mrn: string,
    payload: UpdatePatientRequest,
    version: number,
  ): Promise<Patient> {
    try {
      const res = await apiClient.patch<any>(
        `/api/v1/patients/${encodeURIComponent(mrn)}`,
        {
          ...payload,
          version,
        },
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async checkDuplicates(payload: DuplicateCheckRequest): Promise<Patient[]> {
    try {
      const res = await apiClient.post<any>(
        "/api/v1/patients/check-duplicates",
        payload,
      );
      return Array.isArray(res.data?.candidates)
        ? res.data.candidates
        : Array.isArray(res.data)
          ? res.data
          : [];
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async overrideDuplicate(
    payload: DuplicateOverrideRequest & { mrn?: string },
  ): Promise<Patient> {
    try {
      const res = await apiClient.post<any>(
        "/api/v1/patients/duplicate-override",
        payload,
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async mergePatients(payload: MergePatientsRequest): Promise<Patient> {
    try {
      const res = await apiClient.post<any>("/api/v1/patients/merge", payload);
      return unwrapData<Patient>(res) as Patient;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  async getStatistics(): Promise<PatientStatistics> {
    try {
      const res = await apiClient.get<any>("/api/v1/patients/statistics");
      return unwrapData<PatientStatistics>(res) as PatientStatistics;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
};
