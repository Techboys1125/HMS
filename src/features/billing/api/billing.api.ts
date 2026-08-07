import { apiClient, axios } from "../../../lib/axios";

// ─── Shared Response Wrapper ────────────────────────────────────────────────
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

// ─── Bill Types ─────────────────────────────────────────────────────────────
export interface BillListItem {
  id: number;
  billNumber: string;
  patientName: string;
  mrn: string;
  status: string;
  paymentStatus: string;
  netAmount: number;
}

export interface BillCreatePayload {
  appointmentId: number;
  encounterId: number;
  patientMrn: string;
  doctorId: number;
}

export interface BillCreateResponse {
  billId: number;
  billNumber: string;
  status: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  balanceAmount: number;
}

export interface BillWorkspace {
  bill: {
    id: number;
    billNumber: string;
    status: string;
    patientMrn: string;
    patientName: string;
    doctorName: string;
    items: BillItem[];
    netAmount: number;
  };
}

export interface BillItem {
  id: number;
  serviceName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface BillItemPayload {
  serviceId: string;
  quantity: number;
}

export interface BillDiscountPayload {
  discountType: "PERCENTAGE" | "FIXED";
  value: number;
  reason: string;
}

export interface BillSummary {
  billId: number;
  billNumber: string;
  status: {
    billStatus: string;
    paymentStatus: string;
  };
  amount: {
    grossAmount: number;
    discountAmount: number;
    taxAmount: number;
    roundOff: number;
    netAmount: number;
    paidAmount: number;
    balanceAmount: number;
  };
}

export interface BillFinalizeResponse {
  billNumber: string;
  status: string;
  netAmount: number;
}

// ─── Payment Types ──────────────────────────────────────────────────────────
export interface PaymentEntry {
  method: string;
  amount: number;
  referenceNumber?: string;
}

export interface PaymentHistoryResponse {
  billId: number;
  billNumber: string;
  paymentSummary: {
    netAmount: number;
    paidAmount: number;
    balanceAmount: number;
    refundedAmount: number;
  };
  payments: Array<{
    id?: number;
    method: string;
    amount: number;
    referenceNumber?: string;
    paidAt?: string;
    remarks?: string;
  }>;
}

export interface PaymentReceivePayload {
  payments: PaymentEntry[];
  remarks?: string;
}

export interface PaymentReceiveResponse {
  receiptNumber: string;
  paymentStatus: string;
  totalPaid: number;
  balance: number;
}

// ─── Receipt Types ──────────────────────────────────────────────────────────
export interface ReceiptData {
  receiptNumber: string;
  billNumber: string;
  patientName: string;
  mrn: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  totalPaid: number;
  balance: number;
  payments: PaymentEntry[];
}

// ─── Dashboard Types ────────────────────────────────────────────────────────
export interface BillingDashboardData {
  summary: {
    readyForBilling: number;
    draft: number;
    finalized: number;
    unpaid: number;
    partiallyPaid: number;
    cancelled: number;
    voided: number;
    todayRevenue: number;
    todayCollections: number;
    outstanding: number;
  };
  filters: {
    fromDate: string;
    toDate: string;
  };
}

export interface BillingDashboardSummary {
  readyForBilling: number;
  draft: number;
  finalized: number;
  unpaid: number;
  partiallyPaid: number;
  todayRevenue: number;
  todayCollections: number;
  outstanding: number;
}

// ─── Outstanding Types ──────────────────────────────────────────────────────
export interface OutstandingBill {
  billId: number;
  billNumber: string;
  patientName: string;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
}

// ─── Patient Billing Types ──────────────────────────────────────────────────
export interface PatientBillingHistory {
  mrn: string;
  patientName: string;
  summary: {
    totalBills: number;
    totalPaid: number;
    totalOutstanding: number;
  };
  bills: Array<{
    billId: number;
    billNumber: string;
    billStatus: string;
    paymentStatus: string;
    amount: number;
  }>;
}

// ─── Report Types ───────────────────────────────────────────────────────────
export interface DailyReport {
  date: string;
  billSummary: {
    totalBills: number;
    totalRevenue: number;
  };
  collection: {
    cash: number;
    upi: number;
    card: number;
    total: number;
  };
  outstanding: number;
}

export interface PaymentModeReport {
  period: {
    from: string;
    to: string;
  };
  paymentModes: Array<{
    method: string;
    transactionCount: number;
    amount: number;
  }>;
  totalCollection: number;
}

// ─── Audit Types ────────────────────────────────────────────────────────────
export interface BillAuditLog {
  action: string;
  newValue: string;
}

export interface BillAuditResponse {
  billId: number;
  auditLogs: BillAuditLog[];
}

// ─── Paginated Response ─────────────────────────────────────────────────────
interface PaginatedData<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

// ─── BILLING API CLIENT ─────────────────────────────────────────────────────
export const billingApi = {
  // ── 1. Search & Filter Bills ────────────────────────────────────────────
  async searchBills(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<ApiResponse<PaginatedData<BillListItem>>> {
    try {
      const query = new URLSearchParams();
      if (params?.page != null) query.set("page", String(params.page));
      if (params?.size != null) query.set("size", String(params.size));
      if (params?.sort) query.set("sort", params.sort);
      const qs = query.toString();
      const response = await apiClient.get<ApiResponse<PaginatedData<BillListItem>>>(
        `/api/v1/billing${qs ? `?${qs}` : ""}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 2. Create New Bill ─────────────────────────────────────────────────
  async createBill(payload: BillCreatePayload): Promise<ApiResponse<BillCreateResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<BillCreateResponse>>(
        "/api/v1/billing",
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 3. Load Billing Workspace ──────────────────────────────────────────
  async getBill(billId: number | string): Promise<ApiResponse<BillWorkspace>> {
    try {
      const response = await apiClient.get<ApiResponse<BillWorkspace>>(
        `/api/v1/billing/${billId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 4. Add Bill Item ───────────────────────────────────────────────────
  async addBillItem(
    billId: number | string,
    payload: BillItemPayload,
  ): Promise<ApiResponse<BillItem>> {
    try {
      const response = await apiClient.post<ApiResponse<BillItem>>(
        `/api/v1/billing/${billId}/items`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 5. Update Bill Item ────────────────────────────────────────────────
  async updateBillItem(
    billId: number | string,
    itemId: number | string,
    payload: { quantity: number },
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.put<ApiResponse<unknown>>(
        `/api/v1/billing/${billId}/items/${itemId}`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 6. Delete Bill Item ────────────────────────────────────────────────
  async deleteBillItem(
    billId: number | string,
    itemId: number | string,
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.delete<ApiResponse<unknown>>(
        `/api/v1/billing/${billId}/items/${itemId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 7. Apply Discount ──────────────────────────────────────────────────
  async applyDiscount(
    billId: number | string,
    payload: BillDiscountPayload,
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        `/api/v1/billing/${billId}/discount`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 8. View Bill Summary ───────────────────────────────────────────────
  async getBillSummary(billId: number | string): Promise<ApiResponse<BillSummary>> {
    try {
      const response = await apiClient.get<ApiResponse<BillSummary>>(
        `/api/v1/billing/${billId}/summary`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 9. Finalize Bill ──────────────────────────────────────────────────
  async finalizeBill(billId: number | string): Promise<ApiResponse<BillFinalizeResponse>> {
    try {
      const response = await apiClient.patch<ApiResponse<BillFinalizeResponse>>(
        `/api/v1/billing/${billId}/finalize`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 10. Payment History ────────────────────────────────────────────────
  async getPaymentHistory(billId: number | string): Promise<ApiResponse<PaymentHistoryResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<PaymentHistoryResponse>>(
        `/api/v1/billing/${billId}/payments`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 11. Receive Payment ────────────────────────────────────────────────
  async receivePayment(
    billId: number | string,
    payload: PaymentReceivePayload,
  ): Promise<ApiResponse<PaymentReceiveResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<PaymentReceiveResponse>>(
        `/api/v1/billing/${billId}/payments`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 12. Generate Receipt ───────────────────────────────────────────────
  async getReceipt(billId: number | string): Promise<ApiResponse<ReceiptData>> {
    try {
      const response = await apiClient.get<ApiResponse<ReceiptData>>(
        `/api/v1/billing/${billId}/receipt`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 13. Reprint Receipt ────────────────────────────────────────────────
  async reprintReceipt(billId: number | string): Promise<ApiResponse<ReceiptData>> {
    try {
      const response = await apiClient.post<ApiResponse<ReceiptData>>(
        `/api/v1/billing/${billId}/receipt/reprint`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 14. Process Refund ─────────────────────────────────────────────────
  async processRefund(
    billId: number | string,
    payload: { amount: number; reason: string },
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        `/api/v1/billing/${billId}/refund`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 15. Cancel Draft Bill ──────────────────────────────────────────────
  async cancelBill(
    billId: number | string,
    payload?: { reason?: string },
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        `/api/v1/billing/${billId}/cancel`,
        payload || {},
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 16. Void Finalized Bill ────────────────────────────────────────────
  async voidBill(
    billId: number | string,
    payload: { reason: string },
  ): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        `/api/v1/billing/${billId}/void`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 17. Billing Dashboard ──────────────────────────────────────────────
  async getDashboard(params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<ApiResponse<BillingDashboardData>> {
    try {
      const query = new URLSearchParams();
      if (params?.fromDate) query.set("fromDate", params.fromDate);
      if (params?.toDate) query.set("toDate", params.toDate);
      const qs = query.toString();
      const response = await apiClient.get<ApiResponse<BillingDashboardData>>(
        `/api/v1/billing/dashboard${qs ? `?${qs}` : ""}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 18. Dashboard Summary ──────────────────────────────────────────────
  async getDashboardSummary(params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<ApiResponse<BillingDashboardSummary>> {
    try {
      const query = new URLSearchParams();
      if (params?.fromDate) query.set("fromDate", params.fromDate);
      if (params?.toDate) query.set("toDate", params.toDate);
      const qs = query.toString();
      const response = await apiClient.get<ApiResponse<BillingDashboardSummary>>(
        `/api/v1/billing/dashboard/summary${qs ? `?${qs}` : ""}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 19. Outstanding Bills ──────────────────────────────────────────────
  async getOutstanding(): Promise<
    ApiResponse<{ totalOutstanding: number; bills: OutstandingBill[] }>
  > {
    try {
      const response = await apiClient.get<
        ApiResponse<{ totalOutstanding: number; bills: OutstandingBill[] }>
      >("/api/v1/billing/outstanding");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 20. Patient Billing History ────────────────────────────────────────
  async getPatientBilling(mrn: string): Promise<ApiResponse<PatientBillingHistory>> {
    try {
      const response = await apiClient.get<ApiResponse<PatientBillingHistory>>(
        `/api/v1/billing/patient/${mrn}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 21. Daily Collection Report ────────────────────────────────────────
  async getDailyReport(): Promise<ApiResponse<DailyReport>> {
    try {
      const response = await apiClient.get<ApiResponse<DailyReport>>(
        "/api/v1/billing/reports/daily",
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 22. Payment Modes Report ───────────────────────────────────────────
  async getPaymentModesReport(): Promise<ApiResponse<PaymentModeReport>> {
    try {
      const response = await apiClient.get<ApiResponse<PaymentModeReport>>(
        "/api/v1/billing/reports/payment-modes",
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },

  // ── 23. Bill Audit History ─────────────────────────────────────────────
  async getBillAudit(billId: number | string): Promise<ApiResponse<BillAuditResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<BillAuditResponse>>(
        `/api/v1/billing/${billId}/audit`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) throw new Error(data.message, { cause: error });
      }
      throw error;
    }
  },
};
