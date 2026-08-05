import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import type {
  DoctorRecord,
  DoctorCalendarDayItem,
} from "../../types/doctors.types";
import { PP } from "../../constants/doctors.constants";
import { doctorsService } from "../../services/doctors.service";

import { resolveDoctorId } from "../../services/doctorProfile.service";

export interface MonthlyCalendarTabProps {
  doctor: DoctorRecord;
  canEdit: boolean;
}

const DAY_STATUS_STYLE: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-[#009688] border-emerald-300",
  PARTIALLY_AVAILABLE: "bg-yellow-50 text-[#F59E0B] border-yellow-300",
  BLOCKED: "bg-red-50 text-[#EF4444] border-red-300",
  OFF_DAY: "bg-slate-100 text-slate-400 border-slate-200",
  ON_LEAVE: "bg-amber-50 text-[#F59E0B] border-amber-300",
};

export function MonthlyCalendarTab({ doctor }: MonthlyCalendarTabProps) {
  const [days, setDays] = useState<DoctorCalendarDayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [month] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const targetId = resolveDoctorId(doctor);
    doctorsService
      .getMonthlyCalendarAvailability(targetId, month)
      .then((data) => {
        if (!cancelled && data) setDays(data.days || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctor, month]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-[#0D47A1]" />
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Monthly Availability Calendar
        </h3>
      </div>

      {days.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">
          No calendar data available.
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-bold text-[#64748B] py-1"
            >
              {d}
            </div>
          ))}
          {days.map((day) => (
            <div
              key={day.date}
              className={`rounded-lg border p-2 text-center text-[10px] ${DAY_STATUS_STYLE[day.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}
            >
              <div className="font-bold">{new Date(day.date).getDate()}</div>
              <div className="mt-0.5 capitalize">
                {day.status
                  .replace("_", " ")
                  .split(" ")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </div>
              <div className="text-[9px] mt-0.5 opacity-70">
                {day.availableSlots}/{day.totalSlots}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
