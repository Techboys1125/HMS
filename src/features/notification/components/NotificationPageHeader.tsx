import { ChevronRight, CheckCircle2, RefreshCw, Settings, Download } from "lucide-react";
import { PP } from "../constants/notifications.constants";

export interface NotificationPageHeaderProps {
  currentRole: string;
  onMarkAllAsRead: () => void;
  markAllPending?: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
  canExport?: boolean;
  onExport: () => void;
}

export function NotificationPageHeader({
  currentRole,
  onMarkAllAsRead,
  markAllPending,
  onRefresh,
  onOpenSettings,
  canExport,
  onExport,
}: NotificationPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
          <span>Hospital</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-medium text-[#0D47A1]">Notification Center</span>
        </div>
        <div className="flex items-center gap-3">
          <h1
            style={{ fontFamily: PP }}
            className="text-2xl font-bold tracking-tight text-[#111827]"
          >
            Notification Center
          </h1>
          <span className="rounded-full bg-[#0D47A1]/10 px-3 py-1 text-xs font-semibold text-[#0D47A1]">
            Role: {currentRole}
          </span>
        </div>
        <p className="text-sm text-[#64748B] mt-0.5">
          View and manage all application notifications, alerts, reminders, and
          workflow updates relevant to your role.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onMarkAllAsRead}
          disabled={markAllPending}
          className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50 transition"
        >
          <CheckCircle2 className="w-4 h-4 text-[#66BB6A]" />
          Mark All as Read
        </button>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-4 h-4 text-[#0D47A1]" />
          Refresh
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm hover:bg-slate-50 transition"
        >
          <Settings className="w-4 h-4 text-[#64748B]" />
          Notification Settings
        </button>

        {canExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg bg-[#0D47A1] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0b3882] transition"
          >
            <Download className="w-4 h-4" />
            Export Notification Log
          </button>
        )}
      </div>
    </div>
  );
}
