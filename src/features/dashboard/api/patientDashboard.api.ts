import { apiClient } from "../../../lib/axios";
import type {
  DashboardApiResponse,
  PatientDashboardData,
  PatientDashboardAppointments,
  PatientAppointmentDetail,
  PatientPrescriptionSummary,
  PatientConsultationHistory,
  PatientBillWorkspace,
  PatientNotificationsResponse,
  PatientUnreadNotificationsResponse,
} from "../types/dashboard.types";

function unwrap<T>(response: { data: DashboardApiResponse<T> | T }): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as DashboardApiResponse<T>).data;
  }
  return body as T;
}

export const patientDashboardApi = {
  getDashboard: async (): Promise<PatientDashboardData> => {
    const res = await apiClient.get<DashboardApiResponse<PatientDashboardData>>(
      "/api/v1/patients/me/dashboard",
    );
    return unwrap(res);
  },

  getAppointments: async (): Promise<PatientDashboardAppointments> => {
    const res = await apiClient.get<DashboardApiResponse<PatientDashboardAppointments>>(
      "/api/v1/patients/me/appointments",
    );
    return unwrap(res);
  },

  getAppointmentById: async (appointmentId: string | number): Promise<PatientAppointmentDetail> => {
    const res = await apiClient.get<DashboardApiResponse<PatientAppointmentDetail>>(
      `/api/v1/appointments/${appointmentId}`,
    );
    return unwrap(res);
  },

  getPrescriptionSummary: async (): Promise<PatientPrescriptionSummary> => {
    const res = await apiClient.get<DashboardApiResponse<PatientPrescriptionSummary>>(
      "/api/v1/patients/me/prescriptions/summary",
    );
    return unwrap(res);
  },

  getConsultationHistory: async (): Promise<PatientConsultationHistory> => {
    const res = await apiClient.get<DashboardApiResponse<PatientConsultationHistory>>(
      "/api/v1/patients/me/consultations/history",
    );
    return unwrap(res);
  },

  getBillWorkspace: async (billId: string | number): Promise<PatientBillWorkspace> => {
    const res = await apiClient.get<DashboardApiResponse<PatientBillWorkspace>>(
      `/api/v1/billing/${billId}`,
    );
    return unwrap(res);
  },

  getNotifications: async (page = 0, size = 10): Promise<PatientNotificationsResponse> => {
    const res = await apiClient.get<DashboardApiResponse<PatientNotificationsResponse>>(
      `/api/v1/patients/me/notifications?page=${page}&size=${size}`,
    );
    return unwrap(res);
  },

  getUnreadNotificationsCount: async (): Promise<PatientUnreadNotificationsResponse> => {
    const res = await apiClient.get<DashboardApiResponse<PatientUnreadNotificationsResponse>>(
      "/api/v1/patients/me/notifications/unread-count",
    );
    return unwrap(res);
  },
};
