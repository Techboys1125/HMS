import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import type { AppStatus } from "../../types/app.types";
import { Avatar } from "../../common/components/Avatar";
import { StatusBadge } from "../../features/appointments/components/StatusBadge";
import { formatTime } from "../../lib/time-utils";
import { appointmentService } from "../../features/appointments/services/appointment.service";
import type { AppointmentRecord } from "../../features/appointments/types/appointment.types";

export function AppointmentQueue({
  onPatientSelect,
}: {
  onPatientSelect: (id: number) => void;
}) {
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const data = await appointmentService.listAppointments({ date: today });
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-slate-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <div className="text-sm font-semibold text-[#111827]">
            Today's Queue
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {appointments.length} appointments ·{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-gray-100">
            {(
              [
                "all",
                "waiting",
                "in-progress",
                "checked-in",
                "scheduled",
                "completed",
              ] as const
            ).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${filter === s ? "bg-white text-[#0D47A1] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {s === "all"
                  ? "All"
                  : s === "in-progress"
                    ? "Active"
                    : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-100 text-xs text-slate-500 hover:bg-slate-50 transition-colors">
            <Download size={12} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Loading appointments...
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {["Time", "Patient", "Complaint", "Doctor", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onPatientSelect(Number(apt.patientId))}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-medium text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">
                      {formatTime(apt.timeSlot || apt.startTime)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={apt.patientName} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-[#111827] leading-tight">
                          {apt.patientName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {apt.patientGender}/{apt.patientAge} · {apt.mrn}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-slate-600">
                      {apt.chiefComplaint || apt.reason}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-slate-600 font-medium">
                      {apt.doctorName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs font-medium text-[#0D47A1] opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
