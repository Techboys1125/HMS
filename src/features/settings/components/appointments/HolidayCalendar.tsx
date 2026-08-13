import { useState } from "react";
import { Calendar, Plus, Power } from "lucide-react";
import type { OpdHoliday, OpdHolidayPayload } from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";

interface HolidayCalendarProps {
  holidays: OpdHoliday[];
  loading: boolean;
  saving: boolean;
  onAdd: (payload: OpdHolidayPayload) => Promise<void>;
  onToggle: (holiday: OpdHoliday) => Promise<void>;
}

export function HolidayCalendar({
  holidays,
  loading,
  saving,
  onAdd,
  onToggle,
}: HolidayCalendarProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!name.trim() || !date) return;
    await onAdd({
      holidayDate: date,
      holidayName: name.trim(),
      holidayType: "NATIONAL",
      description: description.trim() || undefined,
      isFullDay: true,
    });
    setName("");
    setDate("");
    setDescription("");
  };

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <h3 style={{ fontFamily: PP }} className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#111827]">
        <Calendar size={18} className="text-[#0D47A1]" /> Section 05: Official Holiday & Closure Calendar
      </h3>
      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-[1fr_160px_1fr_auto]">
        <input className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm" placeholder="Holiday name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#0D47A1] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={saving || !name.trim() || !date} onClick={() => void handleAdd()}>
          <Plus size={14} /> Add Holiday
        </button>
      </div>
      {loading ? <p className="text-sm text-slate-500">Loading holidays...</p> : holidays.length === 0 ? <p className="text-sm text-slate-500">No OPD holidays configured.</p> : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <div>
                <div className="text-sm font-bold text-[#111827]">{holiday.holidayName}</div>
                <div className="text-xs text-[#64748B]">{holiday.holidayDate} · {holiday.holidayType} · {holiday.status}</div>
                {holiday.description && <div className="mt-1 text-xs text-[#64748B]">{holiday.description}</div>}
              </div>
              <button className="inline-flex items-center gap-1 rounded-md border border-[#D1D5DB] bg-white px-2 py-1 text-xs font-semibold text-[#475569]" disabled={saving} onClick={() => void onToggle(holiday)}>
                <Power size={13} /> {holiday.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
