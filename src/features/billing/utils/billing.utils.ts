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
  
  // Mappings to support flat properties (from simpler BillListItem) or nested summary (from detailed BillWorkspace)
  const netAmount = (bill as any).netAmount ?? bill.summary?.netAmount ?? 0;
  const paidAmount = 
    (bill as any).paidAmount ?? 
    bill.summary?.paidAmount ?? 
    (paymentStatus === "Paid" ? netAmount : paymentStatus === "Partially Paid" ? netAmount / 2 : 0);
  const balanceAmount = 
    (bill as any).balanceAmount ?? 
    bill.summary?.balanceAmount ?? 
    (netAmount - paidAmount);

  return {
    // Routes use the database bill id; billNumber is display-only.
    id: String(bill.billId ?? bill.id ?? bill.billNumber),
    billNumber: bill.billNumber,
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
    status: bill.status,
    appointmentId: bill.appointmentId,
    encounterId: bill.encounterId,
    patientId: bill.patientId,
    doctorId: bill.doctorId,
  };
}
