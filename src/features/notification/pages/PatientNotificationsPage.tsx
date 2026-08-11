import { useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  Clock,
  Pill,
  CreditCard,
  CheckCircle2,
  Info,
  X,
  RefreshCw,
  Filter,
  ChevronRight,
} from "lucide-react";
import { PP, RB } from "../constants/notifications.constants";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useDeleteNotification,
} from "../hooks/useNotifications";
import { mapApiNotificationsToRecords } from "../services/notification.mapper";
import type { NotificationRecord } from "../types/notifications.types";

export type PatientNotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "appointment" | "queue" | "prescription" | "billing" | "general";
  read: boolean;
};

const CATEGORY_TO_TYPE: Record<string, PatientNotificationItem["type"]> = {
  Appointments: "appointment",
  Queue: "queue",
  Prescriptions: "prescription",
  Billing: "billing",
  Invoices: "billing",
  Payments: "billing",
};

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  appointment: {
    icon: Calendar,
    color: "text-[#0D47A1]",
    bg: "bg-blue-50 border-blue-200",
  },
  queue: {
    icon: Clock,
    color: "text-[#009688]",
    bg: "bg-teal-50 border-teal-200",
  },
  prescription: {
    icon: Pill,
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  billing: {
    icon: CreditCard,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  general: {
    icon: Info,
    color: "text-slate-700",
    bg: "bg-slate-50 border-slate-200",
  },
};

export function PatientNotificationsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { data: pageData, isLoading, refetch } = useNotifications(0, 50);
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const notifications = useMemo<PatientNotificationItem[]>(() => {
    const records: NotificationRecord[] = mapApiNotificationsToRecords(
      pageData?.notifications,
      "Patient Portal",
    );
    return records.map((r) => ({
      id: r.id,
      title: r.title,
      message: r.description,
      time: r.timestamp,
      type: CATEGORY_TO_TYPE[r.category] ?? "general",
      read: r.status !== "Unread",
    }));
  }, [pageData]);

  const markAsRead = (id: string) => {
    if (!notifications.find((n) => n.id === id)?.read) {
      markReadMutation.mutate(id);
    }
  };

  const markAllAsRead = async () => {
    await markAllReadMutation.mutateAsync();
    triggerToast("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    deleteMutation.mutate(id);
    triggerToast("Notification deleted");
  };

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 size={16} className="text-[#66BB6A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#EF4444] border border-red-100">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p
            className="text-xs text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Stay updated with your appointments, queue, prescriptions, and
            bills.
          </p>
          <div
            className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1"
            style={{ fontFamily: RB }}
          >
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Notifications</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markAllReadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors shadow-sm"
            >
              <CheckCircle2 size={14} /> Mark all read
            </button>
          )}
          <button
            onClick={() => {
              refetch();
              triggerToast("Notifications refreshed");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#64748B]" />
          <span className="text-xs font-semibold text-[#64748B]">Filter:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            "All",
            "Unread",
            "appointment",
            "queue",
            "prescription",
            "billing",
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-[#0D47A1] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f === "All"
                ? "All"
                : f === "Unread"
                  ? "Unread"
                  : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-sm">
            <Bell
              size={32}
              className="mx-auto text-slate-300 mb-3 animate-pulse"
            />
            <h3 className="text-sm font-bold text-[#111827]">
              Loading notifications
            </h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center shadow-sm">
            <Bell size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-[#111827]">
              No notifications
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.general;
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={`bg-white p-4 rounded-2xl border shadow-sm flex items-start gap-4 transition-colors ${
                  notif.read
                    ? "border-[#E5E7EB]"
                    : "border-[#0D47A1]/30 bg-blue-50/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0D47A1] text-[10px] font-bold hover:bg-blue-100 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-[#EF4444] hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
