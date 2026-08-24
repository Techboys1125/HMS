import { Bell } from "lucide-react";
import type { NotificationRecord } from "../types/notifications.types";
import { PP } from "../constants/notifications.constants";
import { NotificationCategoryIcon } from "./NotificationCategoryIcon";

export interface NotificationListProps {
  items: NotificationRecord[];
  currentRole: string;
  isLoading?: boolean;
  error?: string;
  onOpenAction: (item: NotificationRecord) => void;
  onOpenModule: (item: NotificationRecord) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function NotificationList({
  items,
  currentRole,
  isLoading,
  error,
  onOpenAction,
  onOpenModule,
  onToggleRead,
  onDelete,
  onPreviousPage,
  onNextPage,
  canGoPrevious,
  canGoNext,
}: NotificationListProps) {
  return (
    <div>
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0D47A1] mb-4 animate-pulse">
              <Bell className="w-8 h-8" />
            </div>
            <h3
              style={{ fontFamily: PP }}
              className="text-lg font-bold text-[#111827]"
            >
              Loading notifications...
            </h3>
            <p className="mt-1 text-xs text-[#64748B] max-w-sm">
              Fetching the latest alerts for your role ({currentRole}).
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-700 mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h3
              style={{ fontFamily: PP }}
              className="text-lg font-bold text-red-800"
            >
              Unable to load notifications
            </h3>
            <p className="mt-1 text-xs text-red-700 max-w-sm">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0D47A1] mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h3
              style={{ fontFamily: PP }}
              className="text-lg font-bold text-[#111827]"
            >
              No notifications available
            </h3>
            <p className="mt-1 text-xs text-[#64748B] max-w-sm">
              Everything is up to date! There are no matching alerts found for
              your role ({currentRole}).
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isUnread = item.status === "Unread";
            const isCritical =
              item.priority === "Critical" || item.priority === "High";

            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                  isUnread
                    ? "border-[#0D47A1]/30 bg-blue-50/20"
                    : "border-[#E5E7EB]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <NotificationCategoryIcon category={item.category} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          style={{ fontFamily: PP }}
                          className="text-sm font-semibold text-[#111827]"
                        >
                          {item.title}
                        </h4>
                        {isCritical && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                            {item.priority}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isUnread
                              ? "bg-blue-100 text-[#0D47A1]"
                              : item.status === "Completed"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-100 text-[#64748B]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[#64748B]">
                        <span className="font-semibold text-[#009688]">
                          {item.module}
                        </span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenAction(item)}
                      className="rounded-lg border border-[#0D47A1]/20 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#0D47A1] hover:bg-blue-100"
                    >
                      {item.actionLabel || "Open Action"}
                    </button>
                    <button
                      onClick={() => onOpenModule(item)}
                      className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-[11px] font-bold text-[#111827] hover:bg-slate-50"
                    >
                      Open Module
                    </button>
                    <button
                      onClick={() => onToggleRead(item.id)}
                      className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-[11px] font-bold text-[#64748B] hover:bg-slate-50 hover:text-[#111827]"
                    >
                      {isUnread ? "Mark as Read" : "Mark Unread"}
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-[#B91C1C] hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm mt-4">
          <span className="text-xs text-[#64748B]">
            Showing{" "}
            <span className="font-semibold text-[#111827]">
              1–{items.length}
            </span>{" "}
            of {items.length} notifications
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={!canGoPrevious}
              onClick={onPreviousPage}
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm disabled:opacity-50 hover:bg-slate-50 transition"
            >
              Previous
            </button>
            <button
              disabled={!canGoNext}
              onClick={onNextPage}
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm disabled:opacity-50 hover:bg-slate-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
