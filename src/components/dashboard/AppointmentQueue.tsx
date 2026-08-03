import { useState } from "react";
import { Download } from "lucide-react";
import type { AppStatus } from "../../types/app.types";
import { APPOINTMENTS } from "../../constants/dashboard";
import { Avatar } from "../common/Avatar";
import { StatusBadge } from "../common/StatusBadge";

export function AppointmentQueue({
  onPatientSelect,
}: {
  onPatientSelect: (id: number) => void;
}) {
  const [filter, setFilter] = useState<AppStatus | "all">("all");
  const filtered =
    filter === "all"
      ? APPOINTMENTS
      : APPOINTMENTS.filter((a) => a.status === filter);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-slate-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <div className="text-sm font-semibold text-[#111827]">
            Today's Queue
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {APPOINTMENTS.length} appointments ·{" "}
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
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${filter === s ? "bg-white text-[#0D47A1] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
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
                onClick={() => onPatientSelect(apt.id)}
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs font-medium text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">
                    {apt.time}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={apt.patient} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-[#111827] leading-tight">
                        {apt.patient}
                      </div>
                      <div className="text-xs text-slate-400">
                        {apt.gender}/{apt.age} · {apt.mrn}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600">
                    {apt.complaint}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600 font-medium">
                    {apt.doctor}
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
      </div>
    </div>
  );
}
