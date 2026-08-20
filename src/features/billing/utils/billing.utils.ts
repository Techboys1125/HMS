import type {
  ApiPatientInvoice,
  BillListItem,
  InvoiceRecord,
  PaymentMethod,
} from "../types/billing.types";

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString()}`;
}

export function mapApiInvoiceToInvoiceRecord(
  apiInv: ApiPatientInvoice,
  patientName: string,
  mrn: string,
): InvoiceRecord {
  const amount =
    typeof apiInv.amount === "number"
      ? apiInv.amount
      : parseFloat(String(apiInv.amount || "0").replace(/[^0-9.]/g, "")) || 0;

  const status = mapApiStatusToPaymentStatus(apiInv.status || "Pending");

  const invAny = apiInv as ApiPatientInvoice & {
    paidAmount?: number;
    balance?: number;
    balanceAmount?: number;
    mobile?: string;
    doctorName?: string;
    department?: string;
    paymentMethod?: PaymentMethod;
    collectedBy?: string;
  };
  const paidAmount =
    typeof invAny.paidAmount === "number"
      ? invAny.paidAmount
      : status === "Paid"
        ? amount
        : 0;
  const balance =
    typeof invAny.balance === "number"
      ? invAny.balance
      : typeof invAny.balanceAmount === "number"
        ? invAny.balanceAmount
        : status === "Paid"
          ? 0
          : Math.max(0, amount - paidAmount);

  return {
    id: String(apiInv.invoiceNumber || apiInv.id),
    invoiceDate: apiInv.date || "N/A",
    patientName: patientName,
    mrn: mrn,
    mobile: invAny.mobile || "",
    doctorName: invAny.doctorName || "",
    department: invAny.department || "",
    invoiceAmount: amount,
    paidAmount,
    balance,
    paymentMethod: invAny.paymentMethod || "Cash",
    paymentStatus: status,
    collectedBy: invAny.collectedBy || "",
  };
}

export function mapApiStatusToPaymentStatus(
  status: string,
): InvoiceRecord["paymentStatus"] {
  const s = status.toUpperCase();
  if (s === "PAID") return "Paid";
  if (s === "PENDING" || s === "UNPAID") return "Pending";
  if (s === "PARTIALLY_PAID" || s === "PARTIALLY PAID" || s === "PARTIAL_PAID")
    return "Partially Paid";
  if (s === "CANCELLED" || s === "VOIDED") return "Cancelled";
  if (s === "REFUNDED") return "Refunded";
  return "Pending";
}

export function mapApiBillToInvoiceRecord(bill: BillListItem): InvoiceRecord {
  const paymentStatus = mapApiStatusToPaymentStatus(bill.paymentStatus);

  // Support flat properties (from simpler BillListItem) or nested summary (from detailed BillWorkspace)
  const b = bill as BillListItem & {
    netAmount?: number;
    paidAmount?: number;
    balanceAmount?: number;
    mobile?: string;
    doctorName?: string;
    departmentName?: string;
    paymentMethod?: PaymentMethod;
    collectedBy?: string;
  };
  const netAmount =
    b.netAmount ??
    bill.summary?.netAmount ??
    (typeof bill.consultationFee === "number"
      ? bill.consultationFee
      : Number(bill.consultationFee) || 0);
  const paidAmount =
    b.paidAmount ??
    bill.summary?.paidAmount ??
    (paymentStatus === "Paid" ? netAmount : 0);
  const balanceAmount =
    b.balanceAmount ??
    bill.summary?.balanceAmount ??
    Math.max(0, netAmount - paidAmount);

  return {
    id: String(bill.billId ?? bill.id ?? bill.billNumber),
    billNumber: bill.billNumber,
    invoiceDate: bill.createdAt
      ? new Date(bill.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    patientName: bill.patientName,
    mrn: bill.patientMrn,
    mobile: b.mobile || "",
    doctorName: b.doctorName || "",
    department: b.departmentName || "",
    invoiceAmount: netAmount,
    paidAmount,
    balance: balanceAmount,
    paymentMethod: b.paymentMethod || "Cash",
    paymentStatus,
    collectedBy: b.collectedBy || "",
    status: bill.status,
    appointmentId: bill.appointmentId,
    encounterId: bill.encounterId,
    patientId: bill.patientId,
    doctorId: bill.doctorId,
  };
}
