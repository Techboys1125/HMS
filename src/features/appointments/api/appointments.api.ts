import { apiClient, axios } from "../../../lib/axios";
import type { ApiResponse } from "../../auth/types/auth.types";
import type {
  AppointmentRecord,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  QueueActionResponse,
  LinkedPatient,
  OnboardingStatusResponse,
} from "../types/appointment.types";

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) {
      throw new Error(data.message);
    }
  }
  throw error;
};

export const appointmentsApi = {
  getAppointments: async (params?: {
    doctorId?: string | number;
    patientId?: string | number;
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const query = new URLSearchParams();
      if (params?.doctorId !== undefined)
        query.append("doctorId", String(params.doctorId));
      if (params?.patientId !== undefined)
        query.append("patientId", String(params.patientId));
      if (params?.date) query.append("date", params.date);
      if (params?.fromDate) query.append("fromDate", params.fromDate);
      if (params?.toDate) query.append("toDate", params.toDate);
      if (params?.status) query.append("status", params.status);
      if (params?.page !== undefined) query.append("page", String(params.page));
      if (params?.size !== undefined) query.append("size", String(params.size));
      if (params?.sort) query.append("sort", params.sort);

      const url = `/api/v1/appointments${query.toString() ? `?${query.toString()}` : ""}`;
      const response = await apiClient.get<ApiResponse<any>>(url);
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  createAppointment: async (
    data: CreateAppointmentRequest,
  ): Promise<ApiResponse<AppointmentRecord>> => {
    try {
      const response = await apiClient.post<ApiResponse<AppointmentRecord>>(
        "/api/v1/appointments",
        data,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getAppointmentById: async (
    appointmentId: string | number,
  ): Promise<ApiResponse<AppointmentRecord>> => {
    try {
      const response = await apiClient.get<ApiResponse<AppointmentRecord>>(
        `/api/v1/appointments/${appointmentId}`,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  rescheduleAppointment: async (
    appointmentId: string | number,
    data: RescheduleAppointmentRequest,
  ): Promise<ApiResponse<AppointmentRecord>> => {
    try {
      const response = await apiClient.post<ApiResponse<AppointmentRecord>>(
        `/api/v1/appointments/${appointmentId}/reschedule`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  cancelAppointment: async (
    appointmentId: string | number,
    data: CancelAppointmentRequest,
  ): Promise<ApiResponse<AppointmentRecord>> => {
    try {
      const response = await apiClient.patch<ApiResponse<AppointmentRecord>>(
        `/api/v1/appointments/${appointmentId}/cancel`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getDoctorAppointments: async (date?: string): Promise<ApiResponse<any>> => {
    try {
      const url = date
        ? `/api/v1/doctor/appointments?date=${encodeURIComponent(date)}`
        : "/api/v1/doctor/appointments";
      const response = await apiClient.get<ApiResponse<any>>(url);
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getDoctorAppointmentById: async (
    appointmentId: string | number,
  ): Promise<ApiResponse<AppointmentRecord>> => {
    try {
      const response = await apiClient.get<ApiResponse<AppointmentRecord>>(
        `/api/v1/doctor/appointments/${appointmentId}`,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  doctorStartConsultation: async (
    appointmentId: string | number,
  ): Promise<ApiResponse<AppointmentRecord>> => {
    try {
      const response = await apiClient.patch<ApiResponse<AppointmentRecord>>(
        `/api/v1/doctor/appointments/${appointmentId}/start`,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  doctorCompleteConsultation: async (
    appointmentId: string | number,
  ): Promise<ApiResponse<AppointmentRecord>> => {
    try {
      const response = await apiClient.patch<ApiResponse<AppointmentRecord>>(
        `/api/v1/doctor/appointments/${appointmentId}/complete`,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getPatientAppointments: async (
    patientId: string | number,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `/api/v1/patients/${patientId}/appointments`,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getLinkedPatients: async (): Promise<ApiResponse<LinkedPatient[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<LinkedPatient[]>>(
        "/api/v1/patients/linked",
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getOnboardingStatus: async (): Promise<
    ApiResponse<OnboardingStatusResponse>
  > => {
    try {
      const response = await apiClient.get<
        ApiResponse<OnboardingStatusResponse>
      >("/api/v1/patients/onboarding-status");
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  receptionCheckIn: async (
    appointmentId: string | number,
  ): Promise<ApiResponse<QueueActionResponse>> => {
    try {
      const response = await apiClient.patch<ApiResponse<QueueActionResponse>>(
        `/api/v1/reception/appointments/${appointmentId}/check-in`,
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  queueCallNext: async (
    doctorId?: string | number,
  ): Promise<ApiResponse<QueueActionResponse>> => {
    try {
      const url = doctorId
        ? `/api/v1/doctors/${doctorId}/queue/call-next`
        : "/api/v1/appointments/call-next";
      const response =
        await apiClient.post<ApiResponse<QueueActionResponse>>(url);
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getDepartments: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(
        "/api/v1/departments",
      );
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getDoctors: async (
    departmentId?: string | number,
  ): Promise<ApiResponse<any[]>> => {
    try {
      const url =
        departmentId !== undefined && departmentId !== null
          ? `/api/v1/doctors?departmentId=${encodeURIComponent(String(departmentId))}`
          : "/api/v1/doctors";
      const response = await apiClient.get<ApiResponse<any[]>>(url);
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },

  getAvailableSlots: async (
    doctorId: string | number,
    date: string,
  ): Promise<ApiResponse<any[]>> => {
    try {
      const url = `/api/v1/doctors/${doctorId}/slots?date=${encodeURIComponent(date)}`;
      const response = await apiClient.get<ApiResponse<any[]>>(url);
      return response.data;
    } catch (error: unknown) {
      handleApiError(error);
    }
  },
};

export default appointmentsApi;
