import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { PP, RB } from "../constants/reports.constants";

interface ReportErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ReportErrorState({
  title = "Something went wrong",
  message = "Failed to load report data. Please try again.",
  onRetry,
}: ReportErrorStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-12 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-[#EF4444]" />
      </div>
      <h3 className="text-base font-bold text-[#111827] mb-1" style={{ fontFamily: PP }}>
        {title}
      </h3>
      <p className="text-xs text-[#64748B] max-w-[300px] mb-4" style={{ fontFamily: RB }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#1565C0] transition-colors"
          style={{ fontFamily: PP }}
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}
