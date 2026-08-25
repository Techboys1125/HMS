import { X, Printer } from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import type { InvoiceRecord } from "../types/billing.types";

interface InvoiceDetailsDrawerProps {
  invoice: InvoiceRecord | null;
  onClose: () => void;
  onPrint?: () => void;
}

export function InvoiceDetailsDrawer({
  invoice,
  onClose,
  onPrint = () => window.print(),
}: InvoiceDetailsDrawerProps) {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-xl overflow-hidden transition-transform duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] text-[#0D47A1] font-bold tracking-widest uppercase">
              Official OPD Invoice
            </span>
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {invoice.id}
            </h3>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs" style={{ fontFamily: RB }}>
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div>
              <div className="font-bold text-sm text-[#111827]">
                {invoice.patientName}
              </div>
              <div className="text-slate-500 font-mono">{invoice.mrn}</div>
              <div className="text-slate-500">{invoice.mobile}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">Date: {invoice.invoiceDate}</div>
              <div className="font-medium text-[#009688]">
                {invoice.department}
              </div>
              <div className="text-slate-700">{invoice.doctorName}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2 px-3">Service Description</th>
                <th className="py-2 px-3 text-right">Qty</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3">
                  {invoice.serviceName || "Consultation"} ({invoice.doctorName})
                </td>
                <td className="py-2.5 px-3 text-right">1</td>
                <td className="py-2.5 px-3 text-right font-semibold">
                  ₹{invoice.invoiceAmount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary Totals */}
          <div className="p-4 rounded-xl bg-slate-50 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{invoice.invoiceAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Amount Paid ({invoice.paymentMethod}):</span>
              <span className="font-semibold text-[#66BB6A]">
                ₹{invoice.paidAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#111827] border-t border-slate-200 pt-1.5">
              <span>Balance Due:</span>
              <span className="text-[#EF4444]">
                ₹{invoice.balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer"
          >
            <Printer size={14} /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white font-semibold hover:bg-blue-900 cursor-pointer"
            style={{ fontFamily: PP }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetailsDrawer;
