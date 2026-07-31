import { apiClient, axios, ApiError } from "../../../lib/axios";
import type {
  CreatePatientRequest,
  DuplicateCheckRequest,
  DuplicateOverrideRequest,
  MergePatientsRequest,
  Patient,
  PatientStatistics,
} from "../types/patient.types";

const unwrapData = <T>(response: unknown): T | null => {
  if (!response) return null;
  const resObj = response as { data?: T };
  return (resObj.data ?? response) as T;
};

export const patientsApi = {
  /**
   * cURL:
   * curl -X GET http://192.168.1.44:8081/api/v1/patients \
   *   -H "Authorization: Bearer <ACCESS_TOKEN>" \
   *   -H "Content-Type: application/json"
   */
  async getAll(params?: {
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
      const res = await apiClient.get<unknown>(url);
      let data = res.data as any;
      if (data && typeof data === "object" && "data" in data) {
        data = data.data;
      }
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

  async search(query: string): Promise<Patient[]> {
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

  async getById(mrn: string): Promise<Patient> {
    try {
      const res = await apiClient.get<Patient>(
        `/api/v1/patients/${encodeURIComponent(mrn)}`,
      );
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
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

  async create(
    payload: CreatePatientRequest,
  ): Promise<{ success?: boolean; message?: string; data?: Patient }> {
    try {
      const res = await apiClient.post<{
        success?: boolean;
        message?: string;
        data?: Patient;
      }>("/api/v1/patients", payload);
      return res.data;
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

  async createWithOverride(
    payload: CreatePatientRequest,
    reason: string,
  ): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>("/api/v1/patients/override", {
        ...payload,
        reason,
      });
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
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

  async update(
    userIdOrMrn: string | number,
    payload: Record<string, unknown>,
  ): Promise<Patient> {
    try {
      let res;
      try {
        res = await apiClient.put<Patient>(
          `/api/v1/admin/users/${userIdOrMrn}`,
          payload,
        );
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          res = await apiClient.put<Patient>(
            `/api/v1/patients/${encodeURIComponent(String(userIdOrMrn))}`,
            payload,
          );
        } else {
          throw err;
        }
      }
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
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
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
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

  async merge(payload: MergePatientsRequest): Promise<Patient> {
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

  async getMyPatients(relationship?: string): Promise<Patient[]> {
    try {
      const search = new URLSearchParams();
      if (relationship) search.append("relationship", relationship);
      const url = `/api/v1/patients/my${search.toString() ? `?${search.toString()}` : ""}`;
      const res = await apiClient.get<unknown>(url);
      let data = res.data as any;
      if (data && typeof data === "object" && "data" in data) {
        data = data.data;
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
