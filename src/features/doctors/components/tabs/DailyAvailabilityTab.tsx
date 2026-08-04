import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import type { DoctorRecord, DoctorDailySlot } from "../../types/doctors.types";
import { PP } from "../../constants/doctors.constants";
import { doctorsService } from "../../services/doctors.service";

export interface DailyAvailabilityTabProps {
  doctor: DoctorRecord;
  canEdit: boolean;
}

const SLOT_STATUS_STYLE: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-[#009688] border-emerald-200",
  BOOKED: "bg-red-50 text-[#EF4444] border-red-200",
  BREAK: "bg-purple-50 text-purple-600 border-purple-200",
  BLOCKED: "bg-amber-50 text-[#F59E0B] border-amber-200",
  OFF_DAY: "bg-slate-100 text-slate-500 border-slate-200",
};

export function DailyAvailabilityTab({ doctor }: DailyAvailabilityTabProps) {
  const [slots, setSlots] = useState<DoctorDailySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [date] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    doctorsService.getDailyAvailability(doctor.id, date)
      .then((data) => {
        if (!cancelled && data) setSlots(data.slots || []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [doctor.id, date]);

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">Loading availability...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-[#0D47A1]" />
        <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Today's Slot-by-Slot Availability</h3>
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">No availability data for today.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {slots.map((slot, idx) => (
            <div key={idx} className={`px-3 py-2 rounded-xl border text-xs font-medium ${SLOT_STATUS_STYLE[slot.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <span>{slot.startTime} - {slot.endTime}</span>
                <span className="capitalize">{slot.status.replace("_", " ")}</span>
              </div>
              {slot.reason && <div className="text-[10px] mt-0.5 opacity-70">{slot.reason}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}