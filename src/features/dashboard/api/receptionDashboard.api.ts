import { apiClient } from "../../../lib/axios";
import type {
  DashboardApiResponse,
  ReceptionSummaryData,
  ReceptionRegistrationTrend,
  ReceptionAppointmentStatus,
  ReceptionPatientsByDepartment,
  ReceptionRegistrationCategories,
  ReceptionPerformanceSummary,
} from "../types/dashboard.types";

function unwrap<T>(response: { data: DashboardApiResponse<T> | T }): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as DashboardApiResponse<T>).data;
  }
  return body as T;
}

export const receptionDashboardApi = {
  getSummary: async (): Promise<ReceptionSummaryData> => {
    const res = await apiClient.get<DashboardApiResponse<ReceptionSummaryData>>(
      "/api/v1/reception/dashboard/summary",
    );
    return unwrap(res);
  },

  getRegistrationTrend: async (): Promise<ReceptionRegistrationTrend> => {
    const res = await apiClient.get<DashboardApiResponse<ReceptionRegistrationTrend>>(
      "/api/v1/reception/dashboard/registration-trend",
    );
    return unwrap(res);
  },

  getAppointmentStatus: async (): Promise<ReceptionAppointmentStatus> => {
    const res = await apiClient.get<DashboardApiResponse<ReceptionAppointmentStatus>>(
      "/api/v1/reception/dashboard/appointment-status",
    );
    return unwrap(res);
  },

  getPatientsByDepartment: async (): Promise<ReceptionPatientsByDepartment> => {
    const res = await apiClient.get<DashboardApiResponse<ReceptionPatientsByDepartment>>(
      "/api/v1/reception/dashboard/patients-by-department",
    );
    return unwrap(res);
  },

  getRegistrationCategories: async (): Promise<ReceptionRegistrationCategories> => {
    const res = await apiClient.get<DashboardApiResponse<ReceptionRegistrationCategories>>(
      "/api/v1/reception/dashboard/registration-categories",
    );
    return unwrap(res);
  },

  getPerformanceSummary: async (): Promise<ReceptionPerformanceSummary> => {
    const res = await apiClient.get<DashboardApiResponse<ReceptionPerformanceSummary>>(
      "/api/v1/reception/dashboard/performance-summary",
    );
    return unwrap(res);
  },
};
