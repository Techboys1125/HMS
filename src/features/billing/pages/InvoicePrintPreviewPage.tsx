import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Printer,
  Download,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  Share2,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import { useInvoice, useReceipt } from "../hooks/useBilling";
import type { BillPaymentRecord } from "../types/billing.types";

export function InvoicePrintPreviewPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();

  const { bill, isLoading: billLoading } = useInvoice(invoiceId);
  const { receipt, isLoading: receiptLoading } = useReceipt(invoiceId);

  const [zoom, setZoom] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPrintSuccess, setShowPrintSuccess] = useState(false);

  const isLoading = billLoading || receiptLoading;

  const patientName = bill?.patient?.name || receipt?.patientName || "N/A";
  const patientMrn = bill?.patient?.mrn || receipt?.mrn || "N/A";
  const doctorName = bill?.doctor?.name || "N/A";
  const billData = bill?.bill;
  const summaryData = bill?.summary;
  const items = bill?.items || [];
  const payments = bill?.paymentHistory || receipt?.payments || [];

  const handleZoomIn = () => setZoom((z) => Math.min(150, z + 10));
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 10));

  const handlePrint = () => {
    setShowPrintSuccess(true);
    setTimeout(() => {
      window.print();
      setShowPrintSuccess(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D47A1] mb-4" />
        <p className="text-sm text-slate-500" style={{ fontFamily: RB }}>
          Loading print preview...
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
          The invoice "{invoiceId}" does not exist.
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

  const netAmount = summaryData?.netAmount ?? 0;
  const paidAmount = summaryData?.paidAmount ?? 0;
  const balanceAmount = summaryData?.balanceAmount ?? netAmount;
  const grossAmount = summaryData?.grossAmount ?? netAmount;
  const discountAmount = summaryData?.discountAmount ?? 0;
  const taxAmount = summaryData?.taxAmount ?? 0;

  return (
    <div className="w-full bg-[#F1F5F9] min-h-screen p-4 md:p-6 pb-28 space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div>
          <div
            className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium"
            style={{ fontFamily: RB }}
          >
            <span
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Home
            </span>
            <ChevronRight size={12} />
            <span
              className="hover:text-[#0D47A1] cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Billing & Payments
            </span>
            <ChevronRight size={12} />
            <span className="text-[#0D47A1] font-semibold">Print Preview</span>
          </div>
          <h1
            className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight"
            style={{ fontFamily: PP }}
          >
            Invoice Print Preview
          </h1>
          <p
            className="text-xs md:text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Preview and print invoice {billData.billNumber}. Adjust zoom
            settings before printing.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleZoomOut}
            className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-bold text-[#111827] px-2">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-8 bg-slate-200 mx-1" />
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            title="Print Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            title="Share"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm active:scale-95"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* 2. PRINT SETTINGS DROPDOWN */}
      {showSettings && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
          <h3
            className="text-sm font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Print Settings
          </h3>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs"
            style={{ fontFamily: RB }}
          >
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Paper Size
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium">
                <option>A4 (210 × 297 mm)</option>
                <option>Letter (8.5 × 11 in)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Orientation
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium">
                <option>Portrait</option>
                <option>Landscape</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Margins
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium">
                <option>Normal</option>
                <option>Narrow</option>
                <option>Wide</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Scale
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-medium">
                <option>100%</option>
                <option>90%</option>
                <option>80%</option>
                <option>75%</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. A4 RECEIPT PREVIEW */}
      <div
        className="flex justify-center"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top center",
        }}
      >
        <div
          className="bg-white w-full max-w-[800px] shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none"
          id="print-area"
        >
          {/* RECEIPT HEADER */}
          <div className="bg-[#0D47A1] text-white p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl font-bold">🏥</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold" style={{ fontFamily: PP }}>
                  Safe Hands Hospital
                </h1>
                <p className="text-xs text-blue-200" style={{ fontFamily: RB }}>
                  Multi-Specialty Medical Center
                </p>
              </div>
            </div>
            <p
              className="text-xs text-blue-200 mt-2"
              style={{ fontFamily: RB }}
            >
              123 Medical Center Road, Healthcare City, HC 560001
            </p>
            <p className="text-xs text-blue-200" style={{ fontFamily: RB }}>
              Phone: +91 80 4567 8900 | GSTIN: 29AABCS1234F1Z5
            </p>
          </div>

          {/* RECEIPT TITLE */}
          <div className="border-b-2 border-[#0D47A1] py-3 text-center">
            <h2
              className="text-lg font-bold text-[#0D47A1] tracking-wider"
              style={{ fontFamily: PP }}
            >
              OFFICIAL PAYMENT RECEIPT
            </h2>
          </div>

          {/* RECEIPT META */}
          <div className="p-6 border-b border-gray-200">
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs"
              style={{ fontFamily: RB }}
            >
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Receipt Number
                </span>
                <span className="font-mono font-bold text-sm text-[#0D47A1]">
                  {receipt?.receiptNumber || billData.billNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Invoice Number
                </span>
                <span className="font-mono font-bold text-sm text-[#111827]">
                  {billData.billNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Payment Date
                </span>
                <span className="font-medium text-[#111827]">
                  {billData.createdAt
                    ? new Date(billData.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  Payment Status
                </span>
                <span className="font-bold text-[#66BB6A]">
                  {billData.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* PATIENT & DOCTOR */}
          <div
            className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs"
            style={{ fontFamily: RB }}
          >
            <div className="space-y-2">
              <h3 className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">
                Patient Details
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0D47A1] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {patientName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#111827]">{patientName}</div>
                  <div className="font-mono text-[#0D47A1]">{patientMrn}</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">
                Attending Physician
              </h3>
              <div className="font-bold text-[#111827]">{doctorName}</div>
              {bill.doctor?.doctorCode && (
                <div className="font-mono text-slate-500">
                  {bill.doctor.doctorCode}
                </div>
              )}
            </div>
          </div>

          {/* BILLING ITEMS */}
          <div className="p-6 border-b border-gray-200">
            <h3
              className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase mb-3"
              style={{ fontFamily: PP }}
            >
              Itemized Billing
            </h3>
            <table
              className="w-full text-left border-collapse text-xs"
              style={{ fontFamily: RB }}
            >
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-medium text-[#111827]">
                      {item.serviceName}
                    </td>
                    <td className="py-2.5 px-3 text-right">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">
                      ₹{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0D47A1]">
                      ₹
                      {(
                        item.totalAmount ||
                        item.totalPrice ||
                        0
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      No items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* SUMMARY */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-xs" style={{ fontFamily: RB }}>
                <h3 className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">
                  Amount Summary
                </h3>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Amount:</span>
                  <span className="font-semibold">
                    ₹{grossAmount.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#EF4444]">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      -₹{discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax:</span>
                    <span className="font-semibold">
                      +₹{taxAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-bold text-[#111827]">Net Amount:</span>
                  <span className="font-bold text-[#0D47A1]">
                    ₹{netAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#66BB6A]">
                  <span className="font-semibold">Paid Amount:</span>
                  <span className="font-bold">
                    ₹{paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#EF4444]">
                  <span className="font-bold">Balance Due:</span>
                  <span className="font-bold">
                    ₹{balanceAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs" style={{ fontFamily: RB }}>
                <h3 className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">
                  Payment Methods Used
                </h3>
                {payments.map((p: BillPaymentRecord, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="text-slate-600">{p.method}</span>
                    <span className="font-bold text-[#66BB6A]">
                      ₹{p.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {payments.length === 0 && (
                  <p className="text-slate-400 text-[11px]">
                    No payments recorded
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-6 bg-slate-50 text-center space-y-2">
            <p
              className="text-[10px] text-slate-500"
              style={{ fontFamily: RB }}
            >
              This is a computer-generated receipt. For queries, contact
              billing@safehandshospital.com
            </p>
            <p
              className="text-[10px] text-slate-400"
              style={{ fontFamily: RB }}
            >
              Thank you for choosing Safe Hands Hospital. We wish you a speedy
              recovery.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-[#0D47A1] font-semibold">
              <span>www.safehandshospital.com</span>
              <span>|</span>
              <span>+91 80 4567 8900</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM STICKY BAR */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-6 z-40 flex items-center justify-between shadow-lg">
        <button
          onClick={() => navigate(`/billing/invoice/${invoiceId}`)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
        >
          Back to Invoice
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
          >
            <Share2 size={14} /> Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-blue-900 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Printer size={15} /> Print Invoice
          </button>
        </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Share Invoice
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </div>
            <div className="space-y-2 text-xs" style={{ fontFamily: RB }}>
              <button className="w-full p-3 rounded-xl border border-[#E5E7EB] text-left hover:bg-slate-50 flex items-center gap-3">
                <Download size={16} className="text-[#0D47A1]" />
                <div>
                  <div className="font-bold text-[#111827]">
                    Download as PDF
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Save invoice as PDF file
                  </div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-[#E5E7EB] text-left hover:bg-slate-50 flex items-center gap-3">
                <Share2 size={16} className="text-[#009688]" />
                <div>
                  <div className="font-bold text-[#111827]">Send via Email</div>
                  <div className="text-[10px] text-slate-400">
                    Email receipt to patient
                  </div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-[#E5E7EB] text-left hover:bg-slate-50 flex items-center gap-3">
                <FileText size={16} className="text-purple-600" />
                <div>
                  <div className="font-bold text-[#111827]">
                    Send via WhatsApp
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Share receipt on WhatsApp
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT SUCCESS TOAST */}
      {showPrintSuccess && (
        <div className="fixed top-4 right-4 bg-white rounded-xl border border-[#E5E7EB] shadow-lg p-3 flex items-center gap-2 z-50 animate-in slide-in-from-right">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span
            className="text-xs font-semibold text-[#111827]"
            style={{ fontFamily: RB }}
          >
            Opening print dialog...
          </span>
        </div>
      )}
    </div>
  );
}

export default InvoicePrintPreviewPage;
