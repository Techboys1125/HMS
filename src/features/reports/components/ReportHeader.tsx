import React from "react";
import { ChevronLeft, Download, RefreshCw, Printer } from "lucide-react";
import { PP, RB } from "../constants/reports.constants";

interface ReportHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  showExport?: boolean;
  showPrint?: boolean;
  showRefresh?: boolean;
  actions?: React.ReactNode;
}

export function ReportHeader({
  title,
  subtitle,
  onBack,
  onRefresh,
  onExport,
  onPrint,
  showExport = true,
  showPrint = true,
  showRefresh = true,
  actions,
}: ReportHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-[#111827]" style={{ fontFamily: PP }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {showRefresh && onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: RB }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          )}
          {showExport && onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#1565C0] transition-colors"
              style={{ fontFamily: PP }}
            >
              <Download size={13} /> Export
            </button>
          )}
          {showPrint && onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: RB }}
            >
              <Printer size={13} /> Print
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
