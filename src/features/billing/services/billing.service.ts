import { billingApi } from "../api/billing.api";
import type {
  BillListItem,
  BillWorkspace,
  BillCreatePayload,
  BillCreateResponse,
  BillItemPayload,
  BillDiscountPayload,
  BillSummary,
  BillFinalizeResponse,
  PaymentHistoryResponse,
  PaymentReceivePayload,
  PaymentReceiveResponse,
  ReceiptData,
  BillingDashboardSummary,
  OutstandingBill,
  PatientBillingHistory,
  DailyReport,
  PaymentModeReport,
  BillAuditResponse,
  InvoiceRecord,
  PaymentMethod,
  PaymentStatus,
} from "../types/billing.types";
import { mapApiBillToInvoiceRecord } from "../utils/billing.utils";

export const billingService = {
  // ── Bill CRUD ────────────────────────────────────────────────────────────

  async searchBills(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<{ bills: BillListItem[]; totalElements: number; totalPages: number }> {
    const response = await billingApi.searchBills(params);
    const data = response.data;
    return {
      bills: data.content,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
    };
  },

  async getBill(billId: number | string): Promise<BillWorkspace> {
    const response = await billingApi.getBill(billId);
    return response.data;
  },

  async createBill(payload: BillCreatePayload): Promise<BillCreateResponse> {
    const response = await billingApi.createBill(payload);
    return response.data;
  },

  async addBillItem(
    billId: number | string,
    payload: BillItemPayload,
  ): Promise<void> {
    await billingApi.addBillItem(billId, payload);
  },

  async updateBillItem(
    billId: number | string,
    itemId: number | string,
    quantity: number,
  ): Promise<void> {
    await billingApi.updateBillItem(billId, itemId, { quantity });
  },

  async deleteBillItem(
    billId: number | string,
    itemId: number | string,
  ): Promise<void> {
    await billingApi.deleteBillItem(billId, itemId);
  },

  async applyDiscount(
    billId: number | string,
    payload: BillDiscountPayload,
  ): Promise<void> {
    await billingApi.applyDiscount(billId, payload);
  },

  async getBillSummary(billId: number | string): Promise<BillSummary> {
    const response = await billingApi.getBillSummary(billId);
    return response.data;
  },

  async finalizeBill(billId: number | string): Promise<BillFinalizeResponse> {
    const response = await billingApi.finalizeBill(billId);
    return response.data;
  },

  async cancelBill(
    billId: number | string,
    reason?: string,
  ): Promise<void> {
    await billingApi.cancelBill(billId, reason ? { reason } : undefined);
  },

  async voidBill(
    billId: number | string,
    reason: string,
  ): Promise<void> {
    await billingApi.voidBill(billId, { reason });
  },

  // ── Payments ─────────────────────────────────────────────────────────────

  async getPaymentHistory(billId: number | string): Promise<PaymentHistoryResponse> {
    const response = await billingApi.getPaymentHistory(billId);
    return response.data;
  },

  async receivePayment(
    billId: number | string,
    payload: PaymentReceivePayload,
  ): Promise<PaymentReceiveResponse> {
    const response = await billingApi.receivePayment(billId, payload);
    return response.data;
  },

  async processRefund(
    billId: number | string,
    amount: number,
    reason: string,
  ): Promise<void> {
    await billingApi.processRefund(billId, { amount, reason });
  },

  // ── Receipts ─────────────────────────────────────────────────────────────

  async getReceipt(billId: number | string): Promise<ReceiptData> {
    const response = await billingApi.getReceipt(billId);
    return response.data;
  },

  async reprintReceipt(billId: number | string): Promise<ReceiptData> {
    const response = await billingApi.reprintReceipt(billId);
    return response.data;
  },

  // ── Dashboard ────────────────────────────────────────────────────────────

  async getDashboardSummary(params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<BillingDashboardSummary> {
    const response = await billingApi.getDashboardSummary(params);
    return response.data;
  },

  async getOutstanding(): Promise<{
    totalOutstanding: number;
    bills: OutstandingBill[];
  }> {
    const response = await billingApi.getOutstanding();
    return response.data;
  },

  // ── Patient Billing ──────────────────────────────────────────────────────

  async getPatientBilling(mrn: string): Promise<InvoiceRecord[]> {
    const response = await billingApi.getPatientBilling(mrn);
    const data = response.data;
    return data.bills.map((bill) =>
      mapApiBillToInvoiceRecord({
        id: bill.billId,
        billNumber: bill.billNumber,
        patientName: data.patientName,
        patientMrn: data.mrn,
        status: bill.billStatus,
        paymentStatus: bill.paymentStatus,
        summary: {
          grossAmount: bill.amount,
          discountAmount: 0,
          taxAmount: 0,
          netAmount: bill.amount,
          paidAmount:
            bill.paymentStatus === "PAID"
              ? bill.amount
              : bill.paymentStatus === "PARTIALLY_PAID"
                ? bill.amount / 2
                : 0,
          balanceAmount:
            bill.paymentStatus === "PAID"
              ? 0
              : bill.amount,
        },
      }),
    );
  },

  // ── Reports ──────────────────────────────────────────────────────────────

  async getDailyReport(): Promise<DailyReport> {
    const response = await billingApi.getDailyReport();
    return response.data;
  },

  async getPaymentModesReport(): Promise<PaymentModeReport> {
    const response = await billingApi.getPaymentModesReport();
    return response.data;
  },

  // ── Audit ────────────────────────────────────────────────────────────────

  async getBillAudit(billId: number | string): Promise<BillAuditResponse> {
    const response = await billingApi.getBillAudit(billId);
    return response.data;
  },

  // ── Legacy helpers (for backward compat) ─────────────────────────────────

  mapBillToInvoice(bill: BillListItem): InvoiceRecord {
    return mapApiBillToInvoiceRecord(bill);
  },

  mapBillsToInvoices(bills: BillListItem[]): InvoiceRecord[] {
    return bills.map(mapApiBillToInvoiceRecord);
  },

  calculateSummary(invoices: InvoiceRecord[]) {
    let totalBilled = 0;
    let totalPaid = 0;
    let totalPending = 0;

    invoices.forEach((inv) => {
      totalBilled += inv.invoiceAmount;
      totalPaid += inv.paidAmount;
      totalPending += inv.balance;
    });

    return {
      totalBilled,
      totalPaid,
      totalPending,
      invoiceCount: invoices.length,
    };
  },
};
