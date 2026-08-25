import { useState } from "react";
import {
  DollarSign,
  Printer,
  MoreVertical,
  History,
  Ban,
  FileText,
  Zap,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import type { InvoiceRecord } from "../types/billing.types";
import { BillingStatusBadge } from "./BillingStatusBadge";

interface BillingTableProps {
  invoices: InvoiceRecord[];
  isAdminReadOnly?: boolean;
  onViewInvoiceDetailsClick?: (invoice: InvoiceRecord) => void;
  onCollectPaymentClick?: (invoice: InvoiceRecord) => void;
  onGenerateInvoiceClick?: (invoice: InvoiceRecord) => void;
  onCancelInvoice?: (invoiceId: string) => void;
  onViewPaymentHistory?: (invoice: InvoiceRecord) => void;
  onPrintInvoice?: (invoice: InvoiceRecord) => void;
}

function InvoiceRow({
  invoice,
  isAdminReadOnly,
  activeMenuId,
  setActiveMenuId,
  onViewInvoiceDetailsClick,
  onCollectPaymentClick,
  onGenerateInvoiceClick,
  onCancelInvoice,
  onViewPaymentHistory,
  onPrintInvoice,
}: {
  invoice: InvoiceRecord;
  isAdminReadOnly: boolean;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onViewInvoiceDetailsClick?: (invoice: InvoiceRecord) => void;
  onCollectPaymentClick?: (invoice: InvoiceRecord) => void;
  onGenerateInvoiceClick?: (invoice: InvoiceRecord) => void;
  onCancelInvoice?: (invoiceId: string) => void;
  onViewPaymentHistory?: (invoice: InvoiceRecord) => void;
  onPrintInvoice?: (invoice: InvoiceRecord) => void;
}) {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
      {/* Invoice ID */}
      <td
        className="px-4 py-3.5 font-bold text-[#0D47A1]"
        style={{ fontFamily: PP }}
      >
        {invoice.billNumber || invoice.id}
      </td>
      {/* Date */}
      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
        {invoice.invoiceDate}
      </td>
      {/* Patient */}
      <td className="px-4 py-3.5">
        <div className="font-semibold text-[#111827]">
          {invoice.patientName}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {invoice.mrn}
        </div>
      </td>
      {/* Doctor & Department */}
      <td className="px-4 py-3.5">
        <div className="font-semibold text-[#111827]">
          {invoice.doctorName || "—"}
        </div>
        {invoice.department && (
          <div className="text-[11px] text-[#009688] font-medium">
            {invoice.department}
          </div>
        )}
      </td>
      {/* Amounts */}
      <td className="px-4 py-3.5 text-right font-semibold text-[#111827]">
        ₹{invoice.invoiceAmount.toLocaleString()}
      </td>
      <td className="px-4 py-3.5 text-right font-medium text-[#66BB6A]">
        ₹{invoice.paidAmount.toLocaleString()}
      </td>
      <td className="px-4 py-3.5 text-right font-bold text-[#EF4444]">
        ₹{invoice.balance.toLocaleString()}
      </td>
      {/* Status Chip */}
      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        <BillingStatusBadge status={invoice.paymentStatus} />
      </td>
      {/* Actions */}
      <td className="px-4 py-3.5 text-right relative">
        <div className="flex items-center justify-center gap-2">
          {/* Contextual Principal Button */}
          {invoice.status?.toUpperCase() === "READY_FOR_BILLING" ||
          invoice.status?.toUpperCase() === "PENDING_BILLING" ? (
            <button
              onClick={() => onGenerateInvoiceClick?.(invoice)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-[11px] font-semibold hover:bg-blue-900 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
              title="Generate Invoice"
            >
              <Zap size={12} />
              Generate Invoice
            </button>
          ) : invoice.status?.toUpperCase() === "DRAFT" ? (
            <button
              onClick={() => onGenerateInvoiceClick?.(invoice)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-[11px] font-semibold hover:bg-blue-900 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
              title="Edit Invoice"
            >
              <FileText size={12} />
              Edit Invoice
            </button>
          ) : (
            <button
              onClick={() => onViewInvoiceDetailsClick?.(invoice)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
              title="View Invoice"
            >
              <FileText size={12} className="text-slate-400" />
              View Invoice
            </button>
          )}

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              aria-label="Action"
              onClick={() =>
                setActiveMenuId(activeMenuId === invoice.id ? null : invoice.id)
              }
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical size={14} />
            </button>

            {activeMenuId === invoice.id && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-[#E5E7EB] shadow-lg py-1 z-20 text-left">
                <button
                  onClick={() => {
                    onViewPaymentHistory?.(invoice);
                    setActiveMenuId(null);
                  }}
                  className="w-full px-3 py-2 text-xs text-[#111827] hover:bg-slate-50 flex items-center gap-2"
                >
                  <History size={13} className="text-slate-400" />
                  View Payment History
                </button>
                {!isAdminReadOnly &&
                  invoice.status?.toUpperCase() !== "READY_FOR_BILLING" &&
                  invoice.status?.toUpperCase() !== "PENDING_BILLING" &&
                  invoice.status?.toUpperCase() !== "PENDING" &&
                  invoice.balance > 0 &&
                  invoice.paymentStatus !== "Cancelled" && (
                    <button
                      onClick={() => {
                        onCollectPaymentClick?.(invoice);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-2 text-xs text-[#009688] hover:bg-teal-50 flex items-center gap-2"
                    >
                      <DollarSign size={13} className="text-[#009688]" />
                      Collect Payment
                    </button>
                  )}
                <button
                  onClick={() => {
                    if (onPrintInvoice) onPrintInvoice(invoice);
                    else onViewInvoiceDetailsClick?.(invoice);
                    setActiveMenuId(null);
                  }}
                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Printer size={13} className="text-slate-400" />
                  Print Invoice
                </button>
                {!isAdminReadOnly &&
                  invoice.paymentStatus !== "Cancelled" &&
                  invoice.paymentStatus !== "Refunded" && (
                    <button
                      onClick={() => {
                        if (onCancelInvoice) onCancelInvoice(invoice.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-2 text-xs text-[#EF4444] hover:bg-red-50 flex items-center gap-2"
                    >
                      <Ban size={13} className="text-slate-400" />
                      Cancel Invoice
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export function BillingTable({
  invoices,
  isAdminReadOnly = false,
  onViewInvoiceDetailsClick,
  onCollectPaymentClick,
  onGenerateInvoiceClick,
  onCancelInvoice,
  onViewPaymentHistory,
  onPrintInvoice,
}: BillingTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto max-h-150 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 border-b border-[#E5E7EB] z-10">
            <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
              <th className="px-4 py-3.5">Invoice ID</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Patient / MRN</th>
              <th className="px-4 py-3.5">Doctor & Dept</th>
              <th className="px-4 py-3.5 text-right">Invoice Amt</th>
              <th className="px-4 py-3.5 text-right">Paid</th>
              <th className="px-4 py-3.5 text-right">Balance</th>
              <th className="px-4 py-3.5 text-center">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[#111827]">
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <InvoiceRow
                  key={inv.id}
                  invoice={inv}
                  isAdminReadOnly={isAdminReadOnly}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  onViewInvoiceDetailsClick={onViewInvoiceDetailsClick}
                  onCollectPaymentClick={onCollectPaymentClick}
                  onGenerateInvoiceClick={onGenerateInvoiceClick}
                  onCancelInvoice={onCancelInvoice}
                  onViewPaymentHistory={onViewPaymentHistory}
                  onPrintInvoice={onPrintInvoice}
                />
              ))
            ) : (
              /* EMPTY STATE */
              <tr>
                <td colSpan={9} className="py-12 text-center bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <FileText size={24} />
                    </div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      No invoices available
                    </h3>
                    <p
                      className="text-xs text-slate-500"
                      style={{ fontFamily: RB }}
                    >
                      There are no billing records matching your search query or
                      filter selection.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BillingTable;
