import { useState } from "react";
import { Calendar, Save, AlertTriangle } from "lucide-react";
import { TimeSelect } from "../../../../components/TimeSelect";
import type {
  OpdBreak,
  OpdWeeklySchedule,
  OpdWeeklyScheduleDay,
} from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";

interface WorkingHoursScheduleProps {
  schedule: OpdWeeklySchedule;
  loading: boolean;
  saving: boolean;
  onSave: (schedule: OpdWeeklySchedule) => Promise<void>;
  onSaveBreaks: (dayOfWeek: string, breaks: OpdBreak[]) => Promise<void>;
}

function dayValue(
  schedule: OpdWeeklyScheduleDay[],
  drafts: Record<string, OpdWeeklyScheduleDay>,
  day: OpdWeeklyScheduleDay,
) {
  return (
    drafts[day.dayOfWeek] ||
    schedule.find((item) => item.dayOfWeek === day.dayOfWeek) ||
    day
  );
}

function validateSchedule(days: OpdWeeklyScheduleDay[]): string[] {
  const errors: string[] = [];
  for (const day of days) {
    const current = day;
    if (current.isOpen) {
      const interval = current.workingIntervals[0];
      if (!interval?.startTime) {
        errors.push(`${day.dayOfWeek}: Opening time is required.`);
      }
      if (!interval?.endTime) {
        errors.push(`${day.dayOfWeek}: Closing time is required.`);
      }
      if (
        interval?.startTime &&
        interval?.endTime &&
        interval.startTime >= interval.endTime
      ) {
        errors.push(
          `${day.dayOfWeek}: Closing time must be after opening time.`,
        );
      }
      for (const brk of current.breaks) {
        if (brk.startTime && brk.endTime && brk.startTime >= brk.endTime) {
          errors.push(
            `${day.dayOfWeek}: Break "${brk.breakName || "Break"}" end time must be after start time.`,
          );
        }
        if (
          interval?.startTime &&
          brk.endTime &&
          brk.endTime > interval.endTime
        ) {
          errors.push(
            `${day.dayOfWeek}: Break "${brk.breakName || "Break"}" ends after hospital closing time.`,
          );
        }
      }
    }
  }
  return errors;
}

export function WorkingHoursSchedule({
  schedule,
  loading,
  saving,
  onSave,
  onSaveBreaks,
}: WorkingHoursScheduleProps) {
  const [drafts, setDrafts] = useState<Record<string, OpdWeeklyScheduleDay>>(
    {},
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const days = schedule.weeklySchedule;

  const updateDay = (
    day: OpdWeeklyScheduleDay,
    patch: Partial<OpdWeeklyScheduleDay>,
  ) => {
    setDrafts((current) => ({
      ...current,
      [day.dayOfWeek]: { ...dayValue(days, current, day), ...patch },
    }));
  };

  const updateInterval = (
    day: OpdWeeklyScheduleDay,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const current = dayValue(days, drafts, day);
    const interval = current.workingIntervals[0] || {
      startTime: "",
      endTime: "",
    };
    updateDay(day, {
      workingIntervals: [
        { ...interval, [field]: value },
        ...current.workingIntervals.slice(1),
      ],
    });
  };

  const updateBreak = (
    day: OpdWeeklyScheduleDay,
    field: keyof OpdBreak,
    value: string,
  ) => {
    const current = dayValue(days, drafts, day);
    const item = current.breaks[0] || {
      breakName: "Lunch Break",
      startTime: "",
      endTime: "",
    };
    updateDay(day, {
      breaks: [{ ...item, [field]: value }, ...current.breaks.slice(1)],
    });
  };

  const saveAll = async () => {
    const resolvedDays = days.map((day) => dayValue(days, drafts, day));
    const errors = validateSchedule(resolvedDays);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    await onSave({ weeklySchedule: resolvedDays });
    setDrafts({});
  };

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3
          style={{ fontFamily: PP }}
          className="flex items-center gap-2 text-[15px] font-bold text-[#111827]"
        >
          <Calendar size={18} className="text-[#0D47A1]" /> Section 03: OPD
          Weekly Working Hours Schedule
        </h3>
        <button
          className="inline-flex items-center gap-1 rounded-lg bg-[#0D47A1] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          disabled={saving || loading || days.length === 0}
          onClick={() => void saveAll()}
        >
          <Save size={14} /> Save Schedule
        </button>
      </div>
      {validationErrors.length > 0 && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs mb-1">
            <AlertTriangle size={13} /> Please fix the following:
          </div>
          <ul className="list-disc list-inside text-red-600 text-[11px] space-y-0.5">
            {validationErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {loading ? (
        <p className="text-sm text-slate-500">Loading OPD schedule...</p>
      ) : days.length === 0 ? (
        <p className="text-sm text-slate-500">
          No OPD weekly schedule configured.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#475569]">
                <th className="p-3">Day</th>
                <th className="p-3">Open</th>
                <th className="p-3">Opening</th>
                <th className="p-3">Closing</th>
                <th className="p-3">Break</th>
                <th className="p-3">Break Start</th>
                <th className="p-3">Break End</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const current = dayValue(days, drafts, day);
                const interval = current.workingIntervals[0] || {
                  startTime: "",
                  endTime: "",
                };
                const breakItem = current.breaks[0] || {
                  breakName: "Lunch Break",
                  startTime: "",
                  endTime: "",
                };
                return (
                  <tr key={day.dayOfWeek} className="border-b border-[#F1F5F9]">
                    <td className="p-3 font-bold">{day.dayOfWeek}</td>
                    <td className="p-3">
                      <input
                        aria-label="Toggle option"
                        type="checkbox"
                        checked={current.isOpen}
                        onChange={(e) =>
                          updateDay(day, { isOpen: e.target.checked })
                        }
                      />
                    </td>
                    <td className="p-3">
                      <TimeSelect
                        value={interval.startTime}
                        disabled={!current.isOpen}
                        onChange={(val) =>
                          updateInterval(day, "startTime", val)
                        }
                        className="w-28"
                      />
                    </td>
                    <td className="p-3">
                      <TimeSelect
                        value={interval.endTime}
                        disabled={!current.isOpen}
                        onChange={(val) => updateInterval(day, "endTime", val)}
                        className="w-28"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        aria-label="Input field"
                        className="w-28 rounded border border-[#D1D5DB] px-2 py-1"
                        value={breakItem.breakName}
                        disabled={!current.isOpen}
                        onChange={(e) =>
                          updateBreak(day, "breakName", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-3">
                      <TimeSelect
                        value={breakItem.startTime}
                        disabled={!current.isOpen}
                        onChange={(val) => updateBreak(day, "startTime", val)}
                        className="w-28"
                      />
                    </td>
                    <td className="p-3">
                      <TimeSelect
                        value={breakItem.endTime}
                        disabled={!current.isOpen}
                        onChange={(val) => updateBreak(day, "endTime", val)}
                        className="w-28"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        className="rounded border border-[#D1D5DB] px-2 py-1 text-xs font-semibold disabled:opacity-50"
                        disabled={saving || !current.isOpen}
                        onClick={() =>
                          void onSaveBreaks(day.dayOfWeek, current.breaks)
                        }
                      >
                        {saving ? "Saving" : "Save Break"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
