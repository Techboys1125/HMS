import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  CalendarDays,
  Settings2,
  CalendarCheck2,
  Coffee,
  Lock,
  CalendarOff,
  Plane,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";
import { doctorsApi } from "../api/doctors.api";
import { PP, RB } from "../constants/doctors.constants";
import type {
  ApiWeeklyScheduleData,
  ApiScheduleExceptionItem,
  DoctorMonthlyAvailabilityData,
  DoctorDailyAvailabilityData,
  DoctorCalendarDayItem,
  DayOfWeek,
} from "../types/doctors.types";

type ScheduleTab = "weekly" | "exceptions" | "availability" | "monthly";

const WEEK_DAYS: { api: DayOfWeek; short: string; label: string }[] = [
  { api: "MONDAY", short: "MON", label: "Monday" },
  { api: "TUESDAY", short: "TUE", label: "Tuesday" },
  { api: "WEDNESDAY", short: "WED", label: "Wednesday" },
  { api: "THURSDAY", short: "THU", label: "Thursday" },
  { api: "FRIDAY", short: "FRI", label: "Friday" },
  { api: "SATURDAY", short: "SAT", label: "Saturday" },
  { api: "SUNDAY", short: "SUN", label: "Sunday" },
];

const formatTime = (time?: string | null): string => {
  if (!time) return "";
  const trimmed = String(time).trim();
  if (/AM|PM/i.test(trimmed)) return trimmed;
  const parts = trimmed.split(":");
  if (parts.length < 2) return trimmed;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  if (isNaN(hour)) return trimmed;
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${minute} ${suffix}`;
};

const SCHEDULE_STATUS_META: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  AVAILABLE: {
    label: "Fully Available",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  PARTIALLY_AVAILABLE: {
    label: "Partially Available",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  BLOCKED: {
    label: "Blocked",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  OFF_DAY: {
    label: "Off Day",
    badge: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
  ON_LEAVE: {
    label: "On Leave",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
};

const SLOT_STATUS_META: Record<
  string,
  { label: string; card: string; text: string; icon: typeof CheckCircle2 }
> = {
  AVAILABLE: {
    label: "Available",
    card: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  BOOKED: {
    label: "Booked",
    card: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: CalendarCheck2,
  },
  BREAK: {
    label: "Break",
    card: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: Coffee,
  },
  BLOCKED: {
    label: "Blocked",
    card: "bg-slate-100 border-slate-300",
    text: "text-slate-600",
    icon: Lock,
  },
  ON_LEAVE: {
    label: "On Leave",
    card: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    icon: Plane,
  },
  OFF_DAY: {
    label: "Off Day",
    card: "bg-slate-50 border-slate-200",
    text: "text-slate-400",
    icon: CalendarOff,
  },
};

const EXCEPTION_TYPE_META: Record<string, string> = {
  VACATION: "bg-amber-100 text-amber-700",
  SURGERY: "bg-red-100 text-red-700",
  TRAINING: "bg-blue-100 text-blue-700",
  CONFERENCE: "bg-indigo-100 text-indigo-700",
  EMERGENCY: "bg-orange-100 text-orange-700",
  OTHER: "bg-slate-100 text-slate-600",
};

const EXCEPTION_STATUS_META: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-slate-100 text-slate-600",
  EXPIRED: "bg-gray-100 text-gray-500",
};

const CALENDAR_DAY_META: Record<
  string,
  { label: string; cell: string; badge: string }
> = {
  AVAILABLE: {
    label: "Available",
    cell: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  PARTIALLY_AVAILABLE: {
    label: "Partial",
    cell: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  BLOCKED: {
    label: "Blocked",
    cell: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
  },
  OFF_DAY: {
    label: "Off Day",
    cell: "bg-slate-50 border-slate-200",
    badge: "bg-slate-100 text-slate-500",
  },
  ON_LEAVE: {
    label: "Leave",
    cell: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
};

const FALLBACK_WEEKLY: ApiWeeklyScheduleData = {
  doctorId: 0,
  weeklySchedule: WEEK_DAYS.map((day) => ({
    dayOfWeek: day.api,
    workingDay:
      day.api === "MONDAY" ||
      day.api === "TUESDAY" ||
      day.api === "WEDNESDAY" ||
      day.api === "THURSDAY" ||
      day.api === "FRIDAY",
    workingPeriods:
      day.api === "MONDAY" ||
      day.api === "TUESDAY" ||
      day.api === "WEDNESDAY" ||
      day.api === "THURSDAY" ||
      day.api === "FRIDAY"
        ? [
            {
              startTime: "09:00",
              endTime: "17:00",
              slotDurationMinutes: 15,
              breaks: [
                { startTime: "13:00", endTime: "14:00", breakType: "LUNCH" },
              ],
            },
          ]
        : [],
  })),
};

export function DoctorScheduleScreen() {
  const { user } = useAuthStore();
  const doctorId = user?.doctorId || user?.doctorProfile?.doctorId;
  const [activeTab, setActiveTab] = useState<ScheduleTab>("weekly");
  const [isLoading, setIsLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] =
    useState<ApiWeeklyScheduleData | null>(null);
  const [scheduleExceptions, setScheduleExceptions] = useState<
    ApiScheduleExceptionItem[]
  >([]);
  const [dailyAvailability, setDailyAvailability] =
    useState<DoctorDailyAvailabilityData | null>(null);
  const [monthlyCalendar, setMonthlyCalendar] =
    useState<DoctorMonthlyAvailabilityData | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const [prevFetchKey, setPrevFetchKey] = useState<string>("");
  const fetchKey = `${doctorId}_${activeTab}_${activeTab === "monthly" ? calendarMonth : ""}`;
  if (fetchKey !== prevFetchKey) {
    setPrevFetchKey(fetchKey);
    setIsLoading(Boolean(doctorId));
  }

  useEffect(() => {
    if (!doctorId || activeTab !== "weekly") return;
    let cancelled = false;
    doctorsApi
      .getWeeklySchedule(doctorId)
      .then((data) => {
        if (!cancelled) setWeeklySchedule(data || FALLBACK_WEEKLY);
      })
      .catch(() => {
        if (!cancelled) setWeeklySchedule(FALLBACK_WEEKLY);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId, activeTab]);

  useEffect(() => {
    if (!doctorId || activeTab !== "exceptions") return;
    let cancelled = false;
    doctorsApi
      .getScheduleExceptions(doctorId)
      .then((data) => {
        if (!cancelled) setScheduleExceptions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setScheduleExceptions([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId, activeTab]);

  useEffect(() => {
    if (!doctorId || activeTab !== "availability") return;
    let cancelled = false;
    doctorsApi
      .getDailyAvailability(doctorId, today)
      .then((data) => {
        if (!cancelled) setDailyAvailability(data);
      })
      .catch(() => {
        if (!cancelled) setDailyAvailability(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId, activeTab, today]);

  useEffect(() => {
    if (!doctorId || activeTab !== "monthly") return;
    let cancelled = false;
    doctorsApi
      .getMonthlyCalendarAvailability(doctorId, calendarMonth)
      .then((data) => {
        if (!cancelled) setMonthlyCalendar(data);
      })
      .catch(() => {
        if (!cancelled) setMonthlyCalendar(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId, activeTab, calendarMonth]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const shiftMonth = (delta: number) => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const next = new Date(year, month - 1 + delta, 1);
    setCalendarMonth(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const calendarDaysByDate = new Map<string, DoctorCalendarDayItem>();
  (monthlyCalendar?.days || []).forEach((d) =>
    calendarDaysByDate.set(d.date, d),
  );

  const buildCalendarGrid = () => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            My Schedule
          </h1>
          <p
            className="text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            View your weekly schedule, leave days, and live slot availability.
          </p>
        </div>
        <button
          onClick={() =>
            triggerToast("Schedule management is handled by hospital admin.")
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
          style={{ fontFamily: PP }}
        >
          <Settings2 size={16} />
          Manage Schedule
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-1 p-2 border-b border-[#E5E7EB] overflow-x-auto">
          {[
            { id: "weekly", label: "Weekly Schedule", Icon: CalendarDays },
            {
              id: "exceptions",
              label: "Leave & Exceptions",
              Icon: AlertTriangle,
            },
            { id: "availability", label: "Daily Availability", Icon: Clock },
            { id: "monthly", label: "Monthly Calendar", Icon: CalendarRange },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ScheduleTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#0D47A1] text-white shadow-sm"
                  : "text-[#64748B] hover:bg-slate-50"
              }`}
              style={{ fontFamily: PP }}
            >
              <tab.Icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "weekly" && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw
                    size={20}
                    className="animate-spin text-[#0D47A1]"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                  {WEEK_DAYS.map((day) => {
                    const dayData =
                      weeklySchedule?.weeklySchedule?.find(
                        (d) => d.dayOfWeek === day.api,
                      ) ||
                      FALLBACK_WEEKLY.weeklySchedule.find(
                        (d) => d.dayOfWeek === day.api,
                      );
                    const isWorking = Boolean(dayData?.workingDay);
                    const periods = isWorking
                      ? dayData?.workingPeriods || []
                      : [];
                    return (
                      <div
                        key={day.api}
                        className={`p-4 rounded-2xl border ${
                          isWorking
                            ? "bg-white border-[#E5E7EB]"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div
                          className="text-xs font-bold text-[#64748B] mb-3"
                          style={{ fontFamily: PP }}
                        >
                          {day.short}
                        </div>
                        {isWorking ? (
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                size={14}
                                className="text-emerald-600"
                              />
                              <span
                                className="text-xs font-semibold text-emerald-700"
                                style={{ fontFamily: PP }}
                              >
                                Available
                              </span>
                            </div>
                            {periods.length === 0 && (
                              <div className="text-[11px] text-[#64748B]">
                                Working day, no periods configured.
                              </div>
                            )}
                            {periods.map((period) => (
                              <div
                                key={period.id || period.startTime}
                                className="space-y-1"
                              >
                                <div
                                  className="text-[11px] text-[#0D47A1] font-mono font-semibold"
                                  style={{ fontFamily: RB }}
                                >
                                  {formatTime(period.startTime)} -{" "}
                                  {formatTime(period.endTime)}
                                </div>
                                <div className="text-[10px] text-[#64748B]">
                                  {period.slotDurationMinutes || 15} min slots
                                </div>
                                {period.breaks && period.breaks.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {period.breaks.map((brk) => (
                                      <span
                                        key={brk.id || brk.startTime}
                                        className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-semibold"
                                      >
                                        {brk.breakType}{" "}
                                        {formatTime(brk.startTime)}-
                                        {formatTime(brk.endTime)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              size={14}
                              className="text-amber-500"
                            />
                            <span
                              className="text-xs font-medium text-amber-700"
                              style={{ fontFamily: PP }}
                            >
                              Off Day
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "exceptions" && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw
                    size={20}
                    className="animate-spin text-[#0D47A1]"
                  />
                </div>
              ) : scheduleExceptions.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays
                    size={40}
                    className="mx-auto text-slate-300 mb-3"
                  />
                  <p
                    className="text-sm text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    No leave or schedule exceptions found.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduleExceptions.map((ex) => {
                    const type = (
                      ex.type ||
                      ex.exceptionType ||
                      "VACATION"
                    ).toUpperCase();
                    const status = (ex.status || "ACTIVE").toUpperCase();
                    const typeClass =
                      EXCEPTION_TYPE_META[type] || "bg-blue-100 text-blue-700";
                    const statusClass =
                      EXCEPTION_STATUS_META[status] ||
                      "bg-emerald-100 text-emerald-700";
                    const isFullDay =
                      ex.isFullDay === true ||
                      ex.fullDay === true ||
                      (!ex.startTime && !ex.endTime);
                    return (
                      <div
                        key={
                          ex.id || ex.exceptionDate || ex.startDate || ex.reason
                        }
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-[#E5E7EB]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              type === "VACATION"
                                ? "bg-amber-50 text-amber-600"
                                : type === "SURGERY"
                                  ? "bg-red-50 text-red-600"
                                  : type === "EMERGENCY"
                                    ? "bg-orange-50 text-orange-600"
                                    : type === "CONFERENCE"
                                      ? "bg-indigo-50 text-indigo-600"
                                      : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {type === "SURGERY" ? (
                              <Settings2 size={18} />
                            ) : (
                              <Calendar size={18} />
                            )}
                          </div>
                          <div>
                            <div
                              className="text-sm font-bold text-[#111827]"
                              style={{ fontFamily: PP }}
                            >
                              {ex.reason || type || "Schedule Exception"}
                            </div>
                            <div
                              className="text-xs text-[#64748B]"
                              style={{ fontFamily: RB }}
                            >
                              {ex.startDate || ex.exceptionDate}{" "}
                              {ex.endDate && ex.endDate !== ex.startDate
                                ? `- ${ex.endDate}`
                                : ""}
                              {!isFullDay && ex.startTime
                                ? `  •  ${formatTime(ex.startTime)} - ${formatTime(ex.endTime)}`
                                : isFullDay
                                  ? "  •  Full Day"
                                  : ""}
                            </div>
                            {ex.reason && (
                              <div className="text-[11px] text-[#94A3B8]">
                                {ex.action || "BLOCK_APPOINTMENTS"}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold ${typeClass}`}
                            style={{ fontFamily: PP }}
                          >
                            {type}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${statusClass}`}
                            style={{ fontFamily: PP }}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "availability" && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw
                    size={20}
                    className="animate-spin text-[#0D47A1]"
                  />
                </div>
              ) : dailyAvailability ? (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {new Date(today).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    {(SCHEDULE_STATUS_META[
                      String(
                        dailyAvailability.scheduleStatus || "",
                      ).toUpperCase()
                    ] ||
                      SCHEDULE_STATUS_META.AVAILABLE) && (
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          SCHEDULE_STATUS_META[
                            String(
                              dailyAvailability.scheduleStatus || "",
                            ).toUpperCase()
                          ]?.badge || "bg-emerald-100 text-emerald-700"
                        }`}
                        style={{ fontFamily: PP }}
                      >
                        {SCHEDULE_STATUS_META[
                          String(
                            dailyAvailability.scheduleStatus || "",
                          ).toUpperCase()
                        ]?.label ||
                          dailyAvailability.scheduleStatus ||
                          "Available"}
                      </span>
                    )}
                  </div>
                  {(dailyAvailability.slots || []).length === 0 ? (
                    <div className="text-center py-12">
                      <Clock
                        size={40}
                        className="mx-auto text-slate-300 mb-3"
                      />
                      <p
                        className="text-sm text-[#64748B]"
                        style={{ fontFamily: RB }}
                      >
                        No slots available for this day.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {dailyAvailability.slots.map((slot) => {
                        const status = (
                          slot.status || "AVAILABLE"
                        ).toUpperCase();
                        const meta =
                          SLOT_STATUS_META[status] ||
                          SLOT_STATUS_META.AVAILABLE;
                        const Icon = meta.icon;
                        return (
                          <div
                            key={`${slot.startTime}-${slot.endTime}`}
                            className={`p-4 rounded-2xl border ${meta.card}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Icon size={16} className={meta.text} />
                              <span
                                className={`text-sm font-bold ${meta.text}`}
                                style={{ fontFamily: PP }}
                              >
                                {meta.label}
                              </span>
                            </div>
                            <div
                              className="text-xs font-mono"
                              style={{ fontFamily: RB }}
                            >
                              {formatTime(slot.startTime)} -{" "}
                              {formatTime(slot.endTime)}
                            </div>
                            {(slot.reason || status === "BREAK") && (
                              <div
                                className="text-[10px] text-[#94A3B8] mt-1"
                                style={{ fontFamily: RB }}
                              >
                                {slot.reason ||
                                  (status === "BREAK" ? "Break period" : "")}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock size={40} className="mx-auto text-slate-300 mb-3" />
                  <p
                    className="text-sm text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    No availability data for today.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "monthly" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3
                    className="text-base font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {new Date(`${calendarMonth}-01`).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </h3>
                  <p
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Daily booking status for{" "}
                    {doctorId ? `doctor #${doctorId}` : "your profile"}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => shiftMonth(-1)}
                    className="p-2 rounded-xl border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => shiftMonth(1)}
                    className="p-2 rounded-xl border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw
                    size={20}
                    className="animate-spin text-[#0D47A1]"
                  />
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (d) => (
                        <div
                          key={d}
                          className="text-center text-[11px] font-bold text-[#94A3B8]"
                          style={{ fontFamily: PP }}
                        >
                          {d}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {buildCalendarGrid().map((dayNum, i) => {
                      if (dayNum === null) {
                        return <div key={i} />;
                      }
                      const dateStr = `${calendarMonth}-${String(dayNum).padStart(2, "0")}`;
                      const dayInfo = calendarDaysByDate.get(dateStr);
                      const status = String(
                        dayInfo?.status || "",
                      ).toUpperCase();
                      const meta = CALENDAR_DAY_META[status];
                      return (
                        <div
                          key={dateStr}
                          className={`min-h-22 rounded-xl border p-2 flex flex-col gap-1 ${
                            meta ? meta.cell : "bg-white border-[#E5E7EB]"
                          }`}
                        >
                          <div
                            className="text-xs font-bold text-[#64748B]"
                            style={{ fontFamily: PP }}
                          >
                            {dayNum}
                          </div>
                          {meta ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-center ${meta.badge}`}
                              style={{ fontFamily: PP }}
                            >
                              {meta.label}
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-300">—</span>
                          )}
                          {dayInfo ? (
                            <div
                              className="text-[9px] text-[#64748B] font-mono"
                              style={{ fontFamily: RB }}
                            >
                              {dayInfo.availableSlots ?? 0} free
                              {typeof dayInfo.totalSlots === "number" &&
                                ` / ${dayInfo.totalSlots}`}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMsg}
          </span>
        </div>
      )}
    </div>
  );
}
