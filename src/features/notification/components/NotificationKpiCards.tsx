import { Bell, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PP } from "../constants/notifications.constants";

export interface NotificationKpiMetrics {
  unread: number;
  today: number;
  critical: number;
  completed: number;
}

export function NotificationKpiCards({
  metrics,
}: {
  metrics: NotificationKpiMetrics;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#64748B]">
            Unread Notifications
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0D47A1]">
            <Bell className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span
            style={{ fontFamily: PP }}
            className="text-2xl font-bold text-[#111827]"
          >
            {metrics.unread}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            Active Alerts
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-[#0D47A1]"
            style={{ width: `${Math.min(100, metrics.unread * 15)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#64748B]">
            Today's Notifications
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#009688]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span
            style={{ fontFamily: PP }}
            className="text-2xl font-bold text-[#111827]"
          >
            {metrics.today}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            Generated Today
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-[#009688]"
            style={{ width: `${Math.min(100, metrics.today * 14)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#64748B]">
            Priority Alerts
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#EF4444]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span
            style={{ fontFamily: PP }}
            className="text-2xl font-bold text-[#111827]"
          >
            {metrics.critical}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
            Action Required
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-[#EF4444]"
            style={{ width: `${Math.min(100, metrics.critical * 33)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#64748B]">
            Resolved Actions
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span
            style={{ fontFamily: PP }}
            className="text-2xl font-bold text-[#111827]"
          >
            {metrics.completed}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600">
            Completed
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-purple-600"
            style={{ width: `${Math.min(100, metrics.completed * 25)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
