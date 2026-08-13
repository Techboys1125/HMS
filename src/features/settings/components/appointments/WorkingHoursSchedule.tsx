import { useState } from "react";
import { Calendar, Save } from "lucide-react";
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
  return drafts[day.dayOfWeek] || schedule.find((item) => item.dayOfWeek === day.dayOfWeek) || day;
}

export function WorkingHoursSchedule({
  schedule,
  loading,
  saving,
  onSave,
  onSaveBreaks,
}: WorkingHoursScheduleProps) {
  const [drafts, setDrafts] = useState<Record<string, OpdWeeklyScheduleDay>>({});
  const days = schedule.weeklySchedule;

  const updateDay = (day: OpdWeeklyScheduleDay, patch: Partial<OpdWeeklyScheduleDay>) => {
    setDrafts((current) => ({
      ...current,
      [day.dayOfWeek]: { ...dayValue(days, current, day), ...patch },
    }));
  };

  const updateInterval = (day: OpdWeeklyScheduleDay, field: "startTime" | "endTime", value: string) => {
    const current = dayValue(days, drafts, day);
    const interval = current.workingIntervals[0] || { startTime: "", endTime: "" };
    updateDay(day, { workingIntervals: [{ ...interval, [field]: value }, ...current.workingIntervals.slice(1)] });
  };

  const updateBreak = (day: OpdWeeklyScheduleDay, field: keyof OpdBreak, value: string) => {
    const current = dayValue(days, drafts, day);
    const item = current.breaks[0] || { breakName: "Lunch Break", startTime: "", endTime: "" };
    updateDay(day, { breaks: [{ ...item, [field]: value }, ...current.breaks.slice(1)] });
  };

  const saveAll = async () => {
    await onSave({
      weeklySchedule: days.map((day) => dayValue(days, drafts, day)),
    });
    setDrafts({});
  };

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 style={{ fontFamily: PP }} className="flex items-center gap-2 text-[15px] font-bold text-[#111827]">
          <Calendar size={18} className="text-[#0D47A1]" /> Section 03: OPD Weekly Working Hours Schedule
        </h3>
        <button className="inline-flex items-center gap-1 rounded-lg bg-[#0D47A1] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50" disabled={saving || loading || days.length === 0} onClick={() => void saveAll()}>
          <Save size={14} /> Save Schedule
        </button>
      </div>
      {loading ? <p className="text-sm text-slate-500">Loading OPD schedule...</p> : days.length === 0 ? <p className="text-sm text-slate-500">No OPD weekly schedule configured.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#475569]"><th className="p-3">Day</th><th className="p-3">Open</th><th className="p-3">Opening</th><th className="p-3">Closing</th><th className="p-3">Break</th><th className="p-3">Break Start</th><th className="p-3">Break End</th><th className="p-3">Action</th></tr></thead>
            <tbody>{days.map((day) => { const current = dayValue(days, drafts, day); const interval = current.workingIntervals[0] || { startTime: "", endTime: "" }; const breakItem = current.breaks[0] || { breakName: "Lunch Break", startTime: "", endTime: "" }; return (
              <tr key={day.dayOfWeek} className="border-b border-[#F1F5F9]">
                <td className="p-3 font-bold">{day.dayOfWeek}</td>
                <td className="p-3"><input type="checkbox" checked={current.open} onChange={(e) => updateDay(day, { open: e.target.checked })} /></td>
                <td className="p-3"><input className="w-24 rounded border border-[#D1D5DB] px-2 py-1" value={interval.startTime} disabled={!current.open} onChange={(e) => updateInterval(day, "startTime", e.target.value)} /></td>
                <td className="p-3"><input className="w-24 rounded border border-[#D1D5DB] px-2 py-1" value={interval.endTime} disabled={!current.open} onChange={(e) => updateInterval(day, "endTime", e.target.value)} /></td>
                <td className="p-3"><input className="w-28 rounded border border-[#D1D5DB] px-2 py-1" value={breakItem.breakName} disabled={!current.open} onChange={(e) => updateBreak(day, "breakName", e.target.value)} /></td>
                <td className="p-3"><input className="w-24 rounded border border-[#D1D5DB] px-2 py-1" value={breakItem.startTime} disabled={!current.open} onChange={(e) => updateBreak(day, "startTime", e.target.value)} /></td>
                <td className="p-3"><input className="w-24 rounded border border-[#D1D5DB] px-2 py-1" value={breakItem.endTime} disabled={!current.open} onChange={(e) => updateBreak(day, "endTime", e.target.value)} /></td>
                <td className="p-3"><button className="rounded border border-[#D1D5DB] px-2 py-1 text-xs font-semibold disabled:opacity-50" disabled={saving || !current.open} onClick={() => void onSaveBreaks(day.dayOfWeek, current.breaks)}>{saving ? "Saving" : "Save Break"}</button></td>
              </tr>
            ); })}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
