import React from "react";
import { FileText } from "lucide-react";
import { PP, RB } from "../constants/reports.constants";

interface ReportEmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function ReportEmptyState({
  title = "No Data Available",
  message = "There is no data to display for this report at the moment.",
  icon,
}: ReportEmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
        {icon || <FileText size={28} className="text-[#94A3B8]" />}
      </div>
      <h3 className="text-base font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
        {title}
      </h3>
      <p className="text-xs text-[#64748B] max-w-[300px]" style={{ fontFamily: RB }}>
        {message}
      </p>
    </div>
  );
}
