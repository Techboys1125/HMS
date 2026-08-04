import { doctorsApi } from "../api/doctors.api";
import { doctorApi } from "../api/doctorApi";
import { prescriptionsApi } from "../api/prescriptions.api";
import type {
  DoctorRecord,
  PaginatedResponse,
  FinalizePrescriptionRequest,
  CreateScheduleExceptionPayload,
  UpdateScheduleExceptionPayload,
  DayOfWeek,
  UpdateScheduleDayPayload,
  DoctorAppointment,
} from "../types/doctors.types";

export const doctorsService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    departmentId?: number;
  }): Promise<PaginatedResponse<DoctorRecord>> {
    return doctorsApi.getAll(params);
  },

  async getById(id: string): Promise<DoctorRecord> {
    return doctorsApi.getById(id);
  },

  async getDailyAvailability(doctorId: number | string, date: string) {
    return doctorsApi.getDailyAvailability(doctorId, date);
  },

  async getMonthlyCalendarAvailability(
    doctorId: number | string,
    month: string,
  ) {
    return doctorsApi.getMonthlyCalendarAvailability(doctorId, month);
  },

  async getScheduleExceptions(doctorId: number | string) {
    return doctorsApi.getScheduleExceptions(doctorId);
  },

  async getScheduleException(
    doctorId: number | string,
    exceptionId: number | string,
  ) {
    return doctorsApi.getScheduleException(doctorId, exceptionId);
  },

  async createScheduleException(
    doctorId: number | string,
    payload: CreateScheduleExceptionPayload,
  ) {
    return doctorsApi.createScheduleException(doctorId, payload);
  },

  async updateScheduleException(
    doctorId: number | string,
    exceptionId: number | string,
    payload: UpdateScheduleExceptionPayload,
  ) {
    return doctorsApi.updateScheduleException(doctorId, exceptionId, payload);
  },

  async deleteScheduleException(
    doctorId: number | string,
    exceptionId: number | string,
  ) {
    return doctorsApi.deleteScheduleException(doctorId, exceptionId);
  },

  async getWeeklySchedule(doctorId: number | string) {
    return doctorsApi.getWeeklySchedule(doctorId);
  },

  async updateWeeklyScheduleDay(
    doctorId: number | string,
    dayOfWeek: DayOfWeek,
    payload: UpdateScheduleDayPayload,
  ) {
    return doctorsApi.updateWeeklyScheduleDay(doctorId, dayOfWeek, payload);
  },

  async deleteWorkingPeriod(
    doctorId: number | string,
    scheduleId: number | string,
  ) {
    return doctorsApi.deleteWorkingPeriod(doctorId, scheduleId);
  },

  async getQueue(doctorId: number | string) {
    return doctorsApi.getQueue(doctorId);
  },

  async callNext(doctorId: number | string) {
    return doctorsApi.callNext(doctorId);
  },

  async finalizePrescription(
    prescriptionId: string | number,
    payload: FinalizePrescriptionRequest = { confirmation: true },
  ) {
    return prescriptionsApi.finalizePrescription(prescriptionId, payload);
  },

  async listDoctorAppointments(
    doctorId: number | string,
  ): Promise<DoctorAppointment[]> {
    return doctorApi.getDoctorAppointments(doctorId);
  },

  async getUpcomingAppointmentCount(
    doctorId: number | string,
  ): Promise<number> {
    return doctorApi.getUpcomingAppointmentCount(doctorId);
  },

  async getDoctorAudit(doctorId: number | string) {
    return doctorApi.getDoctorAudit(doctorId);
  },
};
