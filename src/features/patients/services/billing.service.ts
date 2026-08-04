/**
 * Billing Service – Patient billing data operations
 * Wraps existing billing API with data mapping
 */
import { patientsApi } from "../api/patient.api";
import type { ApiPatientInvoice } from "../types/patient.types";

export interface BillingSummary {
  totalBilled: number;
  totalPaid: number;
  totalPending: number;
  invoiceCount: number;
}

export const billingService = {
  /**
   * Get billing records for a patient
   * GET /api/v1/billing/patient/{mrn}
   */
  async getPatientBilling(mrn: string): Promise<ApiPatientInvoice[]> {
    return patientsApi.getBilling(mrn);
  },

  /**
   * Calculate billing summary from invoices
   */
  calculateSummary(invoices: ApiPatientInvoice[]): BillingSummary {
    let totalBilled = 0;
    let totalPaid = 0;
    let totalPending = 0;

    invoices.forEach((inv) => {
      const amount =
        typeof inv.amount === "number"
          ? inv.amount
          : parseFloat(String(inv.amount || "0").replace(/[^0-9.]/g, "")) || 0;

      totalBilled += amount;
      if (inv.status === "Paid" || inv.status === "PAID") {
        totalPaid += amount;
      } else {
        totalPending += amount;
      }
    });

    return {
      totalBilled,
      totalPaid,
      totalPending,
      invoiceCount: invoices.length,
    };
  },
};
