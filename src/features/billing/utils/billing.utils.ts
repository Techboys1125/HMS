import type {
  ApiPatientInvoice,
  BillListItem,
  InvoiceRecord,
  PaymentMethod,
} from "../types/billing.types";

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

  const invAny = apiInv as unknown as Record<string, unknown>;
  const docObj = typeof invAny.doctor === "object" && invAny.doctor !== null ? (invAny.doctor as Record<string, unknown>) : null;
  const deptObj = typeof invAny.department === "object" && invAny.department !== null ? (invAny.department as Record<string, unknown>) : null;

  const doctorName =
    (invAny.doctorName as string) ||
    (invAny.doctor_name as string) ||
    (invAny.attendingDoctorName as string) ||
    (invAny.attendingDoctor as string) ||
    (typeof invAny.doctor === "string" ? invAny.doctor : "") ||
    (docObj?.fullName as string) ||
    (docObj?.doctorName as string) ||
    (docObj?.name as string) ||
    "";

  const department =
    (invAny.departmentName as string) ||
    (invAny.department_name as string) ||
    (typeof invAny.department === "string" ? invAny.department : "") ||
    (deptObj?.departmentName as string) ||
    (deptObj?.name as string) ||
    "";

  const paidAmount =
    typeof invAny.paidAmount === "number"
      ? (invAny.paidAmount as number)
      : status === "Paid"
        ? amount
        : 0;
  const balance =
    typeof invAny.balance === "number"
      ? (invAny.balance as number)
      : typeof invAny.balanceAmount === "number"
        ? (invAny.balanceAmount as number)
        : status === "Paid"
          ? 0
          : Math.max(0, amount - paidAmount);

  return {
    id: String(apiInv.invoiceNumber || apiInv.id),
    invoiceDate: apiInv.date || "N/A",
    patientName: patientName,
    mrn: mrn,
    mobile: (invAny.mobile as string) || "",
    doctorName,
    department,
    invoiceAmount: amount,
    paidAmount,
    balance,
    paymentMethod: (invAny.paymentMethod as PaymentMethod) || "Cash",
    paymentStatus: status,
    collectedBy: (invAny.collectedBy as string) || "",
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

  const b = bill as unknown as Record<string, unknown>;
  const docObj = typeof b.doctor === "object" && b.doctor !== null ? (b.doctor as Record<string, unknown>) : null;
  const deptObj = typeof b.department === "object" && b.department !== null ? (b.department as Record<string, unknown>) : null;

  const doctorName =
    (bill.doctorName as string) ||
    (b.doctorName as string) ||
    (b.doctor_name as string) ||
    (b.attendingDoctorName as string) ||
    (b.attendingDoctor as string) ||
    (typeof b.doctor === "string" ? b.doctor : "") ||
    (docObj?.fullName as string) ||
    (docObj?.doctorName as string) ||
    (docObj?.name as string) ||
    "";

  const department =
    (b.departmentName as string) ||
    (b.department_name as string) ||
    (typeof b.department === "string" ? b.department : "") ||
    (deptObj?.departmentName as string) ||
    (deptObj?.name as string) ||
    "";

  const netAmount =
    (b.netAmount as number) ??
    bill.summary?.netAmount ??
    (typeof bill.consultationFee === "number"
      ? bill.consultationFee
      : Number(bill.consultationFee) || 0);
  const paidAmount =
    (b.paidAmount as number) ??
    bill.summary?.paidAmount ??
    (paymentStatus === "Paid" ? netAmount : 0);
  const balanceAmount =
    (b.balanceAmount as number) ??
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
    mobile: (b.mobile as string) || "",
    doctorName,
    department,
    invoiceAmount: netAmount,
    paidAmount,
    balance: balanceAmount,
    paymentMethod: (b.paymentMethod as PaymentMethod) || "Cash",
    paymentStatus,
    collectedBy: (b.collectedBy as string) || "",
    status: bill.status,
    appointmentId: bill.appointmentId,
    encounterId: bill.encounterId,
    patientId: bill.patientId,
    doctorId: bill.doctorId,
  };
}
