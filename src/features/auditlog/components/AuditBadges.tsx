import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { AuditSeverity, AuditStatus } from "../types/auditlog.types";

export function SeverityBadge({ severity }: { severity: AuditSeverity }) {
  switch (severity) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          Critical
        </span>
      );
    case "Warning":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Warning
        </span>
      );
    case "Success":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Success
        </span>
      );
    case "Information":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          Information
        </span>
      );
  }
}

export function SeverityBadgeLarge({ severity }: { severity: AuditSeverity }) {
  switch (severity) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          Critical
        </span>
      );
    case "Warning":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Warning
        </span>
      );
    case "Success":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Success
        </span>
      );
    case "Information":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          Information
        </span>
      );
  }
}

export function StatusBadge({ status }: { status: AuditStatus }) {
  const tone = getStatusTone(status);
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${tone}`}>
      {status}
    </span>
  );
}

export function StatusBadgeLarge({ status }: { status: AuditStatus }) {
  const tone = getStatusTone(status);
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${tone}`}>
      {status}
    </span>
  );
}

function getStatusTone(status: AuditStatus): string {
  const normalized = status.toUpperCase();
  if (
    normalized.includes("FAIL") ||
    normalized.includes("BLOCK") ||
    normalized.includes("LOCK")
  ) {
    return "bg-red-50 text-red-600 border-red-200";
  }
  if (
    normalized.includes("WARN") ||
    normalized.includes("PENDING") ||
    normalized.includes("OPEN") ||
    normalized.includes("ARCHIVED")
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (
    normalized.includes("SUCCESS") ||
    normalized.includes("HEALTHY") ||
    normalized.includes("ACTIVE")
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}
