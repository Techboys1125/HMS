import { useState } from "react";
import { X } from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import type { InvoiceRecord, PaymentMethod } from "../types/billing.types";

interface CollectPaymentDrawerProps {
  invoice: InvoiceRecord | null;
  onClose: () => void;
  onConfirm: (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    notes?: string,
  ) => void;
}

export function CollectPaymentDrawer({
  invoice,
  onClose,
  onConfirm,
}: CollectPaymentDrawerProps) {
  const [collectAmount, setCollectAmount] = useState<number>(
    invoice?.balance ?? 0,
  );
  const [collectMethod, setCollectMethod] = useState<PaymentMethod>("UPI");
  const [collectNotes, setCollectNotes] = useState("");

  if (!invoice) return null;

  const handleProcessCollection = () => {
    if (collectAmount <= 0 || collectAmount > invoice.balance) {
      console.warn(
        `Invalid amount: Please enter a valid amount between ₹1 and ₹${invoice.balance.toLocaleString()}`,
      );
      return;
    }
    onConfirm(invoice.id, collectAmount, collectMethod, collectNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-end">
      <div className="bg-white w-full max-w-md h-full border-l border-[#E5E7EB] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <div
                className="text-xs text-[#009688] font-bold"
                style={{ fontFamily: PP }}
              >
                PAYMENT COLLECTION
              </div>
              <h3
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {invoice.id}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Patient & Summary Box */}
          <div
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs"
            style={{ fontFamily: RB }}
          >
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-bold text-[#111827]">
                {invoice.patientName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MRN:</span>
              <span className="font-mono text-slate-700">{invoice.mrn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Bill Amount:</span>
              <span className="font-semibold text-[#111827]">
                ₹{invoice.invoiceAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
              <span className="text-[#EF4444]">Outstanding Balance:</span>
              <span className="text-[#EF4444]">
                ₹{invoice.balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Entry Form */}
          <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Collection Amount (₹) *
              </label>
              <input
                type="number"
                value={collectAmount}
                onChange={(e) => {
                  const v = e.currentTarget.valueAsNumber;
                  setCollectAmount(Number.isFinite(v) ? v : 0);
                }}
                max={invoice.balance}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-sm font-bold text-[#111827] focus:bg-white focus:border-[#009688] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Payment Method *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ["UPI", "Cash", "Card", "Bank Transfer"] as PaymentMethod[]
                ).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCollectMethod(m)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      collectMethod === m
                        ? "bg-[#009688] text-white border-[#009688] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Transaction Notes / Reference
              </label>
              <textarea
                rows={3}
                value={collectNotes}
                onChange={(e) => setCollectNotes(e.target.value)}
                placeholder="Enter UPI Txn ID, Card Auth Code or Cash Serial Notes..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#009688] focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Drawer Actions */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handleProcessCollection}
            className="w-full py-3 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
            style={{ fontFamily: PP }}
          >
            Confirm & Issue Receipt (₹{collectAmount.toLocaleString()})
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollectPaymentDrawer;
