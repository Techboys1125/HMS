import React from "react";
import type { RxStatus } from "../types/prescription.types";

const PP = "'Poppins', system-ui, sans-serif";

export const PrescriptionStatusBadge: React.FC<{
  status: RxStatus | string;
}> = ({ status }) => {
  const norm = String(status ?? "").trim();
  const lower = norm.toLowerCase();

  if (lower.startsWith("draft")) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
        style={{ fontFamily: PP }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Draft
      </span>
    );
  }

  if (lower.startsWith("completed")) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-emerald-200"
        style={{ fontFamily: PP }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" />
        Completed
      </span>
    );
  }

  if (lower.startsWith("cancelled")) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-200"
        style={{ fontFamily: PP }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        Cancelled
      </span>
    );
  }

  if (lower.startsWith("archived")) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
        style={{ fontFamily: PP }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Archived
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200"
      style={{ fontFamily: PP }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
      Issued
    </span>
  );
};

export default PrescriptionStatusBadge;
