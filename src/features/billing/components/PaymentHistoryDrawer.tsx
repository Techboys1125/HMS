import { X } from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import type { InvoiceRecord } from "../types/billing.types";
import { BillingStatusBadge } from "./BillingStatusBadge";

interface PaymentHistoryDrawerProps {
  invoice: InvoiceRecord | null;
  onClose: () => void;
}

export function PaymentHistoryDrawer({
  invoice,
  onClose,
}: PaymentHistoryDrawerProps) {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h3
            className="text-base font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Payment History — {invoice.id}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs" style={{ fontFamily: RB }}>
          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <div className="font-bold text-[#111827]">
                {invoice.patientName}
              </div>
              <div className="text-slate-400 font-mono">{invoice.mrn}</div>
            </div>
            <BillingStatusBadge status={invoice.paymentStatus} />
          </div>

          <div className="space-y-2">
            <div
              className="text-xs font-bold text-[#64748B] uppercase tracking-wider"
              style={{ fontFamily: PP }}
            >
              Audit Trail
            </div>

            <div className="p-3 rounded-xl border border-slate-200 space-y-1 bg-white">
              <div className="flex justify-between font-semibold text-[#111827]">
                <span>Initial Invoice Created</span>
                <span>₹{invoice.invoiceAmount.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Created on {invoice.invoiceDate} by {invoice.collectedBy}
              </div>
            </div>

            {invoice.paidAmount > 0 && (
              <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1">
                <div className="flex justify-between font-semibold text-[#009688]">
                  <span>Payment Collected ({invoice.paymentMethod})</span>
                  <span>₹{invoice.paidAmount.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Processed by {invoice.collectedBy}
                </div>
                {invoice.notes && (
                  <div className="text-[10px] text-slate-600 mt-1 italic border-t border-teal-100 pt-1">
                    Notes: {invoice.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentHistoryDrawer;
