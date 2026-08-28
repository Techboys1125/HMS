import { Plus, Download, RotateCcw, History, BarChart2 } from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";
import { checkBillingPermission } from "../permissions/billing.permissions";
import { PP, RB } from "../constants/billing.constants";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onGenerateInvoice?: () => void;
  onViewPayments?: () => void;
  onViewDailyReport?: () => void;
  onExportReport?: () => void;
  isAdminReadOnly?: boolean;
}

export function BillingHeader({
  title = "Billing Dashboard",
  subtitle,
  onGenerateInvoice,
  onViewPayments,
  onViewDailyReport,
  onExportReport,
  isAdminReadOnly = false,
}: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const showGenerate =
    checkBillingPermission(role, "generate_invoice") && !isAdminReadOnly;
  const showExport =
    checkBillingPermission(role, "export_reports") && !isAdminReadOnly;
  const showDailyReport = checkBillingPermission(role, "view_daily_report");
  const showPaymentsLedger = checkBillingPermission(role, "view_history");

  const defaultSubtitle = isAdminReadOnly
    ? "Monitor billing operations, invoice status and revenue overview across the hospital."
    : "Manage invoices, payment collections, billing status and daily revenue across outpatient consultations.";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
      <div>
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 text-xs text-[#64748B] mb-1 font-medium"
          style={{ fontFamily: RB }}
        >
          <span className="hover:text-[#0D47A1] cursor-pointer">
            {isAdminReadOnly ? "Hospital Administration" : "Home"}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-[#0D47A1] font-semibold">
            Billing & Payment
          </span>
          {isAdminReadOnly && <span className="text-slate-400">/</span>}
          {isAdminReadOnly && (
            <span className="text-[#0D47A1] font-semibold">
              Billing Dashboard
            </span>
          )}
        </div>
        {/* Title & Subtitle */}
        <h1
          className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight"
          style={{ fontFamily: PP }}
        >
          {title}
        </h1>
        <p
          className="text-xs md:text-sm text-[#64748B] mt-0.5"
          style={{ fontFamily: RB }}
        >
          {subtitle || defaultSubtitle}
        </p>
      </div>

      {/* Action Buttons & Quick Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {showGenerate && (
          <button
            onClick={onGenerateInvoice}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-transform shadow-sm active:scale-95 cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <Plus size={15} /> Generate Invoice
          </button>
        )}

        {showExport && !showGenerate && (
          <button
            onClick={
              onExportReport ||
              (() => console.log("Exporting Billing Report..."))
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-900 transition-transform shadow-sm active:scale-95 cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <Download size={15} />
            Export Report
          </button>
        )}

        {showPaymentsLedger && (
          <button
            onClick={onViewPayments}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#009688] text-xs font-semibold hover:bg-teal-100 transition-colors shadow-sm cursor-pointer"
            style={{ fontFamily: PP }}
          >
            {isAdminReadOnly ? <RotateCcw size={14} /> : <History size={14} />}
            <span className="hidden sm:inline">
              {isAdminReadOnly ? "Refresh Dashboard" : "Payment History Ledger"}
            </span>
          </button>
        )}

        {showDailyReport && (
          <button
            onClick={onViewDailyReport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#0D47A1] text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            style={{ fontFamily: PP }}
          >
            <BarChart2 size={14} />
            <span className="hidden sm:inline">Daily Billing Report</span>
          </button>
        )}
      </div>
    </div>
  );
}
