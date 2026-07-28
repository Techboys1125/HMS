import { useState } from "react";
import {
  Users,
  Activity,
  CheckSquare,
  AlertTriangle,
  Check,
} from "lucide-react";
import { DKpi, Av, SH, PP, RB } from "../components/DashboardShared";

const NURSE_PATIENTS = [
  {
    name: "Sarah Mitchell",
    room: "OPD-1",
    bp: "145/92",
    hr: "88",
    temp: "37.2",
    spo2: "97",
    status: "alert",
    nextCheck: "10:30",
  },
  {
    name: "James Thornton",
    room: "OPD-2",
    bp: "132/84",
    hr: "76",
    temp: "36.8",
    spo2: "98",
    status: "stable",
    nextCheck: "11:00",
  },
  {
    name: "Emma Reyes",
    room: "OPD-5",
    bp: "118/76",
    hr: "82",
    temp: "37.0",
    spo2: "99",
    status: "stable",
    nextCheck: "11:30",
  },
  {
    name: "Robert Chen",
    room: "OPD-3",
    bp: "152/98",
    hr: "94",
    temp: "37.8",
    spo2: "95",
    status: "alert",
    nextCheck: "10:15",
  },
  {
    name: "Aisha Kumar",
    room: "OPD-4",
    bp: "120/78",
    hr: "70",
    temp: "36.6",
    spo2: "99",
    status: "stable",
    nextCheck: "12:00",
  },
];

const NURSE_TASKS = [
  { task: "Morning vitals round — OPD Wing A", done: true },
  { task: "Patient check-in support — Reception", done: true },
  { task: "Vitals update — Sarah Mitchell", done: false },
  { task: "Vitals update — Robert Chen (urgent)", done: false },
  { task: "Handover notes — end of shift", done: false },
  { task: "Afternoon vitals round — OPD Wing B", done: false },
];

export function NurseDashboard() {
  const [tasks, setTasks] = useState(NURSE_TASKS.map((t) => ({ ...t })));
  const doneTasks = tasks.filter((t) => t.done).length;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi
          title="Assigned Patients"
          value="14"
          sub="Today's vitals queue"
          trend="2 check-outs today"
          up={true}
          data={[
            { v: 16 },
            { v: 15 },
            { v: 15 },
            { v: 14 },
            { v: 16 },
            { v: 15 },
            { v: 14 },
          ]}
          color="#0D47A1"
          gid="n1"
          Icon={Users}
        />
        <DKpi
          title="Vitals Pending"
          value="6"
          sub="Due this hour"
          trend="3 overdue — urgent"
          up={false}
          data={[
            { v: 3 },
            { v: 4 },
            { v: 2 },
            { v: 6 },
            { v: 5 },
            { v: 7 },
            { v: 6 },
          ]}
          color="#EF4444"
          gid="n2"
          Icon={Activity}
        />
        <DKpi
          title="Check-Ins Today"
          value="34"
          sub="Patients checked in"
          trend="+6 from avg"
          up={true}
          data={[
            { v: 22 },
            { v: 26 },
            { v: 25 },
            { v: 28 },
            { v: 30 },
            { v: 32 },
            { v: 34 },
          ]}
          color="#F59E0B"
          gid="n3"
          Icon={CheckSquare}
        />
        <DKpi
          title="Tasks Complete"
          value={`${doneTasks}/${tasks.length}`}
          sub="Today's checklist"
          trend={`${Math.round((doneTasks / tasks.length) * 100)}% done`}
          up={true}
          data={[
            { v: 1 },
            { v: 2 },
            { v: 2 },
            { v: 2 },
            { v: 2 },
            { v: 2 },
            { v: doneTasks },
          ]}
          color="#66BB6A"
          gid="n4"
          Icon={CheckSquare}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Patient Monitoring */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <SH title="Vitals Queue" sub="Today's vitals check status" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {[
                    "Patient",
                    "Room",
                    "BP",
                    "HR",
                    "Temp",
                    "SpO₂",
                    "Next Check",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#64748B]"
                      style={{ fontFamily: RB }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {NURSE_PATIENTS.map((p) => (
                  <tr
                    key={p.name}
                    className={`hover:bg-slate-50 transition-colors ${p.status === "alert" ? "bg-red-50/30" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Av name={p.name} size="sm" />
                        <span
                          className="text-sm font-medium text-[#111827] truncate max-w-[120px]"
                          style={{ fontFamily: RB }}
                        >
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#64748B]">
                      {p.room}
                    </td>
                    <td
                      className={`px-4 py-3 font-mono text-xs font-bold ${parseInt(p.bp) > 140 ? "text-[#EF4444]" : "text-[#111827]"}`}
                    >
                      {p.bp}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#111827]">
                      {p.hr}
                    </td>
                    <td
                      className={`px-4 py-3 font-mono text-xs font-semibold ${parseFloat(p.temp) > 37.5 ? "text-[#EF4444]" : "text-[#111827]"}`}
                    >
                      {p.temp}°C
                    </td>
                    <td
                      className={`px-4 py-3 font-mono text-xs font-bold ${parseInt(p.spo2) < 96 ? "text-[#EF4444]" : "text-[#66BB6A]"}`}
                    >
                      {p.spo2}%
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#0D47A1] font-semibold">
                      {p.nextCheck}
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "alert" && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-bold text-[#EF4444] bg-red-50 px-1.5 py-0.5 rounded-full"
                          style={{ fontFamily: RB }}
                        >
                          <AlertTriangle size={8} /> ALERT
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Medication + Tasks */}
        <div className="flex flex-col gap-5">
          {/* Quick Notes */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Quick Notes" sub="Clinical observations" />
            <div className="space-y-2.5">
              {[
                {
                  note: "Sarah Mitchell — BP elevated, re-check in 30 min",
                  time: "09:15",
                  color: "#EF4444",
                },
                {
                  note: "Robert Chen — SpO₂ 95%, monitor closely",
                  time: "09:42",
                  color: "#F59E0B",
                },
                {
                  note: "Emma Reyes — vitals normal, next check 11:30",
                  time: "10:05",
                  color: "#66BB6A",
                },
                {
                  note: "James Thornton — stable, afternoon check scheduled",
                  time: "10:22",
                  color: "#009688",
                },
              ].map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB]"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 mt-1"
                    style={{ background: n.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs text-[#111827] leading-snug"
                      style={{ fontFamily: RB }}
                    >
                      {n.note}
                    </div>
                    <span className="font-mono text-[10px] text-[#64748B]">
                      {n.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#0D47A1] text-[#0D47A1] text-xs font-semibold hover:bg-blue-50 transition-colors"
              style={{ fontFamily: PP }}
            >
              + Add Note
            </button>
          </div>

          {/* Tasks Checklist */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH
              title="Today's Tasks"
              sub={`${doneTasks}/${tasks.length} completed`}
            />
            <div className="space-y-2">
              {tasks.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 cursor-pointer group"
                  onClick={() =>
                    setTasks((prev) =>
                      prev.map((p, j) =>
                        j === i ? { ...p, done: !p.done } : p,
                      ),
                    )
                  }
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 mt-0.5 transition-all ${t.done ? "bg-[#0D47A1] border-[#0D47A1]" : "border-gray-300 group-hover:border-[#0D47A1]"}`}
                  >
                    {t.done && (
                      <Check size={9} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span
                    className={`text-xs leading-snug transition-colors ${t.done ? "text-[#64748B] line-through" : "text-[#111827]"}`}
                    style={{ fontFamily: RB }}
                  >
                    {t.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
