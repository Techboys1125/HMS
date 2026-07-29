import { doctorsApi } from "../api/doctors.api";
import type { DoctorRecord, PaginatedResponse } from "../types/doctors.types";

export const doctorsService = {
  async getAll(params?: { page?: number; limit?: number; search?: string; department?: string }): Promise<PaginatedResponse<DoctorRecord>> {
    return doctorsApi.getAll(params);
  },

  async getById(id: string): Promise<DoctorRecord> {
    return doctorsApi.getById(id);
  },

  async create(doctor: Omit<DoctorRecord, "id">): Promise<DoctorRecord> {
    return doctorsApi.create(doctor);
  },

  async update(id: string, doctor: Partial<DoctorRecord>): Promise<DoctorRecord> {
    return doctorsApi.update(id, doctor);
  },

  async delete(id: string): Promise<boolean> {
    return doctorsApi.delete(id);
  },

  async deactivate(id: string): Promise<DoctorRecord> {
    return doctorsApi.deactivate(id);
  },
};
