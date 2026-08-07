import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "../services/billing.service";
import type {
  InvoiceRecord,
  BillWorkspace,
  BillSummary,
  PaymentReceiveResponse,
  BillingDashboardSummary,
  BillingConfiguration,
  PaymentMethod,
} from "../types/billing.types";

export const billingKeys = {
  all: ["billing"] as const,
  list: (page?: number, size?: number) =>
    [...billingKeys.all, "list", page, size] as const,
  detail: (billId: number | string) =>
    [...billingKeys.all, "detail", billId] as const,
  summary: (billId: number | string) =>
    [...billingKeys.all, "summary", billId] as const,
  payments: (billId: number | string) =>
    [...billingKeys.all, "payments", billId] as const,
  receipt: (billId: number | string) =>
    [...billingKeys.all, "receipt", billId] as const,
  dashboard: (params?: { fromDate?: string; toDate?: string }) =>
    [...billingKeys.all, "dashboard", params] as const,
  patient: (mrn: string) => [...billingKeys.all, "patient", mrn] as const,
  outstanding: () => [...billingKeys.all, "outstanding"] as const,
  audit: (billId: number | string) =>
    [...billingKeys.all, "audit", billId] as const,
};

// ── useBilling ──────────────────────────────────────────────────────────────

export function useBilling(patientMrn?: string) {
  const patientQuery = useQuery({
    queryKey: billingKeys.patient(patientMrn || ""),
    queryFn: () => billingService.getPatientBilling(patientMrn || ""),
    enabled: !!patientMrn,
  });

  return {
    invoices: patientMrn ? (patientQuery.data || []) : [],
    loading: patientMrn ? patientQuery.isLoading : false,
    refetch: () => {
      if (patientMrn) patientQuery.refetch();
    },
  };
}

// ── useBillingList ──────────────────────────────────────────────────────────

export function useBillingList(params?: {
  page?: number;
  size?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: billingKeys.list(params?.page, params?.size),
    queryFn: () => billingService.searchBills(params),
  });
}

// ── useInvoice ──────────────────────────────────────────────────────────────

export function useInvoice(billId?: number | string) {
  const queryClient = useQueryClient();

  const billQuery = useQuery({
    queryKey: billingKeys.detail(billId || ""),
    queryFn: () => billingService.getBill(billId!),
    enabled: !!billId,
  });

  const summaryQuery = useQuery({
    queryKey: billingKeys.summary(billId || ""),
    queryFn: () => billingService.getBillSummary(billId!),
    enabled: !!billId,
  });

  const createBillMutation = useMutation({
    mutationFn: billingService.createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  const finalizeBillMutation = useMutation({
    mutationFn: (id: number | string) => billingService.finalizeBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  const cancelBillMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      billingService.cancelBill(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  const addBillItemMutation = useMutation({
    mutationFn: ({
      billId,
      payload,
    }: {
      billId: number | string;
      payload: { serviceId: string; quantity: number };
    }) => billingService.addBillItem(billId, payload),
    onSuccess: () => {
      if (billId) {
        queryClient.invalidateQueries({ queryKey: billingKeys.detail(billId) });
        queryClient.invalidateQueries({ queryKey: billingKeys.summary(billId) });
      }
    },
  });

  const deleteBillItemMutation = useMutation({
    mutationFn: ({
      billId,
      itemId,
    }: {
      billId: number | string;
      itemId: number | string;
    }) => billingService.deleteBillItem(billId, itemId),
    onSuccess: () => {
      if (billId) {
        queryClient.invalidateQueries({ queryKey: billingKeys.detail(billId) });
        queryClient.invalidateQueries({ queryKey: billingKeys.summary(billId) });
      }
    },
  });

  const voidBillMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason: string }) =>
      billingService.voidBill(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  const refundMutation = useMutation({
    mutationFn: ({
      billId,
      amount,
      reason,
    }: {
      billId: number | string;
      amount: number;
      reason: string;
    }) => billingService.processRefund(billId, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  const reprintReceiptMutation = useMutation({
    mutationFn: (id: number | string) => billingService.reprintReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  return {
    bill: billQuery.data?.bill || null,
    summary: summaryQuery.data || null,
    isLoading: billQuery.isLoading,
    isError: billQuery.isError,
    error: billQuery.error,

    createBill: createBillMutation.mutateAsync,
    isCreating: createBillMutation.isPending,

    finalizeBill: finalizeBillMutation.mutateAsync,
    isFinalizing: finalizeBillMutation.isPending,

    cancelBill: cancelBillMutation.mutateAsync,
    isCancelling: cancelBillMutation.isPending,

    voidBill: voidBillMutation.mutateAsync,
    isVoiding: voidBillMutation.isPending,

    refund: refundMutation.mutateAsync,
    isRefunding: refundMutation.isPending,

    reprintReceipt: reprintReceiptMutation.mutateAsync,
    isReprinting: reprintReceiptMutation.isPending,

    addBillItem: addBillItemMutation.mutateAsync,
    isAddingItem: addBillItemMutation.isPending,

    deleteBillItem: deleteBillItemMutation.mutateAsync,
    isDeletingItem: deleteBillItemMutation.isPending,

    refetch: () => {
      billQuery.refetch();
      summaryQuery.refetch();
    },
  };
}

// ── usePayment ──────────────────────────────────────────────────────────────

export function usePayment(billId?: number | string) {
  const queryClient = useQueryClient();

  const paymentHistoryQuery = useQuery({
    queryKey: billingKeys.payments(billId || ""),
    queryFn: () => billingService.getPaymentHistory(billId!),
    enabled: !!billId,
  });

  const receivePaymentMutation = useMutation({
    mutationFn: ({
      billId,
      payments,
      remarks,
    }: {
      billId: number | string;
      payments: Array<{ method: string; amount: number; referenceNumber?: string }>;
      remarks?: string;
    }) => billingService.receivePayment(billId, { payments, remarks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  const processRefundMutation = useMutation({
    mutationFn: ({
      billId,
      amount,
      reason,
    }: {
      billId: number | string;
      amount: number;
      reason: string;
    }) => billingService.processRefund(billId, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });

  return {
    paymentHistory: paymentHistoryQuery.data || null,
    isLoading: paymentHistoryQuery.isLoading,

    receivePayment: receivePaymentMutation.mutateAsync,
    isReceiving: receivePaymentMutation.isPending,
    receivePaymentError: receivePaymentMutation.error,

    processRefund: processRefundMutation.mutateAsync,
    isRefunding: processRefundMutation.isPending,

    refetch: () => paymentHistoryQuery.refetch(),
  };
}

// ── useReceipt ──────────────────────────────────────────────────────────────

export function useReceipt(billId?: number | string) {
  const receiptQuery = useQuery({
    queryKey: billingKeys.receipt(billId || ""),
    queryFn: () => billingService.getReceipt(billId!),
    enabled: !!billId,
  });

  return {
    receipt: receiptQuery.data || null,
    isLoading: receiptQuery.isLoading,
    refetch: () => receiptQuery.refetch(),
  };
}

// ── useBillingDashboard ─────────────────────────────────────────────────────

export function useBillingDashboard(params?: {
  fromDate?: string;
  toDate?: string;
}) {
  return useQuery({
    queryKey: billingKeys.dashboard(params),
    queryFn: () => billingService.getDashboardSummary(params),
  });
}

// ── useBillingConfiguration ─────────────────────────────────────────────────

const BILLING_CONFIG_KEY = "hms-billing-configuration";

function loadBillingConfig(): BillingConfiguration | null {
  try {
    const raw = localStorage.getItem(BILLING_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

function saveBillingConfig(config: BillingConfiguration) {
  localStorage.setItem(BILLING_CONFIG_KEY, JSON.stringify(config));
}

export function useBillingConfiguration() {
  const [configuration, setConfiguration] = useState<BillingConfiguration | null>(
    () => loadBillingConfig(),
  );

  const saveConfiguration = (config: BillingConfiguration) => {
    saveBillingConfig(config);
    setConfiguration(config);
  };

  return {
    configuration,
    saveConfiguration,
  };
}

// ── useBillingReport ────────────────────────────────────────────────────────

export function useBillingReport(invoices: InvoiceRecord[]) {
  const summary = billingService.calculateSummary(invoices);

  const totalBilled = summary.totalBilled;
  const totalPaid = summary.totalPaid;
  const totalPending = summary.totalPending;

  const byDepartment: { [key: string]: number } = {};
  const byPaymentMethod: { [key: string]: number } = {};

  invoices.forEach((inv) => {
    byDepartment[inv.department] =
      (byDepartment[inv.department] || 0) + inv.invoiceAmount;
    byPaymentMethod[inv.paymentMethod] =
      (byPaymentMethod[inv.paymentMethod] || 0) + inv.paidAmount;
  });

  return {
    summary,
    totalBilled,
    totalPaid,
    totalPending,
    byDepartment,
    byPaymentMethod,
  };
}
