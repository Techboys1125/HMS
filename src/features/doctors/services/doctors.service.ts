import { doctorsApi } from "../api/doctors.api";
import type { DoctorRecord, PaginatedResponse, CreateDoctorPayload, UpdateDoctorPayload } from "../types/doctors.types";

export const doctorsService = {
  async getAll(params?: { page?: number; limit?: number; search?: string; department?: string }): Promise<PaginatedResponse<DoctorRecord>> {
    return doctorsApi.getAll(params);
  },

  async getById(id: string): Promise<DoctorRecord> {
    return doctorsApi.getById(id);
  },

  async create(payload: CreateDoctorPayload): Promise<DoctorRecord> {
    return doctorsApi.create(payload);
  },

  async update(userId: number | string, payload: UpdateDoctorPayload) {
    return doctorsApi.update(userId, payload);
  },

  async getDailyAvailability(doctorId: number | string, date: string) {
    return doctorsApi.getDailyAvailability(doctorId, date);
  },

  async getScheduleExceptions(doctorId: number | string) {
    return doctorsApi.getScheduleExceptions(doctorId);
  },

  async delete(id: string): Promise<boolean> {
    return doctorsApi.delete(id);
  },

  async deactivate(id: string) {
    return doctorsApi.deactivate(id);
  },
};
