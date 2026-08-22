import { apiClient } from "../../../lib/axios";
import type {
  ReceptionActivityLogResponse,
  ReceptionAppointmentStatusData,
  ReceptionCheckinAnalyticsData,
  ReceptionDashboardSummaryData,
  ReceptionQueuePerformanceData,
  ReceptionRegisterResponse,
  ReceptionRegistrationTrendData,
  ReceptionSummaryWidgetData,
} from "../types/receptionReports.types";

interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  timestamp?: string;
  data: T;
}

function unwrap<T>(res: { data: ApiEnvelope<T> | T }): T {
  const body = res.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&")
  );
}

export const receptionReportsApi = {
  // 1. Activity Log
  getActivityLog: async (params?: {
    date?: string;
    page?: number;
    size?: number;
  }): Promise<ReceptionActivityLogResponse> => {
    const qs = buildQuery({
      date: params?.date,
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    });
    const res = await apiClient.get<ApiEnvelope<ReceptionActivityLogResponse>>(
      `/api/v1/reception/reports/activity-log${qs}`,
    );
    return unwrap(res);
  },

  // 2. Appointment Status Distribution
  getAppointmentStatus: async (
    date?: string,
  ): Promise<ReceptionAppointmentStatusData> => {
    const qs = buildQuery({ date });
    const res = await apiClient.get<
      ApiEnvelope<ReceptionAppointmentStatusData>
    >(`/api/v1/reception/reports/appointment-status${qs}`);
    return unwrap(res);
  },

  // 3. Check-in Analytics
  getCheckinAnalytics: async (
    date?: string,
  ): Promise<ReceptionCheckinAnalyticsData> => {
    const qs = buildQuery({ date });
    const res = await apiClient.get<ApiEnvelope<ReceptionCheckinAnalyticsData>>(
      `/api/v1/reception/reports/checkin-analytics${qs}`,
    );
    return unwrap(res);
  },

  // 4. Reception Dashboard Summary
  getDashboardSummary: async (
    date?: string,
  ): Promise<ReceptionDashboardSummaryData> => {
    const qs = buildQuery({ date });
    const res = await apiClient.get<ApiEnvelope<ReceptionDashboardSummaryData>>(
      `/api/v1/reception/reports/dashboard${qs}`,
    );
    return unwrap(res);
  },

  // 5. Queue Performance
  getQueuePerformance: async (
    date?: string,
  ): Promise<ReceptionQueuePerformanceData> => {
    const qs = buildQuery({ date });
    const res = await apiClient.get<ApiEnvelope<ReceptionQueuePerformanceData>>(
      `/api/v1/reception/reports/queue-performance${qs}`,
    );
    return unwrap(res);
  },

  // 6. Recent Reception Register
  getRegister: async (params?: {
    date?: string;
    page?: number;
    size?: number;
  }): Promise<ReceptionRegisterResponse> => {
    const qs = buildQuery({
      date: params?.date,
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    });
    const res = await apiClient.get<ApiEnvelope<ReceptionRegisterResponse>>(
      `/api/v1/reception/reports/register${qs}`,
    );
    return unwrap(res);
  },

  // 7. Patient Registration Trend
  getRegistrationTrend: async (params?: {
    from?: string;
    to?: string;
  }): Promise<ReceptionRegistrationTrendData> => {
    const qs = buildQuery({
      from: params?.from,
      to: params?.to,
    });
    const res = await apiClient.get<
      ApiEnvelope<ReceptionRegistrationTrendData>
    >(`/api/v1/reception/reports/registration-trend${qs}`);
    return unwrap(res);
  },

  // 8. Reception Summary Widget
  getSummaryWidget: async (
    date?: string,
  ): Promise<ReceptionSummaryWidgetData> => {
    const qs = buildQuery({ date });
    const res = await apiClient.get<ApiEnvelope<ReceptionSummaryWidgetData>>(
      `/api/v1/reception/reports/summary${qs}`,
    );
    return unwrap(res);
  },
};
