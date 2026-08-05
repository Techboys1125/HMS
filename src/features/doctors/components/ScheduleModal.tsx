import { useState, useEffect, useCallback } from "react";
import {
  X,
  Calendar,
  RefreshCw,
  CheckCircle2,
  Plus,
  Trash2,
  Pencil,
  Coffee,
  AlertTriangle,
  Save,
} from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import type {
  ApiWeeklyScheduleData,
  ApiWorkingPeriod,
  ApiScheduleBreak,
  ApiScheduleExceptionItem,
  DayOfWeek,
  BreakType,
  UpdateScheduleDayPayload,
  UpdateScheduleDayWorkingPeriodPayload,
  CreateScheduleExceptionPayload,
  ExceptionType,
  ExceptionAction,
} from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";
import { doctorsApi } from "../api/doctors.api";

const WEEK_DAYS: { api: DayOfWeek; short: string; label: string }[] = [
  { api: "MONDAY", short: "MON", label: "Monday" },
  { api: "TUESDAY", short: "TUE", label: "Tuesday" },
  { api: "WEDNESDAY", short: "WED", label: "Wednesday" },
  { api: "THURSDAY", short: "THU", label: "Thursday" },
  { api: "FRIDAY", short: "FRI", label: "Friday" },
  { api: "SATURDAY", short: "SAT", label: "Saturday" },
  { api: "SUNDAY", short: "SUN", label: "Sunday" },
];

const BREAK_TYPES: BreakType[] = ["LUNCH", "TEA", "MEETING", "PERSONAL"];
const EXCEPTION_TYPES: ExceptionType[] = [
  "VACATION",
  "TRAINING",
  "CONFERENCE",
  "SURGERY",
  "EMERGENCY",
  "OTHER",
];
const EXCEPTION_ACTIONS: ExceptionAction[] = [
  "BLOCK_APPOINTMENTS",
];

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

const periodToDraft = (
  p: ApiWorkingPeriod,
): UpdateScheduleDayWorkingPeriodPayload => ({
  startTime: p.startTime,
  endTime: p.endTime,
  slotDurationMinutes: p.slotDurationMinutes || 15,
  breaks: (p.breaks || []).map((b) => ({
    startTime: b.startTime,
    endTime: b.endTime,
    breakType: b.breakType,
  })),
});

const EMPTY_EXCEPTION_FORM = {
  exceptionType: "VACATION" as ExceptionType,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  startTime: "14:00",
  endTime: "15:00",
  isFullDay: true,
  reason: "",
  action: "BLOCK_APPOINTMENTS" as ExceptionAction,
};

export interface ScheduleModalProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
}

export function ScheduleModal({ isOpen, doctor, onClose }: ScheduleModalProps) {
  const doctorId = doctor?.doctorId;

  const [tab, setTab] = useState<"weekly" | "exceptions">("weekly");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [weekly, setWeekly] = useState<ApiWeeklyScheduleData | null>(null);
  const [exceptions, setExceptions] = useState<ApiScheduleExceptionItem[]>([]);

  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  const [draft, setDraft] = useState<UpdateScheduleDayPayload | null>(null);

  const [exceptionFormOpen, setExceptionFormOpen] = useState(false);
  const [editingException, setEditingException] =
    useState<ApiScheduleExceptionItem | null>(null);
  const [exceptionForm, setExceptionForm] = useState(EMPTY_EXCEPTION_FORM);

  const [confirmDeleteException, setConfirmDeleteException] =
    useState<ApiScheduleExceptionItem | null>(null);
  const [confirmDeletePeriod, setConfirmDeletePeriod] = useState<{
    day: DayOfWeek;
    periodId: number;
  } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 3000);
  }, []);

  const loadWeekly = useCallback(async () => {
    if (!doctorId) return;
    setIsLoading(true);
    const data = await doctorsApi.getWeeklySchedule(doctorId);
    setWeekly(data);
    setIsLoading(false);
  }, [doctorId]);

  const loadExceptions = useCallback(async () => {
    if (!doctorId) return;
    const data = await doctorsApi.getScheduleExceptions(doctorId);
    setExceptions(Array.isArray(data) ? data : []);
  }, [doctorId]);

  const [prevModalKey, setPrevModalKey] = useState<string>("");
  const modalKey = isOpen ? `${doctorId}_${isOpen}` : "";
  if (modalKey !== prevModalKey) {
    setPrevModalKey(modalKey);
    if (isOpen) {
      setTab("weekly");
      setEditingDay(null);
      setDraft(null);
      setExceptionFormOpen(false);
      setEditingException(null);
      setIsLoading(Boolean(doctorId));
    }
  }

  useEffect(() => {
    if (!isOpen || !doctorId) return;
    let cancelled = false;
    Promise.all([
      doctorsApi.getWeeklySchedule(doctorId),
      doctorsApi.getScheduleExceptions(doctorId),
    ])
      .then(([weeklyData, excData]) => {
        if (cancelled) return;
        setWeekly(weeklyData);
        setExceptions(Array.isArray(excData) ? excData : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, doctorId]);

  // Render-phase toast clear when modal closes
  if (!isOpen && toastMsg !== null) {
    setToastMsg(null);
  }

  if (!isOpen || !doctor) return null;

  const startEditDay = (day: DayOfWeek) => {
    const existing = weekly?.weeklySchedule?.find((d) => d.dayOfWeek === day);
    const workingPeriods = existing?.workingDay
      ? (existing.workingPeriods || []).map(periodToDraft)
      : [];
    if (workingPeriods.length === 0) {
      workingPeriods.push({
        startTime: "09:00",
        endTime: "17:00",
        slotDurationMinutes: 15,
        breaks: [{ startTime: "13:00", endTime: "14:00", breakType: "LUNCH" }],
      });
    }
    setEditingDay(day);
    setDraft({
      isWorkingDay: existing?.workingDay ?? false,
      workingPeriods,
    });
  };

  const cancelEditDay = () => {
    setEditingDay(null);
    setDraft(null);
  };

  const saveDay = async () => {
    if (!doctorId || !editingDay || !draft) return;
    const cleaned: UpdateScheduleDayPayload = {
      isWorkingDay: draft.isWorkingDay,
      workingPeriods: draft.workingPeriods
        .map((p) => ({
          startTime: p.startTime,
          endTime: p.endTime,
          slotDurationMinutes: p.slotDurationMinutes || 15,
          breaks: (p.breaks || [])
            .filter((b) => b.startTime && b.endTime)
            .map((b) => ({
              startTime: b.startTime,
              endTime: b.endTime,
              breakType: b.breakType,
            })),
        }))
        .filter((p) => p.startTime && p.endTime),
    };
    setIsSaving(true);
    const ok = await doctorsApi.updateWeeklyScheduleDay(
      doctorId,
      editingDay,
      cleaned,
    );
    setIsSaving(false);
    if (ok) {
      showToast(`${editingDay} schedule updated successfully.`);
      cancelEditDay();
      await loadWeekly();
    } else {
      showToast("Failed to update schedule. Please try again.");
    }
  };

  const handleConfirmDeletePeriod = async () => {
    if (!doctorId || !confirmDeletePeriod) return;
    const { periodId } = confirmDeletePeriod;
    const ok = await doctorsApi.deleteWorkingPeriod(doctorId, periodId);
    setConfirmDeletePeriod(null);
    if (ok) {
      showToast("Working period deleted successfully.");
      await loadWeekly();
    } else {
      showToast("Failed to delete working period.");
    }
  };

  const openCreateException = () => {
    setEditingException(null);
    setExceptionForm({ ...EMPTY_EXCEPTION_FORM });
    setExceptionFormOpen(true);
  };

  const openEditException = (ex: ApiScheduleExceptionItem) => {
    const isFullDay =
      ex.isFullDay === true ||
      ex.fullDay === true ||
      (!ex.startTime && !ex.endTime);
    setEditingException(ex);
    setExceptionForm({
      exceptionType: (ex.exceptionType as ExceptionType) || "VACATION",
      startDate:
        ex.startDate ||
        ex.exceptionDate ||
        new Date().toISOString().slice(0, 10),
      endDate:
        ex.endDate ||
        ex.startDate ||
        ex.exceptionDate ||
        new Date().toISOString().slice(0, 10),
      startTime: ex.startTime || "14:00",
      endTime: ex.endTime || "15:00",
      isFullDay,
      reason: ex.reason || "",
      action: (ex.action as ExceptionAction) || "BLOCK_APPOINTMENTS",
    });
    setExceptionFormOpen(true);
  };

  const submitException = async () => {
    if (!doctorId) return;
    const payload: CreateScheduleExceptionPayload = {
      exceptionType: exceptionForm.exceptionType,
      startDate: exceptionForm.startDate,
      endDate: exceptionForm.endDate,
      startTime: exceptionForm.isFullDay
        ? null
        : exceptionForm.startTime || null,
      endTime: exceptionForm.isFullDay ? null : exceptionForm.endTime || null,
      isFullDay: exceptionForm.isFullDay,
      reason: exceptionForm.reason.trim() || undefined,
      action: exceptionForm.action,
    };
    setIsSaving(true);
    const ok = editingException?.id
      ? await doctorsApi.updateScheduleException(
          doctorId,
          editingException.id,
          payload,
        )
      : await doctorsApi.createScheduleException(doctorId, payload);
    setIsSaving(false);
    if (ok) {
      showToast(
        editingException?.id
          ? "Schedule exception updated successfully."
          : "Schedule exception created successfully.",
      );
      setExceptionFormOpen(false);
      setEditingException(null);
      await loadExceptions();
    } else {
      showToast("Failed to save schedule exception.");
    }
  };

  const handleConfirmDeleteException = async () => {
    if (!doctorId || !confirmDeleteException) return;
    const id = confirmDeleteException.id;
    if (id === undefined) {
      setConfirmDeleteException(null);
      return;
    }
    const ok = await doctorsApi.deleteScheduleException(doctorId, id);
    setConfirmDeleteException(null);
    if (ok) {
      showToast("Schedule exception deleted successfully.");
      await loadExceptions();
    } else {
      showToast("Failed to delete schedule exception.");
    }
  };

  const setDraftPeriod = (
    index: number,
    patch: Partial<UpdateScheduleDayWorkingPeriodPayload>,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const workingPeriods = prev.workingPeriods.map((p, i) =>
        i === index ? { ...p, ...patch } : p,
      );
      return { ...prev, workingPeriods };
    });
  };

  const setDraftBreak = (
    periodIndex: number,
    breakIndex: number,
    patch: Partial<ApiScheduleBreak>,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const workingPeriods = prev.workingPeriods.map((p, i) => {
        if (i !== periodIndex) return p;
        const breaks = (p.breaks || []).map((b, bi) =>
          bi === breakIndex ? { ...b, ...patch } : b,
        );
        return { ...p, breaks };
      });
      return { ...prev, workingPeriods };
    });
  };

  const addPeriod = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        workingPeriods: [
          ...prev.workingPeriods,
          {
            startTime: "09:00",
            endTime: "12:00",
            slotDurationMinutes: 15,
            breaks: [],
          },
        ],
      };
    });
  };

  const removePeriod = (index: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        workingPeriods: prev.workingPeriods.filter((_, i) => i !== index),
      };
    });
  };

  const addBreak = (periodIndex: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const workingPeriods = prev.workingPeriods.map((p, i) => {
        if (i !== periodIndex) return p;
        return {
          ...p,
          breaks: [
            ...(p.breaks || []),
            {
              startTime: "13:00",
              endTime: "14:00",
              breakType: "LUNCH" as BreakType,
            },
          ],
        };
      });
      return { ...prev, workingPeriods };
    });
  };

  const removeBreak = (periodIndex: number, breakIndex: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const workingPeriods = prev.workingPeriods.map((p, i) => {
        if (i !== periodIndex) return p;
        return {
          ...p,
          breaks: (p.breaks || []).filter((_, bi) => bi !== breakIndex),
        };
      });
      return { ...prev, workingPeriods };
    });
  };

  const inputClass =
    "w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-xs text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold text-sm flex items-center justify-center border border-purple-100">
              <Calendar size={20} />
            </div>
            <div>
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Schedule Management
              </h3>
              <p className="text-xs text-[#64748B]">
                {doctor.name} &bull; {doctor.department} &bull;{" "}
                {weekly?.doctorName ? weekly.doctorName : doctor.empId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#E5E7EB] shrink-0">
          {[
            { id: "weekly", label: "Weekly Schedule" },
            { id: "exceptions", label: "Leave & Exceptions" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as "weekly" | "exceptions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-[#0D47A1] text-white shadow-sm"
                  : "text-[#64748B] hover:bg-slate-50"
              }`}
              style={{ fontFamily: PP }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw size={22} className="animate-spin text-[#0D47A1]" />
            </div>
          ) : tab === "weekly" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Weekly Working Schedule
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Configure working days, sessions (periods), breaks, and slot
                    duration. Changes apply every week until modified.
                  </p>
                </div>
                <button
                  onClick={loadWeekly}
                  className="p-2 rounded-xl border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {!weekly && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                  <p
                    className="text-sm text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    No weekly schedule configured yet. Click "Edit" on any day
                    to get started.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {WEEK_DAYS.map((day) => {
                  const dayData = weekly?.weeklySchedule?.find(
                    (d) => d.dayOfWeek === day.api,
                  );
                  const isWorking = Boolean(dayData?.workingDay);
                  const periods = isWorking
                    ? dayData?.workingPeriods || []
                    : [];
                  const isEditing = editingDay === day.api;
                  return (
                    <div
                      key={day.api}
                      className={`rounded-xl border p-3.5 flex flex-col gap-2.5 ${
                        isEditing
                          ? "border-[#0D47A1] ring-2 ring-[#0D47A1]/20 bg-blue-50/40"
                          : isWorking
                            ? "bg-white border-[#E5E7EB]"
                            : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {day.label}
                        </span>
                        {isEditing ? (
                          <span className="text-[9px] font-bold text-[#0D47A1] bg-blue-100 px-2 py-0.5 rounded-full">
                            EDITING
                          </span>
                        ) : (
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isWorking
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {isWorking ? "ON" : "OFF"}
                          </span>
                        )}
                      </div>

                      {isEditing && draft ? (
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={draft.isWorkingDay}
                              onChange={(e) =>
                                setDraft((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        isWorkingDay: e.target.checked,
                                      }
                                    : prev,
                                )
                              }
                              className="w-3.5 h-3.5 accent-[#0D47A1]"
                            />
                            <span className="text-[11px] font-semibold text-[#111827]">
                              Working day
                            </span>
                          </label>

                          {draft.isWorkingDay && (
                            <div className="space-y-2">
                              {draft.workingPeriods.map((period, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="bg-white rounded-lg border border-[#E5E7EB] p-2.5 space-y-2"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="time"
                                      value={period.startTime}
                                      onChange={(e) =>
                                        setDraftPeriod(pIdx, {
                                          startTime: e.target.value,
                                        })
                                      }
                                      className={inputClass}
                                    />
                                    <span className="text-[10px] text-[#94A3B8]">
                                      to
                                    </span>
                                    <input
                                      type="time"
                                      value={period.endTime}
                                      onChange={(e) =>
                                        setDraftPeriod(pIdx, {
                                          endTime: e.target.value,
                                        })
                                      }
                                      className={inputClass}
                                    />
                                    <button
                                      onClick={() => removePeriod(pIdx)}
                                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors shrink-0"
                                      title="Remove period"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-[#64748B] shrink-0">
                                      Slot duration (min)
                                    </span>
                                    <input
                                      type="number"
                                      min={5}
                                      max={120}
                                      step={5}
                                      value={period.slotDurationMinutes}
                                      onChange={(e) =>
                                        setDraftPeriod(pIdx, {
                                          slotDurationMinutes:
                                            parseInt(e.target.value, 10) || 15,
                                        })
                                      }
                                      className={`${inputClass} w-20`}
                                    />
                                  </div>

                                  {(period.breaks || []).length > 0 && (
                                    <div className="space-y-1.5 pt-1 border-t border-dashed border-[#E5E7EB]">
                                      <div className="text-[10px] font-bold text-[#64748B] flex items-center gap-1">
                                        <Coffee size={11} /> Breaks
                                      </div>
                                      {(period.breaks || []).map(
                                        (brk, bIdx) => (
                                          <div
                                            key={bIdx}
                                            className="flex items-center gap-1.5"
                                          >
                                            <select
                                              value={brk.breakType}
                                              onChange={(e) =>
                                                setDraftBreak(pIdx, bIdx, {
                                                  breakType: e.target
                                                    .value as BreakType,
                                                })
                                              }
                                              className={inputClass}
                                            >
                                              {BREAK_TYPES.map((bt) => (
                                                <option key={bt} value={bt}>
                                                  {bt}
                                                </option>
                                              ))}
                                            </select>
                                            <input
                                              type="time"
                                              value={brk.startTime}
                                              onChange={(e) =>
                                                setDraftBreak(pIdx, bIdx, {
                                                  startTime: e.target.value,
                                                })
                                              }
                                              className={inputClass}
                                            />
                                            <span className="text-[10px] text-[#94A3B8]">
                                              to
                                            </span>
                                            <input
                                              type="time"
                                              value={brk.endTime}
                                              onChange={(e) =>
                                                setDraftBreak(pIdx, bIdx, {
                                                  endTime: e.target.value,
                                                })
                                              }
                                              className={inputClass}
                                            />
                                            <button
                                              onClick={() =>
                                                removeBreak(pIdx, bIdx)
                                              }
                                              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors shrink-0"
                                              title="Remove break"
                                            >
                                              <X size={12} />
                                            </button>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}

                                  <button
                                    onClick={() => addBreak(pIdx)}
                                    className="text-[10px] font-semibold text-[#0D47A1] hover:underline flex items-center gap-1"
                                  >
                                    <Plus size={11} /> Add break
                                  </button>
                                </div>
                              ))}

                              <button
                                onClick={addPeriod}
                                className="w-full text-[11px] font-semibold text-[#0D47A1] border border-dashed border-[#0D47A1]/40 rounded-lg py-2 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                              >
                                <Plus size={12} /> Add working period
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={saveDay}
                              disabled={isSaving}
                              className="flex-1 px-3 py-2 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              <Save size={12} />
                              {isSaving ? "Saving..." : "Save Day"}
                            </button>
                            <button
                              onClick={cancelEditDay}
                              className="px-3 py-2 rounded-lg border border-[#E5E7EB] text-[#64748B] text-[11px] font-semibold hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 flex-1">
                          {isWorking ? (
                            periods.length === 0 ? (
                              <div className="text-[10px] text-[#64748B]">
                                Working day, no periods.
                              </div>
                            ) : (
                              periods.map((period, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-50 rounded-lg border border-[#E5E7EB] px-2.5 py-1.5"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-[#0D47A1] font-mono">
                                      {formatTime(period.startTime)} -{" "}
                                      {formatTime(period.endTime)}
                                    </span>
                                    {period.id !== undefined && (
                                      <button
                                        onClick={() =>
                                          setConfirmDeletePeriod({
                                            day: day.api,
                                            periodId: period.id as number,
                                          })
                                        }
                                        className="p-1 text-slate-300 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                        title="Delete working period"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <span className="text-[9px] text-[#64748B]">
                                      {period.slotDurationMinutes || 15} min
                                    </span>
                                    {(period.breaks || []).map((brk, bIdx) => (
                                      <span
                                        key={bIdx}
                                        className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-semibold"
                                      >
                                        {brk.breakType}{" "}
                                        {formatTime(brk.startTime)}-
                                        {formatTime(brk.endTime)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )
                          ) : (
                            <div className="text-[10px] text-slate-400">
                              Doctor is OFF on {day.label}.
                            </div>
                          )}
                        </div>
                      )}

                      {!isEditing && (
                        <button
                          onClick={() => startEditDay(day.api)}
                          className="mt-auto w-full px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[10px] font-bold text-[#64748B] hover:text-[#0D47A1] hover:border-[#0D47A1]/40 hover:bg-blue-50/40 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Pencil size={11} /> Edit {day.short}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Schedule Exceptions
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Leaves, surgeries, meetings, or personal blocks that
                    override the weekly schedule.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadExceptions}
                    className="p-2 rounded-xl border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={openCreateException}
                    className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Exception
                  </button>
                </div>
              </div>

              {exceptions.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                  <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
                  <p
                    className="text-sm text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    No schedule exceptions. Click "Add Exception" to create one.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {exceptions.map((ex) => {
                    const type = (ex.exceptionType || "VACATION").toUpperCase();
                    const status = (ex.status || "ACTIVE").toUpperCase();
                    const isFullDay =
                      ex.isFullDay === true ||
                      ex.fullDay === true ||
                      (!ex.startTime && !ex.endTime);
                    return (
                      <div
                        key={ex.id ?? String(ex.startDate)}
                        className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-[#E5E7EB]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              type === "VACATION"
                                ? "bg-amber-50 text-amber-600"
                                : type === "SURGERY"
                                  ? "bg-red-50 text-red-600"
                                  : type === "EMERGENCY"
                                    ? "bg-orange-50 text-orange-600"
                                    : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            <Calendar size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs font-bold text-[#111827]"
                                style={{ fontFamily: PP }}
                              >
                                {ex.reason || type || "Schedule Exception"}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${EXCEPTION_TYPE_META[type] || "bg-blue-100 text-blue-700"}`}
                              >
                                {type}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${EXCEPTION_STATUS_META[status] || "bg-emerald-100 text-emerald-700"}`}
                              >
                                {status}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#64748B] mt-0.5">
                              {ex.startDate || ex.exceptionDate}{" "}
                              {ex.endDate && ex.endDate !== ex.startDate
                                ? `- ${ex.endDate}`
                                : ""}
                              {!isFullDay && ex.startTime
                                ? `  •  ${formatTime(ex.startTime)} - ${formatTime(ex.endTime)}`
                                : isFullDay
                                  ? "  •  Full Day"
                                  : ""}
                              {ex.action ? `  •  ${ex.action}` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditException(ex)}
                            className="p-2 text-slate-400 hover:text-[#0D47A1] rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit exception"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteException(ex)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete exception"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {exceptionFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
                <h4
                  className="text-sm font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {editingException?.id
                    ? "Edit Schedule Exception"
                    : "New Schedule Exception"}
                </h4>
                <button
                  onClick={() => {
                    setExceptionFormOpen(false);
                    setEditingException(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#64748B] mb-1">
                      Exception Type
                    </label>
                    <select
                      value={exceptionForm.exceptionType}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({
                          ...prev,
                          exceptionType: e.target.value as ExceptionType,
                        }))
                      }
                      className={inputClass}
                    >
                      {EXCEPTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#64748B] mb-1">
                      Action
                    </label>
                    <select
                      value={exceptionForm.action}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({
                          ...prev,
                          action: e.target.value as ExceptionAction,
                        }))
                      }
                      className={inputClass}
                    >
                      {EXCEPTION_ACTIONS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#64748B] mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exceptionForm.startDate}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#64748B] mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exceptionForm.endDate}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exceptionForm.isFullDay}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({
                          ...prev,
                          isFullDay: e.target.checked,
                        }))
                      }
                      className="w-3.5 h-3.5 accent-[#0D47A1]"
                    />
                    <span className="text-[11px] font-semibold text-[#111827]">
                      Full day
                    </span>
                  </label>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">
                    When unchecked, only the time window below is blocked.
                  </p>
                </div>
                {!exceptionForm.isFullDay && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={exceptionForm.startTime}
                        onChange={(e) =>
                          setExceptionForm((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={exceptionForm.endTime}
                        onChange={(e) =>
                          setExceptionForm((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold text-[#64748B] mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={exceptionForm.reason}
                    onChange={(e) =>
                      setExceptionForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    placeholder="e.g. Family vacation, conference, surgery..."
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setExceptionFormOpen(false);
                    setEditingException(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitException}
                  disabled={
                    isSaving ||
                    !exceptionForm.startDate ||
                    !exceptionForm.endDate
                  }
                  className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save size={13} />
                  {isSaving
                    ? "Saving..."
                    : editingException?.id
                      ? "Update Exception"
                      : "Create Exception"}
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteException && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertTriangle size={17} />
                  </div>
                  <h4
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Delete Schedule Exception?
                  </h4>
                </div>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  This will cancel the{" "}
                  <span className="font-semibold text-[#111827]">
                    {confirmDeleteException.exceptionType || "exception"}
                  </span>{" "}
                  for{" "}
                  <span className="font-semibold text-[#111827]">
                    {confirmDeleteException.startDate}
                  </span>
                  {confirmDeleteException.endDate &&
                    confirmDeleteException.endDate !==
                      confirmDeleteException.startDate &&
                    ` - ${confirmDeleteException.endDate}`}
                  . Appointments already booked for this period are not
                  affected.
                </p>
              </div>
              <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmDeleteException(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteException}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Delete Exception
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeletePeriod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertTriangle size={17} />
                  </div>
                  <h4
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Delete Working Period?
                  </h4>
                </div>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  This working session on{" "}
                  <span className="font-semibold text-[#111827]">
                    {confirmDeletePeriod.day}
                  </span>{" "}
                  will be removed from the weekly schedule. Existing
                  appointments for that day are not affected.
                </p>
              </div>
              <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmDeletePeriod(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeletePeriod}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Delete Period
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Changes apply to all future appointments for this doctor.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
            style={{ fontFamily: PP }}
          >
            Done
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-60 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMsg}
          </span>
        </div>
      )}
    </div>
  );
}
