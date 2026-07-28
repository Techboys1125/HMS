import {
  Calendar,
  Clock,
  CheckSquare,
  Heart,
  FileText,
  Pill,
  Stethoscope,
  BarChart2,
  Bell,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import {
  DKpi,
  Av,
  Chip,
  SH,
  AlertRow,
  PP,
  RB,
} from "../components/DashboardShared";

const DOC_SCHEDULE = [
  {
    time: "08:30",
    patient: "Alex Monroe",
    complaint: "Post-op Follow-up",
    mrn: "MRN-091",
    status: "completed" as const,
    room: "OPD-1",
  },
  {
    time: "09:00",
    patient: "Sarah Mitchell",
    complaint: "Chest Pain",
    mrn: "MRN-001",
    status: "in-progress" as const,
    room: "OPD-1",
  },
  {
    time: "09:30",
    patient: "James Thornton",
    complaint: "Diabetes Follow-up",
    mrn: "MRN-002",
    status: "waiting" as const,
    room: null,
  },
  {
    time: "10:00",
    patient: "Robert Chen",
    complaint: "Cardiology Review",
    mrn: "MRN-004",
    status: "scheduled" as const,
    room: null,
  },
  {
    time: "10:30",
    patient: "Marcus Brown",
    complaint: "Hypertension F/U",
    mrn: "MRN-008",
    status: "scheduled" as const,
    room: null,
  },
  {
    time: "11:00",
    patient: "Aisha Kumar",
    complaint: "ECG Review",
    mrn: "MRN-005",
    status: "scheduled" as const,
    room: null,
  },
  {
    time: "14:00",
    patient: "Lily Anderson",
    complaint: "Thyroid Review",
    mrn: "MRN-007",
    status: "scheduled" as const,
    room: null,
  },
  {
    time: "14:30",
    patient: "Nina Patel",
    complaint: "Annual Check-up",
    mrn: "MRN-009",
    status: "scheduled" as const,
    room: null,
  },
];

const PRESCRIPTIONS_PENDING = [
  { patient: "James Thornton", drugs: "Metformin, Glimepiride", since: "20m" },
  { patient: "Robert Chen", drugs: "Atorvastatin, Ramipril", since: "45m" },
  { patient: "Aisha Kumar", drugs: "Sumatriptan", since: "1h" },
];

const DOC_PATIENT_HISTORY = [
  {
    name: "Helen Brooks",
    complaint: "General Check-up",
    diagnosis: "Healthy — Annual",
    date: "Today 08:00",
    mrn: "MRN-041",
  },
  {
    name: "Alex Monroe",
    complaint: "Post-op Follow-up",
    diagnosis: "Recovery on track",
    date: "Today 08:30",
    mrn: "MRN-091",
  },
  {
    name: "David Walsh",
    complaint: "Back Pain",
    diagnosis: "L4-L5 Disc Herniation",
    date: "Yesterday",
    mrn: "MRN-006",
  },
  {
    name: "Nina Patel",
    complaint: "Skin Allergy",
    diagnosis: "Allergic Rhinitis",
    date: "Yesterday",
    mrn: "MRN-009",
  },
  {
    name: "Carlos Mendez",
    complaint: "Joint Pain",
    diagnosis: "Osteoarthritis",
    date: "2 days ago",
    mrn: "MRN-010",
  },
];

const DOC_FOLLOW_UPS = [
  {
    patient: "James Thornton",
    date: "Tomorrow 09:30",
    reason: "HbA1c Review",
    type: "Diabetes F/U",
  },
  {
    patient: "Marcus Brown",
    date: "Thu 14:00",
    reason: "BP Med Review",
    type: "Hypertension",
  },
  {
    patient: "Aisha Kumar",
    date: "Fri 11:00",
    reason: "Post-treatment Check",
    type: "Neurology",
  },
];

const DOC_DIAGNOSIS = [
  { condition: "Cardiovascular", count: 8, color: "#EF4444" },
  { condition: "Diabetes / Endo", count: 6, color: "#F59E0B" },
  { condition: "Hypertension", count: 5, color: "#0D47A1" },
  { condition: "Respiratory", count: 4, color: "#009688" },
  { condition: "Post-operative", count: 3, color: "#66BB6A" },
  { condition: "Other", count: 2, color: "#94A3B8" },
];

const DOC_ACTIVITIES = [
  {
    action: "Consultation completed",
    detail: "Alex Monroe · 28 min",
    time: "08:58",
    Icon: CheckSquare,
    color: "#66BB6A",
  },
  {
    action: "Clinical notes updated",
    detail: "Sarah Mitchell · Chest Pain",
    time: "09:10",
    Icon: FileText,
    color: "#0D47A1",
  },
  {
    action: "Prescription signed",
    detail: "James Thornton · 3 drugs",
    time: "09:18",
    Icon: Pill,
    color: "#009688",
  },
  {
    action: "Referral sent",
    detail: "Robert Chen → Cardiology",
    time: "09:32",
    Icon: FileText,
    color: "#0D47A1",
  },
];

const DOC_MEDICAL_ALERTS = [
  {
    level: "critical" as const,
    msg: "Sarah Mitchell — BP critically high",
    time: "4m",
    sub: "165/104 mmHg — immediate attention required",
  },
  {
    level: "warning" as const,
    msg: "James Thornton — BP not controlled post-visit",
    time: "22m",
    sub: "145/92 recorded by nurse — consider medication adjustment",
  },
  {
    level: "info" as const,
    msg: "Robert Chen — Vitals updated by nurse",
    time: "41m",
    sub: "All vitals within normal range post-cardiology check",
  },
];

const DOC_QUICK_ACTIONS = [
  { label: "Open Patient Record", Icon: FileText, color: "#0D47A1" },
  { label: "Start Consultation", Icon: Stethoscope, color: "#009688" },
  { label: "Write Prescription", Icon: Pill, color: "#0D47A1" },
  { label: "Add Clinical Note", Icon: ClipboardList, color: "#009688" },
  { label: "View Reports", Icon: BarChart2, color: "#64748B" },
];

type ScheduleStatus = "completed" | "in-progress" | "waiting" | "scheduled";
const STATUS_DOT: Record<ScheduleStatus, string> = {
  completed: "bg-[#66BB6A]",
  "in-progress": "bg-[#009688]",
  waiting: "bg-[#F59E0B]",
  scheduled: "bg-slate-300",
};

export function DoctorDashboard() {
  const completed = DOC_SCHEDULE.filter((s) => s.status === "completed").length;
  const waiting = DOC_SCHEDULE.filter((s) => s.status === "waiting").length;
  const current = DOC_SCHEDULE.find((s) => s.status === "in-progress");
  const diagTotal = DOC_DIAGNOSIS.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1"
          style={{ fontFamily: PP }}
        >
          Quick Actions
        </span>
        {DOC_QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#009688]/40 hover:text-[#009688] hover:bg-teal-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi
          title="Today's Appointments"
          value="28"
          sub="Total scheduled"
          trend="4 follow-ups added"
          up={true}
          data={[
            { v: 22 },
            { v: 25 },
            { v: 23 },
            { v: 27 },
            { v: 24 },
            { v: 26 },
            { v: 28 },
          ]}
          color="#0D47A1"
          gid="d1"
          Icon={Calendar}
        />
        <DKpi
          title="Patients Waiting"
          value={String(waiting)}
          sub="In queue right now"
          trend="Avg wait: 18 min"
          up={true}
          data={[
            { v: 8 },
            { v: 6 },
            { v: 9 },
            { v: 5 },
            { v: 7 },
            { v: 4 },
            { v: waiting },
          ]}
          color="#F59E0B"
          gid="d2"
          Icon={Clock}
        />
        <DKpi
          title="Completed Today"
          value={String(completed)}
          sub="Consultations done"
          trend={`${Math.round((completed / 28) * 100)}% of today's list`}
          up={true}
          data={[
            { v: 0 },
            { v: 1 },
            { v: 2 },
            { v: 2 },
            { v: 2 },
            { v: 3 },
            { v: completed },
          ]}
          color="#66BB6A"
          gid="d3"
          Icon={CheckSquare}
        />
        <DKpi
          title="Follow-ups Pending"
          value={String(DOC_FOLLOW_UPS.length)}
          sub="Scheduled this week"
          trend="1 urgent review"
          up={false}
          data={[
            { v: 6 },
            { v: 5 },
            { v: 5 },
            { v: 4 },
            { v: 4 },
            { v: 4 },
            { v: DOC_FOLLOW_UPS.length },
          ]}
          color="#EF4444"
          gid="d4"
          Icon={Heart}
        />
      </div>

      {/* ── Active Consultation Banner ── */}
      {current && (
        <div
          className="rounded-2xl border-2 border-[#009688]/30 p-5 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #f0fdfa 0%, #e6f9ff 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#009688] animate-pulse" />
            <span
              className="text-xs font-bold text-[#009688] uppercase tracking-wide"
              style={{ fontFamily: PP }}
            >
              Active Consultation
            </span>
            <span
              className="ml-auto font-mono text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: RB }}
            >
              Started {current.time}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Av name={current.patient} size="lg" />
            <div className="flex-1">
              <div
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {current.patient}
              </div>
              <div
                className="text-sm text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                {current.complaint} · {current.mrn}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Chip label="In Progress" variant="teal" />
                {current.room && (
                  <span
                    className="text-xs font-semibold text-[#009688]"
                    style={{ fontFamily: RB }}
                  >
                    {current.room}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <FileText size={13} /> Clinical Notes
              </button>
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Pill size={13} /> Prescribe
              </button>
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#0D47A1] text-[#0D47A1] text-xs font-semibold hover:bg-blue-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                <CheckSquare size={13} /> Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Workspace ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Schedule + Patient History */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-semibold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Today's Schedule
                </div>
                <div
                  className="text-xs text-[#64748B] mt-0.5"
                  style={{ fontFamily: RB }}
                >
                  {DOC_SCHEDULE.length} appointments · {completed} completed
                </div>
              </div>
              <div
                className="flex items-center gap-3 text-[10px]"
                style={{ fontFamily: RB }}
              >
                {(
                  [
                    "completed",
                    "in-progress",
                    "waiting",
                    "scheduled",
                  ] as ScheduleStatus[]
                ).map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-1.5 text-[#64748B]"
                  >
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
                    {s === "in-progress"
                      ? "Active"
                      : s.charAt(0).toUpperCase() +
                      s.slice(1).replace("-", " ")}
                  </div>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {DOC_SCHEDULE.map((a) => (
                <div
                  key={a.time + a.patient}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${a.status === "in-progress" ? "bg-teal-50/30" : ""}`}
                >
                  <div className="font-mono text-xs font-bold text-[#0D47A1] shrink-0 w-12">
                    {a.time}
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[a.status]}`}
                  />
                  <Av name={a.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium text-[#111827] truncate"
                      style={{ fontFamily: RB }}
                    >
                      {a.patient}
                    </div>
                    <div
                      className="text-xs text-[#64748B] truncate"
                      style={{ fontFamily: RB }}
                    >
                      {a.complaint}
                    </div>
                  </div>
                  {a.room && (
                    <span
                      className="text-xs font-semibold text-[#009688] shrink-0"
                      style={{ fontFamily: RB }}
                    >
                      {a.room}
                    </span>
                  )}
                  <div className="shrink-0">
                    {a.status === "completed" && (
                      <Chip label="Done" variant="success" />
                    )}
                    {a.status === "in-progress" && (
                      <Chip label="Active" variant="teal" />
                    )}
                    {a.status === "waiting" && (
                      <Chip label="Waiting" variant="warning" />
                    )}
                    {a.status === "scheduled" && (
                      <Chip label="Scheduled" variant="default" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patient History */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <SH
                title="Recent Patient History"
                sub="Previously seen patients"
              />
            </div>
            <div className="divide-y divide-gray-50">
              {DOC_PATIENT_HISTORY.map((p) => (
                <div
                  key={p.mrn}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Av name={p.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium text-[#111827] truncate"
                      style={{ fontFamily: RB }}
                    >
                      {p.name}
                    </div>
                    <div
                      className="text-xs text-[#64748B] truncate"
                      style={{ fontFamily: RB }}
                    >
                      {p.complaint}
                    </div>
                  </div>
                  <div className="text-right shrink-0 max-w-[160px]">
                    <div
                      className="text-xs font-medium text-[#111827] truncate"
                      style={{ fontFamily: RB }}
                    >
                      {p.diagnosis}
                    </div>
                    <div
                      className="text-[10px] text-[#64748B]"
                      style={{ fontFamily: RB }}
                    >
                      {p.date}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Patient Queue */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-semibold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Patient Queue
                </div>
                <div
                  className="text-xs text-[#64748B] mt-0.5"
                  style={{ fontFamily: RB }}
                >
                  {waiting} waiting · Avg 18 min
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse" />
                <span
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Live
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {DOC_SCHEDULE.filter((s) =>
                ["in-progress", "waiting", "scheduled"].includes(s.status),
              )
                .slice(0, 5)
                .map((a, i) => (
                  <div
                    key={a.patient}
                    className={`flex items-center gap-3 px-5 py-3.5 ${a.status === "in-progress" ? "bg-teal-50/40" : ""}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${a.status === "in-progress"
                          ? "bg-[#009688] text-white"
                          : "bg-slate-100 text-[#64748B]"
                        }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium text-[#111827] truncate"
                        style={{ fontFamily: RB }}
                      >
                        {a.patient}
                      </div>
                      <div
                        className="text-xs text-[#64748B]"
                        style={{ fontFamily: RB }}
                      >
                        {a.time} · {a.complaint}
                      </div>
                    </div>
                    {a.status === "in-progress" && (
                      <Chip label="Active" variant="teal" />
                    )}
                    {a.status === "waiting" && (
                      <Chip label="Waiting" variant="warning" />
                    )}
                    {a.status === "scheduled" && (
                      <Chip label="Next" variant="info" />
                    )}
                  </div>
                ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-50">
              <button
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                style={{ fontFamily: PP }}
              >
                <Stethoscope size={13} /> Start Next Consultation
              </button>
            </div>
          </div>

          {/* Medical Alerts */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Medical Alerts" />
            <div className="space-y-2">
              {DOC_MEDICAL_ALERTS.map((a, i) => (
                <AlertRow
                  key={i}
                  level={a.level}
                  msg={a.msg}
                  time={a.time}
                  sub={a.sub}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Pending Prescriptions */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Pending Prescriptions" sub="Awaiting your signature" />
          <div className="space-y-2.5">
            {PRESCRIPTIONS_PENDING.map((p) => (
              <div
                key={p.patient}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <Pill size={12} className="text-[#009688]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-semibold text-[#111827] truncate"
                    style={{ fontFamily: PP }}
                  >
                    {p.patient}
                  </div>
                  <div
                    className="text-[10px] text-[#64748B] truncate"
                    style={{ fontFamily: RB }}
                  >
                    {p.drugs}
                  </div>
                  <div
                    className="text-[10px] text-slate-400 mt-0.5"
                    style={{ fontFamily: RB }}
                  >
                    Waiting {p.since}
                  </div>
                </div>
                <button
                  className="text-xs text-[#0D47A1] font-semibold hover:underline shrink-0"
                  style={{ fontFamily: PP }}
                >
                  Sign
                </button>
              </div>
            ))}
          </div>
          <button
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#009688] text-[#009688] text-xs font-semibold hover:bg-teal-50 transition-colors"
            style={{ fontFamily: PP }}
          >
            <Pill size={13} /> Write New Prescription
          </button>
        </div>

        {/* Diagnosis Summary */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Diagnosis Summary" sub="This month's case types" />
          <div className="space-y-3">
            {DOC_DIAGNOSIS.map((d) => (
              <div key={d.condition}>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-medium text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {d.condition}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#64748B]">
                    {d.count}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((d.count / diagTotal) * 100)}%`,
                      background: d.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Total cases this month
            </span>
            <span
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {diagTotal}
            </span>
          </div>
        </div>

        {/* Today's Activities + Upcoming Follow-ups */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Today's Activities" sub="Your clinical log" />
          <div>
            {DOC_ACTIVITIES.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 last:pb-0 relative"
              >
                {i < DOC_ACTIVITIES.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-100" />
                )}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 z-10"
                  style={{ background: a.color + "18" }}
                >
                  <a.Icon size={12} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div
                    className="text-xs font-medium text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {a.action}
                  </div>
                  <div
                    className="text-[10px] text-[#64748B] mt-0.5"
                    style={{ fontFamily: RB }}
                  >
                    {a.detail}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0 pt-0.5">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 mt-1">
            <div
              className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-3"
              style={{ fontFamily: PP }}
            >
              Upcoming Follow-ups
            </div>
            {DOC_FOLLOW_UPS.map((f) => (
              <div
                key={f.patient}
                className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-medium text-[#111827] truncate"
                    style={{ fontFamily: RB }}
                  >
                    {f.patient}
                  </div>
                  <div
                    className="text-[10px] text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {f.reason}
                  </div>
                </div>
                <span className="text-[10px] text-[#64748B] font-mono shrink-0">
                  {f.date.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
