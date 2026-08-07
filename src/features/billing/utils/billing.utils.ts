import type { ApiPatientInvoice, BillListItem, InvoiceRecord } from "../types/billing.types";

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString()}`;
}

export function mapApiInvoiceToInvoiceRecord(
  apiInv: ApiPatientInvoice,
  patientName: string,
  mrn: string
): InvoiceRecord {
  const amount =
    typeof apiInv.amount === "number"
      ? apiInv.amount
      : parseFloat(String(apiInv.amount || "0").replace(/[^0-9.]/g, "")) || 0;

  const status = mapApiStatusToPaymentStatus(apiInv.status || "Pending");

  return {
    id: String(apiInv.invoiceNumber || apiInv.id),
    invoiceDate: apiInv.date || "N/A",
    patientName: patientName,
    mrn: mrn,
    mobile: "N/A",
    doctorName: "N/A",
    department: "N/A",
    invoiceAmount: amount,
    paidAmount: status === "Paid" ? amount : status === "Partially Paid" ? amount / 2 : 0,
    balance: status === "Paid" ? 0 : amount,
    paymentMethod: "UPI",
    paymentStatus: status,
    collectedBy: "System",
  };
}

export function mapApiStatusToPaymentStatus(status: string): InvoiceRecord["paymentStatus"] {
  const s = status.toUpperCase();
  if (s === "PAID") return "Paid";
  if (s === "PENDING" || s === "UNPAID") return "Pending";
  if (s === "PARTIALLY_PAID" || s === "PARTIALLY PAID") return "Partially Paid";
  if (s === "CANCELLED") return "Cancelled";
  if (s === "REFUNDED") return "Refunded";
  return "Pending";
}

export function mapApiBillToInvoiceRecord(bill: BillListItem): InvoiceRecord {
  const paymentStatus = mapApiStatusToPaymentStatus(bill.paymentStatus);
  const netAmount = bill.summary?.netAmount ?? 0;
  const paidAmount = bill.summary?.paidAmount ?? 0;
  const balanceAmount = bill.summary?.balanceAmount ?? netAmount;
  return {
    id: bill.billNumber || String(bill.id),
    invoiceDate: bill.createdAt
      ? new Date(bill.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    patientName: bill.patientName,
    mrn: bill.patientMrn,
    mobile: "N/A",
    doctorName: bill.doctorName || "N/A",
    department: "OPD",
    invoiceAmount: netAmount,
    paidAmount,
    balance: balanceAmount,
    paymentMethod: "UPI",
    paymentStatus,
    collectedBy: "System",
  };
}
