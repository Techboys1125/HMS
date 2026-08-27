import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  DollarSign,
  Search,
  CreditCard,
  FileText,
  CheckCircle2,
  ChevronRight,
  Printer,
  Clock,
  QrCode,
  Banknote,
  Landmark,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import { useInvoice, usePayment } from "../hooks/useBilling";
import { BillingStatusBadge } from "../components/BillingStatusBadge";
import type {
  PaymentMethod,
  PaymentReceiveResponse,
  BillPaymentRecord,
} from "../types/billing.types";

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  color: string;
  bgColor: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: "Cash",
    label: "Cash",
    sublabel: "Physical Currency",
    Icon: Banknote,
    color: "#059669",
    bgColor: "#ECFDF5",
  },
  {
    value: "UPI",
    label: "UPI / QR Code",
    sublabel: "GPay, PhonePe, Paytm",
    Icon: QrCode,
    color: "#0D47A1",
    bgColor: "#EFF6FF",
  },
  {
    value: "Card",
    label: "Credit / Debit Card",
    sublabel: "Visa, Mastercard, RuPay",
    Icon: CreditCard,
    color: "#7C3AED",
    bgColor: "#F5F3FF",
  },
  {
    value: "Bank Transfer",
    label: "Bank Transfer",
    sublabel: "NEFT / RTGS / IMPS",
    Icon: Landmark,
    color: "#D97706",
    bgColor: "#FFFBEB",
  },
];

const handlePrint = () => {
  window.print();
};

export function CollectPaymentWorkspacePage() {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();

  const { bill, isLoading: billLoading } = useInvoice(billId);
  const { receivePayment, isReceiving } = usePayment(billId);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [amount, setAmount] = useState<number>(0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<PaymentReceiveResponse | null>(
    null,
  );

  const patientName = bill?.patient?.name || "N/A";
  const patientMrn = bill?.patient?.mrn || "N/A";
  const doctorName = bill?.doctor?.name || "N/A";
  const billData = (bill?.bill || {}) as Record<
    string,
    string | number | boolean | null | undefined
  >;
  const summaryData = bill?.summary;

  const netAmount = summaryData?.netAmount ?? 0;
  const paidAmount = summaryData?.paidAmount ?? 0;
  const balanceAmount = summaryData?.balanceAmount ?? netAmount;

  const progressPercent = Math.min(
    100,
    netAmount > 0 ? Math.round((paidAmount / netAmount) * 100) : 0,
  );

  const canCollect =
    balanceAmount > 0 &&
    billData?.status !== "CANCELLED" &&
    billData?.status !== "VOIDED";

  const handleCollectPayment = async () => {
    if (!billId || amount <= 0) return;
    try {
      const result = await receivePayment({
        billId: Number(billId) || billId,
        payments: [
          {
            method: paymentMethod,
            amount,
            referenceNumber: referenceNumber || undefined,
          },
        ],
        remarks: remarks || undefined,
      });
      setReceiptData(result);
      setShowSuccess(true);
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  if (billLoading) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D47A1] mb-4" />
        <p className="text-sm text-slate-500" style={{ fontFamily: RB }}>
          Loading invoice details...
        </p>
      </div>
    );
  }

  if (!bill || !billData) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center space-y-4">
        <FileText size={48} className="text-slate-300 animate-bounce" />
        <h2
          className="text-lg font-bold text-slate-800"
          style={{ fontFamily: PP }}
        >
          Invoice Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The invoice "{billId}" does not exist.
        </p>
        <button
          onClick={() => navigate("/billing")}
          className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 cursor-pointer"
        >
          Return to Billing
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div
            className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium"
            style={{ fontFamily: RB }}
          >
            <button
              type="button"
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Home
            </button>
            <ChevronRight size={12} />
            <button
              type="button"
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Billing & Payments
            </button>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">
              Collect Payment
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1
              className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight"
              style={{ fontFamily: PP }}
            >
              Payment Collection Workspace
            </h1>
            <BillingStatusBadge status={String(billData.paymentStatus || "")} />
          </div>
          <p
            className="text-xs md:text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Collect payment for invoice {billData.billNumber}. Enter payment
            details and process the transaction.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            style={{ fontFamily: RB }}
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>
          <button
            onClick={() => navigate(`/billing/invoice/${billId}`)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            style={{ fontFamily: RB }}
          >
            <FileText size={14} />
            <span className="hidden sm:inline">View Invoice</span>
          </button>
        </div>
      </div>

      {/* 2. TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* INVOICE DETAILS */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                <FileText size={16} />
              </div>
              <div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  INVOICE DETAILS
                </h2>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Invoice {billData.billNumber}
                </p>
              </div>
            </div>
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Invoice Number
                </span>
                <span className="font-mono font-bold text-sm text-[#0D47A1]">
                  {billData.billNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Bill Status
                </span>
                <span className="font-medium text-[#111827]">
                  {billData.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Payment Status
                </span>
                <span className="font-medium text-[#111827]">
                  {billData.paymentStatus}
                </span>
              </div>
              {bill.appointment && (
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Appointment
                  </span>
                  <span className="font-mono text-slate-700">
                    {bill.appointment.appointmentNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* PATIENT INFO */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Search size={16} />
              </div>
              <div>
                <h2
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  PATIENT INFORMATION
                </h2>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Patient and doctor details
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white font-bold text-base flex items-center justify-center shrink-0">
                {patientName.charAt(0)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Patient Name
                  </span>
                  <span className="font-bold text-[#111827]">
                    {patientName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    MRN Reference
                  </span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    {patientMrn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Attending Physician
                  </span>
                  <span className="font-bold text-[#111827]">{doctorName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BILLING ITEMS */}
          {bill.items && bill.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h2
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    ITEMIZED BILLING ({bill.items.length} items)
                  </h2>
                  <p
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Charges and services included in this invoice
                  </p>
                </div>
              </div>
              <table
                className="w-full text-left border-collapse text-xs"
                style={{ fontFamily: RB }}
              >
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3">Service Name</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bill.items.map((item) => {
                    const itemObj = item as unknown as Record<string, unknown>;
                    const name =
                      item.serviceName ||
                      (itemObj.itemName as string) ||
                      (itemObj.name as string) ||
                      (itemObj.description as string) ||
                      (itemObj.service_name as string) ||
                      (itemObj.item_name as string) ||
                      (itemObj.service && typeof itemObj.service === "object" ? ((itemObj.service as Record<string, unknown>).name as string) : undefined) ||
                      "OPD Consultation Service";

                    return (
                      <tr key={item.id}>
                        <td className="py-3 px-3 font-medium text-[#111827]">
                          {name}
                        </td>
                        <td className="py-3 px-3 text-right">{item.quantity}</td>
                        <td className="py-3 px-3 text-right">
                          ₹{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#0D47A1]">
                          ₹
                          {(
                            item.totalAmount ||
                            item.totalPrice ||
                            0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAYMENT ENTRY */}
          {canCollect && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                  <DollarSign size={16} />
                </div>
                <div>
                  <h2
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    PAYMENT ENTRY
                  </h2>
                  <p
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Enter payment details for this invoice
                  </p>
                </div>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
                style={{ fontFamily: RB }}
              >
                <div className="md:col-span-2">
                  <span className="block text-slate-700 font-semibold mb-2">
                    Payment Method *
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PAYMENT_METHODS.map((pm) => {
                      const isSelected = paymentMethod === pm.value;
                      const { Icon, color, bgColor } = pm;
                      return (
                        <button
                          key={pm.value}
                          type="button"
                          onClick={() => setPaymentMethod(pm.value)}
                          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-[#0D47A1] bg-blue-50/70 shadow-sm ring-2 ring-[#0D47A1]/20"
                              : "border-[#E5E7EB] bg-white hover:bg-slate-50/80 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center"
                              style={{ background: bgColor }}
                            >
                              <Icon size={18} style={{ color }} />
                            </div>
                            {isSelected && (
                              <CheckCircle2
                                size={16}
                                className="text-[#0D47A1]"
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#111827]">
                              {pm.label}
                            </div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">
                              {pm.sublabel}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <span className="block text-slate-700 font-semibold mb-1">
                    Amount to Collect (₹) *
                    <input
                      type="number"
                      value={amount || ""}
                      onChange={(e) => {
                        const v = e.currentTarget.valueAsNumber;
                        setAmount(Number.isFinite(v) ? v : 0);
                      }}
                      max={balanceAmount}
                      placeholder={`Max: ₹${balanceAmount.toLocaleString()}`}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-sm font-bold text-[#111827] focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                    />
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setAmount(balanceAmount)}
                      className="text-[10px] text-[#0D47A1] font-bold hover:underline"
                    >
                      Pay Full (₹{balanceAmount.toLocaleString()})
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setAmount(Math.round(balanceAmount / 2))}
                      className="text-[10px] text-[#0D47A1] font-bold hover:underline"
                    >
                      Pay Half
                    </button>
                  </div>
                </div>
                {paymentMethod !== "Cash" && (
                  <div>
                    <span className="block text-slate-700 font-semibold mb-1">
                      Reference / Transaction ID
                      <input
                        aria-label="Input field"
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="e.g. UPI/890123/OKAX"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs font-mono focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                      />
                    </span>
                  </div>
                )}
                <div className="md:col-span-2">
                  <span className="block text-slate-700 font-semibold mb-1">
                    Remarks / Notes
                  </span>
                  <textarea
                    aria-label="Text area"
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Optional payment notes..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs focus:bg-white focus:border-[#0D47A1] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">
                  Summary
                </span>
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Payment Summary
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="space-y-2.5 text-xs" style={{ fontFamily: RB }}>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice No:</span>
                <span className="font-bold text-[#0D47A1] font-mono">
                  {billData.billNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-[#111827]">
                  {patientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Amount:</span>
                <span className="font-semibold text-[#111827]">
                  ₹{netAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#66BB6A] font-semibold">
                <span>Already Paid:</span>
                <span>₹{paidAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#66BB6A] h-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm font-bold text-[#EF4444] border-t border-slate-100 pt-3">
                <span>Balance Due:</span>
                <span>₹{balanceAmount.toLocaleString()}</span>
              </div>
            </div>

            {canCollect && (
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCollectPayment}
                  disabled={
                    isReceiving || amount <= 0 || amount > balanceAmount
                  }
                  className="w-full py-3 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <DollarSign size={15} />
                  {isReceiving
                    ? "Processing..."
                    : `Collect ₹${amount.toLocaleString()}`}
                </button>
                <button
                  onClick={() => navigate(`/billing/invoice/${billId}`)}
                  className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Back to Invoice
                </button>
              </div>
            )}

            {!canCollect && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
                <CheckCircle2
                  size={20}
                  className="text-[#66BB6A] mx-auto mb-1"
                />
                <p className="text-xs font-bold text-[#66BB6A]">Fully Paid</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  No outstanding balance
                </p>
              </div>
            )}
          </div>

          {/* PAYMENT HISTORY */}
          {bill.paymentHistory && bill.paymentHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Clock size={14} className="text-slate-500" />
                <h3
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  PAYMENT HISTORY
                </h3>
              </div>
              <div
                className="space-y-2 text-xs max-h-48 overflow-y-auto"
                style={{ fontFamily: RB }}
              >
                {bill.paymentHistory.map((p: BillPaymentRecord) => (
                  <div
                    key={p.receiptNumber || p.paymentNumber || p.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-[#111827]">{p.method}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.paidAt || "—"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#66BB6A]">
                        ₹{p.amount.toLocaleString()}
                      </div>
                      {p.referenceNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.referenceNumber}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM STICKY BAR */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <button
          onClick={() => navigate("/billing")}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
        >
          Back to Billing
        </button>
        {canCollect && (
          <button
            onClick={handleCollectPayment}
            disabled={isReceiving || amount <= 0 || amount > balanceAmount}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50"
            style={{ fontFamily: PP }}
          >
            <DollarSign size={15} />
            {isReceiving
              ? "Processing..."
              : `Collect ₹${amount.toLocaleString()}`}
          </button>
        )}
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6 text-center space-y-4 transition-transform duration-200">
            <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mx-auto border-2 border-green-200">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Payment Collected Successfully!
              </h3>
              <p
                className="text-xs text-[#64748B] mt-1"
                style={{ fontFamily: RB }}
              >
                Receipt{" "}
                <span className="font-bold text-[#0D47A1]">
                  {receiptData?.receiptNumber || "N/A"}
                </span>{" "}
                has been generated.
              </p>
            </div>
            <div
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 text-left"
              style={{ fontFamily: RB }}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Collected:</span>
                <span className="font-bold text-[#66BB6A]">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold text-[#111827]">
                  {paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">New Balance:</span>
                <span className="font-bold text-[#EF4444]">
                  ₹
                  {(
                    receiptData?.balance ?? balanceAmount - amount
                  ).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate(billId ? `/billing/invoice/${billId}` : "/billing");
                }}
                className="w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                View Invoice Details
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/billing");
                }}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Back to Billing Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectPaymentWorkspacePage;
