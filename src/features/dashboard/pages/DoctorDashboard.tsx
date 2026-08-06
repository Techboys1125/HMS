import {
  Calendar,
  CheckSquare,
  Clock,
  ClipboardList,
  FileText,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Stethoscope,
  Pill,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const PP = "Poppins, system-ui, sans-serif";
const RB = "Roboto, system-ui, sans-serif";

function DKpi({
  title,
  value,
  sub,
  trend,
  up,
  data,
  color,
  gid,
  Icon,
}: {
  title: string;
  value: string;
  sub: string;
  trend: string;
  up: boolean;
  data: { v: number }[];
  color: string;
  gid: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-xs font-medium text-[#64748B] mb-1"
            style={{ fontFamily: RB }}
          >
            {title}
          </div>
          <div
            className={`${value.length > 12 ? "text-base" : value.length > 8 ? "text-lg" : "text-xl"} font-bold text-[#111827] leading-tight truncate`}
            style={{ fontFamily: PP }}
          >
            {value}
          </div>
          <div
            className="text-xs text-slate-400 mt-1 truncate"
            style={{ fontFamily: RB }}
          >
            {sub}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + "18" }}
        >
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart
          data={data}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gid})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div
        className={`flex items-center gap-1 text-xs font-medium ${up ? "text-[#66BB6A]" : "text-[#EF4444]"}`}
        style={{ fontFamily: RB }}
      >
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
  );
}

function Av({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const palette = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const bg = palette[name.charCodeAt(0) % palette.length];
  const sz = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  }[size];
  return (
    <div
      className={`${sz} ${bg} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ fontFamily: PP }}
    >
      {initials}
    </div>
  );
}

type ChipVariant =
  "success" | "warning" | "error" | "info" | "teal" | "default";
function Chip({
  label,
  variant = "default",
}: {
  label: string;
  variant?: ChipVariant;
}) {
  const map: Record<ChipVariant, string> = {
    success: "bg-green-50 text-[#66BB6A]",
    warning: "bg-amber-50 text-[#F59E0B]",
    error: "bg-red-50 text-[#EF4444]",
    info: "bg-blue-50 text-[#0D47A1]",
    teal: "bg-teal-50 text-[#009688]",
    default: "bg-slate-50 text-[#64748B]",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[variant]}`}
      style={{ fontFamily: RB }}
    >
      {label}
    </span>
  );
}

function SH({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <div
          className="text-sm font-semibold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          {title}
        </div>
        {sub && (
          <div
            className="text-xs text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
// Section 01: Consultation Progress Throughout the Day (Line Chart)
const DOC_HOURLY_PROGRESS = [
  { hour: "08 AM", completed: 2, remaining: 26 },
  { hour: "09 AM", completed: 5, remaining: 23 },
  { hour: "10 AM", completed: 9, remaining: 19 },
  { hour: "11 AM", completed: 14, remaining: 14 },
  { hour: "12 PM", completed: 17, remaining: 11 },
  { hour: "01 PM", completed: 18, remaining: 10 },
  { hour: "02 PM", completed: 20, remaining: 8 },
  { hour: "03 PM", completed: 23, remaining: 5 },
  { hour: "04 PM", completed: 26, remaining: 2 },
  { hour: "05 PM", completed: 28, remaining: 0 },
];

// Section 02: Patient Consultation Status (Donut Chart)
const DOC_PATIENT_STATUS_DIST = [
  { name: "Waiting", value: 4, color: "#F59E0B" },
  { name: "In Consultation", value: 1, color: "#009688" },
  { name: "Completed", value: 21, color: "#66BB6A" },
  { name: "Cancelled", value: 2, color: "#EF4444" },
];

// Section 03: Appointment Timeline (Clinical details without billing)
const DOC_APPT_TIMELINE = [
  {
    time: "08:30 AM",
    name: "Alex Monroe",
    age: 45,
    gender: "M",
    visitType: "Follow-up Visit",
    room: "OPD-1",
    token: "TK-101",
    status: "Completed",
  },
  {
    time: "09:00 AM",
    name: "Sarah Mitchell",
    age: 34,
    gender: "F",
    visitType: "Emergency OPD",
    room: "OPD-1",
    token: "TK-102",
    status: "In Consultation",
  },
  {
    time: "09:30 AM",
    name: "James Thornton",
    age: 58,
    gender: "M",
    visitType: "General Consultation",
    room: "OPD-1",
    token: "TK-103",
    status: "Waiting",
  },
  {
    time: "10:00 AM",
    name: "Robert Chen",
    age: 62,
    gender: "M",
    visitType: "Review Visit",
    room: "OPD-1",
    token: "TK-104",
    status: "Ready",
  },
  {
    time: "10:30 AM",
    name: "Marcus Brown",
    age: 50,
    gender: "M",
    visitType: "Follow-up Visit",
    room: "OPD-1",
    token: "TK-105",
    status: "Scheduled",
  },
  {
    time: "11:00 AM",
    name: "Aisha Kumar",
    age: 29,
    gender: "F",
    visitType: "General Consultation",
    room: "OPD-1",
    token: "TK-106",
    status: "Scheduled",
  },
  {
    time: "11:30 AM",
    name: "David Walsh",
    age: 41,
    gender: "M",
    visitType: "Review Visit",
    room: "N/A",
    token: "TK-107",
    status: "Cancelled",
  },
];

// Section 05: Consultation Types (Horizontal Bar Chart)
const DOC_CONSULTATION_TYPES = [
  { type: "General Consultation", count: 12 },
  { type: "Follow-up Visit", count: 8 },
  { type: "Review Visit", count: 5 },
  { type: "Emergency OPD", count: 3 },
];

// Section 06: Prescriptions Issued Today (Pie Chart)
const DOC_PRESCRIPTION_SUMMARY = [
  { category: "New Prescription", count: 12, color: "#0D47A1" },
  { category: "Repeat Prescription", count: 6, color: "#009688" },
  { category: "Medication Updated", count: 4, color: "#4DB6AC" },
  { category: "No Medication", count: 2, color: "#94A3B8" },
];

// Section 09: Today's Performance Summary (Statistics Table)
const DOC_PERFORMANCE_METRICS = [
  {
    metric: "Appointments Scheduled",
    today: "28",
    yesterday: "24",
    status: "Optimal",
  },
  {
    metric: "Patients Consulted",
    today: "21",
    yesterday: "18",
    status: "Ahead (+16.7%)",
  },
  {
    metric: "Average Consultation Time",
    today: "14.2 mins",
    yesterday: "15.8 mins",
    status: "Efficient (-1.6 mins)",
  },
  {
    metric: "Prescriptions Issued",
    today: "22",
    yesterday: "19",
    status: "Normal",
  },
  { metric: "Follow-up Cases", today: "8", yesterday: "6", status: "On Track" },
  {
    metric: "Cancelled Consultations",
    today: "2",
    yesterday: "3",
    status: "Low",
  },
];

const DOC_STATUS_CHIP: Record<
  string,
  "success" | "teal" | "warning" | "error" | "info" | "default"
> = {
  Completed: "success",
  "In Consultation": "teal",
  Waiting: "warning",
  Ready: "info",
  Scheduled: "default",
  Cancelled: "error",
};

const DOC_QUICK_ACTIONS = [
  { label: "Start Consultation", Icon: Stethoscope, color: "#009688" },
  { label: "Open Patient Record", Icon: FileText, color: "#0D47A1" },
  { label: "Write Prescription", Icon: Pill, color: "#0D47A1" },
  { label: "Add Clinical Note", Icon: ClipboardList, color: "#009688" },
];

export function DoctorDashboard() {
  const rxTotal = DOC_PRESCRIPTION_SUMMARY.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: "#F1F5F9" }}
    >
      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1"
          style={{ fontFamily: PP }}
        >
          Clinical Actions
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
      </div>

      {/* ── KPI Row — 5 Clinical KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi
          title="Today's Appointments"
          value="28"
          sub="Scheduled Patients Today"
          trend="+4 vs Yesterday"
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
          gid="doc1"
          Icon={Calendar}
        />
        <DKpi
          title="Patients Consulted"
          value="21"
          sub="Completed Consultations"
          trend="75% Progress Today"
          up={true}
          data={[
            { v: 8 },
            { v: 12 },
            { v: 15 },
            { v: 17 },
            { v: 19 },
            { v: 20 },
            { v: 21 },
          ]}
          color="#66BB6A"
          gid="doc2"
          Icon={CheckSquare}
        />
        <DKpi
          title="Pending Consultations"
          value="4"
          sub="Remaining Queue"
          trend="Avg Wait: 14 mins"
          up={false}
          data={[
            { v: 10 },
            { v: 9 },
            { v: 8 },
            { v: 7 },
            { v: 6 },
            { v: 5 },
            { v: 4 },
          ]}
          color="#F59E0B"
          gid="doc3"
          Icon={Clock}
        />
        <DKpi
          title="Prescriptions Issued"
          value="22"
          sub="Today's Prescriptions"
          trend="+3 vs Yesterday"
          up={true}
          data={[
            { v: 14 },
            { v: 16 },
            { v: 17 },
            { v: 19 },
            { v: 20 },
            { v: 21 },
            { v: 22 },
          ]}
          color="#009688"
          gid="doc4"
          Icon={Pill}
        />
        <DKpi
          title="Consultation Revenue"
          value="$4,200"
          sub="Earnings Today"
          trend="+$600 vs Yesterday"
          up={true}
          data={[
            { v: 2800 },
            { v: 3100 },
            { v: 3300 },
            { v: 3600 },
            { v: 3900 },
            { v: 4000 },
            { v: 4200 },
          ]}
          color="#0D47A1"
          gid="doc5"
          Icon={DollarSign}
        />
      </div>

      {/* ── Active Patient Banner (Clinical Workstation) ── */}
      <div
        className="rounded-2xl border-2 border-[#009688]/30 p-5 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #f0fdfa 0%, #e6f9ff 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#009688] animate-pulse" />
          <span
            className="text-xs font-bold text-[#009688] uppercase tracking-wide"
            style={{ fontFamily: PP }}
          >
            Active Patient Consultation
          </span>
          <span
            className="ml-auto font-mono text-xs font-semibold text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            Started 09:00 AM · Token TK-102
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap xl:flex-nowrap">
          <Av name="Sarah Mitchell" size="lg" />
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Sarah Mitchell
              </span>
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                (34 Yrs / F)
              </span>
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Visit Type: Emergency OPD · Room: OPD-1
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Chip label="In Consultation" variant="teal" />
              <span
                className="text-[11px] font-medium text-[#EF4444] bg-red-50 px-2 py-0.5 rounded border border-red-100"
                style={{ fontFamily: RB }}
              >
                High Risk: Acute Chest Pain
              </span>
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
              <CheckSquare size={13} /> Complete Visit
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Clinical Analytics Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 01: Today's Consultation Progress (Large Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Consultation Progress Throughout the Day
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                Monitors consultation pace and completed patients per hour
              </div>
            </div>
            <span
              className="text-[10px] font-semibold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: RB }}
            >
              Pace: 2.8 Patients/Hour
            </span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={DOC_HOURLY_PROGRESS}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="docProgressGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#009688" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#009688" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "#64748B", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(val: unknown, name: unknown) => [
                  `${val} Patients`,
                  name === "completed"
                    ? "Completed Consultations"
                    : "Remaining Queue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#009688"
                strokeWidth={2.5}
                fill="url(#docProgressGrad)"
                dot={{ r: 3, fill: "#009688" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            <span>Target completion by 05:00 PM</span>
            <span className="font-semibold text-[#111827]">
              21 Completed · 4 Remaining Queue
            </span>
          </div>
        </div>

        {/* Section 02: Today's Patient Status (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Patient Consultation Status"
            sub="Current OPD Workflow Breakdown"
          />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={DOC_PATIENT_STATUS_DIST}
              layout="vertical"
              margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [`${v} Patients`, "Count"]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                {DOC_PATIENT_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {DOC_PATIENT_STATUS_DIST.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: s.color }}
                  />
                  <span className="text-[#64748B] text-[11px]">{s.name}</span>
                </div>
                <span className="font-bold text-[#111827]">{s.value}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-[11px] text-center text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            28 Total Appointments Today
          </div>
        </div>
      </div>

      {/* ── Section 03 & 04: Appointment Timeline & Patient Queue Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 03: Appointment Timeline (No Billing Info) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Today's Clinical Appointment Timeline
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                Doctor consultation schedule and current patient status
              </div>
            </div>
            <span
              className="text-xs font-medium text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg"
              style={{ fontFamily: RB }}
            >
              Room OPD-1
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-slate-50/50">
                  {[
                    "Time",
                    "Token",
                    "Patient Name",
                    "Age / Gender",
                    "Visit Type",
                    "Room",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]"
                      style={{ fontFamily: RB }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DOC_APPT_TIMELINE.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                      {a.time}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-600">
                      {a.token}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Av name={a.name} size="sm" />
                        <span
                          className="text-xs font-medium text-[#111827]"
                          style={{ fontFamily: RB }}
                        >
                          {a.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-5 py-3 text-xs text-[#64748B]"
                      style={{ fontFamily: RB }}
                    >
                      {a.age} Yrs / {a.gender}
                    </td>
                    <td
                      className="px-5 py-3 text-xs text-[#111827]"
                      style={{ fontFamily: RB }}
                    >
                      {a.visitType}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-[10px] font-semibold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">
                        {a.room}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Chip
                        label={a.status}
                        variant={DOC_STATUS_CHIP[a.status] || "default"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            <span>Showing 7 of 28 scheduled appointments</span>
            <button className="text-[#0D47A1] font-semibold hover:underline">
              View Full Schedule →
            </button>
          </div>
        </div>

        {/* Section 04: Patient Queue Summary (Reusable Card) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Patient Queue Summary" sub="Real-time OPD Live Queue" />

          <div className="space-y-3">
            {/* Current Patient */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
              <div
                className="text-[10px] font-bold text-[#009688] uppercase tracking-wider mb-1"
                style={{ fontFamily: PP }}
              >
                Current Patient
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Sarah Mitchell
                  </div>
                  <div
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Emergency OPD · Room OPD-1
                  </div>
                </div>
                <Chip label="In Progress" variant="teal" />
              </div>
            </div>

            {/* Next Patient */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div
                className="text-[10px] font-bold text-[#0D47A1] uppercase tracking-wider mb-1"
                style={{ fontFamily: PP }}
              >
                Next Patient
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    James Thornton
                  </div>
                  <div
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Token TK-103 · General Consultation
                  </div>
                </div>
                <Chip label="Waiting" variant="warning" />
              </div>
            </div>

            {/* Queue Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div
                  className="text-[10px] text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Remaining Queue
                </div>
                <div
                  className="text-base font-bold text-[#111827] mt-0.5"
                  style={{ fontFamily: PP }}
                >
                  4
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div
                  className="text-[10px] text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Avg Wait Time
                </div>
                <div
                  className="text-base font-bold text-[#F59E0B] mt-0.5"
                  style={{ fontFamily: PP }}
                >
                  14 m
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div
                  className="text-[10px] text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Est. Completion
                </div>
                <div
                  className="text-base font-bold text-[#009688] mt-0.5"
                  style={{ fontFamily: PP }}
                >
                  04:45 PM
                </div>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Stethoscope size={13} /> Call Next Patient (TK-103)
          </button>
        </div>
      </div>

      {/* ── Section 05 & 06: Consultation Categories & Prescription Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Section 05: Today's Consultation Categories (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Consultation Types"
            sub="Today's Workload Distribution by Category"
          />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={DOC_CONSULTATION_TYPES}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="type"
                type="category"
                tick={{ fontSize: 11, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [`${v} Patients`, "Volume"]}
              />
              <Bar
                dataKey="count"
                fill="#0D47A1"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
          <div
            className="mt-2 pt-3 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Most Common: General Consultation (12)</span>
            <span className="font-semibold text-[#0D47A1]">
              28 Total Consultations
            </span>
          </div>
        </div>

        {/* Section 06: Prescription Summary (Pie Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Prescriptions Issued Today"
            sub="Summary of Today's Prescription Activity"
          />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={DOC_PRESCRIPTION_SUMMARY}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: "#64748B", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [`${v} Prescriptions`, "Count"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {DOC_PRESCRIPTION_SUMMARY.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {DOC_PRESCRIPTION_SUMMARY.map((p) => (
              <div
                key={p.category}
                className="flex items-center justify-between"
              >
                <span className="text-[#64748B] text-[11px]">
                  {p.category}:
                </span>
                <span className="font-bold text-[#111827]">{p.count}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-xs font-semibold text-center text-[#009688]"
            style={{ fontFamily: PP }}
          >
            Total Prescriptions Issued: {rxTotal}
          </div>
        </div>
      </div>

      {/* ── Section 09: Today's Performance Summary ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Today's Clinical Performance Summary
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Doctor efficiency & daily consultation statistics
            </div>
          </div>
          <button
            className="text-xs text-[#0D47A1] font-semibold hover:underline"
            style={{ fontFamily: RB }}
          >
            Export Summary Report →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {["Metric", "Today", "Yesterday", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DOC_PERFORMANCE_METRICS.map((m) => (
              <tr
                key={m.metric}
                className="hover:bg-slate-50 transition-colors"
              >
                <td
                  className="px-5 py-3 text-xs font-medium text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {m.metric}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                  {m.today}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#64748B]">
                  {m.yesterday}
                </td>
                <td className="px-5 py-3">
                  <Chip
                    label={m.status}
                    variant={
                      m.status.includes("Ahead") ||
                      m.status.includes("Efficient")
                        ? "success"
                        : m.status.includes("Low")
                          ? "info"
                          : "default"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
