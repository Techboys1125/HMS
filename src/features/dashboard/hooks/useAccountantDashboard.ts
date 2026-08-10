import { useQuery } from "@tanstack/react-query";
import { accountantDashboardApi } from "../api/accountantDashboard.api";

const accountantKeys = {
  all: ["accountant-dashboard"] as const,
  dashboard: () => [...accountantKeys.all, "dashboard"] as const,
  paymentMethods: () => [...accountantKeys.all, "payment-methods"] as const,
  recentTransactions: (limit: number) => [...accountantKeys.all, "recent-transactions", limit] as const,
};

export function useAccountantDashboard() {
  return useQuery({
    queryKey: accountantKeys.dashboard(),
    queryFn: accountantDashboardApi.getDashboard,
    refetchInterval: 30000,
  });
}

export function useAccountantPaymentMethods() {
  return useQuery({
    queryKey: accountantKeys.paymentMethods(),
    queryFn: accountantDashboardApi.getPaymentMethods,
    refetchInterval: 30000,
  });
}

export function useAccountantRecentTransactions(limit = 10) {
  return useQuery({
    queryKey: accountantKeys.recentTransactions(limit),
    queryFn: () => accountantDashboardApi.getRecentTransactions(limit),
    refetchInterval: 15000,
  });
}
