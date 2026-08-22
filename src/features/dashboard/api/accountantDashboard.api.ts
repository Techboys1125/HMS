import { apiClient } from "../../../lib/axios";
import type {
  DashboardApiResponse,
  AccountantDashboardData,
  AccountantPaymentMethods,
  AccountantTransaction,
} from "../types/dashboard.types";

function unwrap<T>(response: { data: DashboardApiResponse<T> | T }): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as DashboardApiResponse<T>).data;
  }
  return body as T;
}

export const accountantDashboardApi = {
  getDashboard: async (): Promise<AccountantDashboardData> => {
    const res = await apiClient.get<
      DashboardApiResponse<AccountantDashboardData>
    >("/api/v1/accountant/dashboard");
    return unwrap(res);
  },

  getPaymentMethods: async (): Promise<AccountantPaymentMethods[]> => {
    const res = await apiClient.get<
      DashboardApiResponse<AccountantPaymentMethods[]>
    >("/api/v1/accountant/dashboard/payment-methods");
    return unwrap(res);
  },

  getRecentTransactions: async (
    limit = 10,
  ): Promise<AccountantTransaction[]> => {
    const res = await apiClient.get<
      DashboardApiResponse<AccountantTransaction[]>
    >(`/api/v1/accountant/dashboard/recent-transactions?limit=${limit}`);
    return unwrap(res);
  },
};
