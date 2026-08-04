/**
 * useBilling – React Query hook for patient billing data
 */
import { useQuery } from "@tanstack/react-query";
import { billingService } from "../services/billing.service";

export const billingKeys = {
  all: ["patientBilling"] as const,
  list: (mrn: string) => [...billingKeys.all, "list", mrn] as const,
};

export function usePatientBilling(mrn: string) {
  const query = useQuery({
    queryKey: billingKeys.list(mrn),
    queryFn: () => billingService.getPatientBilling(mrn),
    enabled: !!mrn,
  });

  const summary = query.data
    ? billingService.calculateSummary(query.data)
    : { totalBilled: 0, totalPaid: 0, totalPending: 0, invoiceCount: 0 };

  return {
    invoices: query.data ?? [],
    summary,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
