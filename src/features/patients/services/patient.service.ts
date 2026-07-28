import { apiClient, axios, ApiError } from "../../../lib/axios";
import type {
  CreatePatientRequest,
  DuplicateCheckRequest,
  DuplicateOverrideRequest,
  MergePatientsRequest,
  Patient,
  PatientStatistics,
  UpdatePatientRequest,
} from "../types/patient.types";

const unwrapData = <T>(response: unknown): T | null => {
  if (!response) return null;
  const resObj = response as { data?: T };
  return (resObj.data ?? response) as T;
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
      const res = await apiClient.get<{ content?: Patient[] } | Patient[]>(url);
      const data = res.data;
      if (
        data &&
        typeof data === "object" &&
        "content" in data &&
        Array.isArray(data.content)
      ) {
        return data.content;
      }
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async searchPatients(query: string): Promise<Patient[]> {
    try {
      const res = await apiClient.get<{ content?: Patient[] } | Patient[]>(
        `/api/v1/patients/search?query=${encodeURIComponent(query)}`,
      );
      const data = res.data;
      if (
        data &&
        typeof data === "object" &&
        "content" in data &&
        Array.isArray(data.content)
      ) {
        return data.content;
      }
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async getPatient(mrn: string): Promise<Patient> {
    try {
      const res = await apiClient.get<Patient>(
        `/api/v1/patients/${encodeURIComponent(mrn)}`,
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async createPatient(
    payload: CreatePatientRequest,
  ): Promise<{ MRNId: string; message: string }> {
    try {
      const res = await apiClient.post<{ MRNId: string; message: string }>(
        "/api/v1/patients",
        payload,
      );
      return res.data || (res as unknown as { MRNId: string; message: string });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async createPatientWithOverride(
    payload: CreatePatientRequest,
    reason: string,
  ): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>("/api/v1/patients/override", {
        ...payload,
        reason,
      });
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
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
      const res = await apiClient.patch<Patient>(
        `/api/v1/patients/${encodeURIComponent(mrn)}`,
        {
          ...payload,
          version,
        },
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async checkDuplicates(payload: DuplicateCheckRequest): Promise<Patient[]> {
    try {
      const res = await apiClient.post<{ candidates?: Patient[] } | Patient[]>(
        "/api/v1/patients/check-duplicates",
        payload,
      );
      const data = res.data;
      if (
        data &&
        typeof data === "object" &&
        "candidates" in data &&
        Array.isArray(data.candidates)
      ) {
        return data.candidates;
      }
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async overrideDuplicate(
    payload: DuplicateOverrideRequest & { mrn?: string },
  ): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>(
        "/api/v1/patients/duplicate-override",
        payload,
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async mergePatients(payload: MergePatientsRequest): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>(
        "/api/v1/patients/merge",
        payload,
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async getStatistics(): Promise<PatientStatistics> {
    try {
      const res = await apiClient.get<PatientStatistics>(
        "/api/v1/patients/statistics",
      );
      return unwrapData<PatientStatistics>(res) as PatientStatistics;
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 403 || error.response?.status === 404)
      ) {
        console.warn("Statistics endpoint not available, returning mock data");
        return {
          totalPatients: 0,
          activePatients: 0,
          inactivePatients: 0,
          duplicateCandidates: 0,
          deceasedPatients: 0,
          newRegistrationsToday: 0,
        };
      }
      if (
        error instanceof ApiError &&
        (error.response?.status === 403 || error.response?.status === 404)
      ) {
        console.warn("Statistics endpoint not available, returning mock data");
        return {
          totalPatients: 0,
          activePatients: 0,
          inactivePatients: 0,
          duplicateCandidates: 0,
          deceasedPatients: 0,
          newRegistrationsToday: 0,
        };
      }
      throw error;
    }
  },
};
