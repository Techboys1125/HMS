import React from "react";

interface ReportLoadingStateProps {
  rows?: number;
}

export function ReportLoadingState({ rows = 5 }: ReportLoadingStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="space-y-2">
          <div className="h-4 w-48 rounded bg-slate-100" />
          <div className="h-3 w-32 rounded bg-slate-50" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-3 w-16 rounded bg-slate-100" />
            <div className="h-3 w-32 rounded bg-slate-100" />
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-3 w-20 rounded bg-slate-100 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
