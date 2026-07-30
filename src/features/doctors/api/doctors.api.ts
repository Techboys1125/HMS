import { apiClient } from "../../../lib/axios";
import type {
  DoctorRecord,
  DoctorApiResponse,
  PaginatedResponse,
} from "../types/doctors.types";
import { INITIAL_DOCTORS } from "../constants/doctors.constants";

const simulateApiCall = <T>(data: T, delay = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

const simulateError = (message: string): never => {
  throw new Error(message);
};

let doctorsData = [...INITIAL_DOCTORS];

export const doctorsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
  }): Promise<PaginatedResponse<DoctorRecord>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<DoctorRecord>>(
        "/api/v1/doctors",
        { params },
      );
      return response.data;
    } catch {
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      let filtered = [...doctorsData];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q),
        );
      }
      if (params?.department && params.department !== "All") {
        filtered = filtered.filter((d) => d.department === params.department);
      }
      const total = filtered.length;
      const start = (page - 1) * limit;
      const items = filtered.slice(start, start + limit);
      return simulateApiCall({
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }
  },

  getById: async (id: string): Promise<DoctorRecord> => {
    try {
      const response = await apiClient.get<DoctorApiResponse<DoctorRecord>>(
        `/api/v1/doctors/${id}`,
      );
      return response.data.data as DoctorRecord;
    } catch {
      const doctor = doctorsData.find((d) => d.id === id);
      if (!doctor) simulateError(`Doctor ${id} not found`);
      return simulateApiCall(doctor as DoctorRecord);
    }
  },

  create: async (doctor: Omit<DoctorRecord, "id">): Promise<DoctorRecord> => {
    try {
      const response = await apiClient.post<DoctorApiResponse<DoctorRecord>>(
        "/api/v1/doctors",
        doctor,
      );
      return response.data.data as DoctorRecord;
    } catch {
      const newDoctor = {
        ...doctor,
        id: `DOC-${1000 + doctorsData.length + 1}`,
      } as DoctorRecord;
      doctorsData = [newDoctor, ...doctorsData];
      return simulateApiCall(newDoctor);
    }
  },

  update: async (
    id: string,
    doctor: Partial<DoctorRecord>,
  ): Promise<DoctorRecord> => {
    try {
      const response = await apiClient.put<DoctorApiResponse<DoctorRecord>>(
        `/api/v1/doctors/${id}`,
        doctor,
      );
      return response.data.data as DoctorRecord;
    } catch {
      const index = doctorsData.findIndex((d) => d.id === id);
      if (index === -1) simulateError(`Doctor ${id} not found`);
      doctorsData[index] = { ...doctorsData[index], ...doctor };
      return simulateApiCall(doctorsData[index]);
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/v1/doctors/${id}`);
      return true;
    } catch {
      doctorsData = doctorsData.filter((d) => d.id !== id);
      return simulateApiCall(true);
    }
  },

  deactivate: async (id: string): Promise<DoctorRecord> => {
    try {
      const response = await apiClient.patch<DoctorApiResponse<DoctorRecord>>(
        `/api/v1/doctors/${id}/deactivate`,
      );
      return response.data.data as DoctorRecord;
    } catch {
      const index = doctorsData.findIndex((d) => d.id === id);
      if (index === -1) simulateError(`Doctor ${id} not found`);
      doctorsData[index] = {
        ...doctorsData[index],
        status: "Inactive",
        availability: "Out of Office",
      };
      return simulateApiCall(doctorsData[index]);
    }
  },
};
