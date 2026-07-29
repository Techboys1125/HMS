import {
  Activity,
  CheckSquare,
  Clock,
  ClipboardList,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Stethoscope,
  Search,
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
  | "success"
  | "warning"
  | "error"
  | "info"
  | "teal"
  | "default";
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
const NURSE_VITALS_PROGRESS = [
  { hour: "08 AM", assisted: 5 },
  { hour: "09 AM", assisted: 12 },
  { hour: "10 AM", assisted: 18 },
  { hour: "11 AM", assisted: 25 },
  { hour: "12 PM", assisted: 31 },
  { hour: "01 PM", assisted: 36 },
  { hour: "02 PM", assisted: 42 },
  { hour: "03 PM", assisted: 47 },
  { hour: "04 PM", assisted: 51 },
  { hour: "05 PM", assisted: 54 },
];

// Section 02: Patient Preparation Status (Donut Chart)
const NURSE_PREP_STATUS_DIST = [
  { name: "Waiting for Vitals", value: 8, color: "#F59E0B" },
  { name: "Vitals Completed", value: 14, color: "#009688" },
  { name: "Ready for Consultation", value: 18, color: "#0D47A1" },
  { name: "Consultation Completed", value: 24, color: "#66BB6A" },
];

// Section 03: Current Nursing Queue Table
const NURSE_QUEUES = [
  {
    token: "T-101",
    patient: "Sarah Mitchell",
    doctor: "Dr. A. Mehta",
    dept: "Cardiology",
    apptTime: "09:15 AM",
    vitalsStatus: "Completed",
    consultStatus: "Ready",
    priority: "High",
  },
  {
    token: "T-102",
    patient: "James Thornton",
    doctor: "Dr. P. Sharma",
    dept: "General OPD",
    apptTime: "09:30 AM",
    vitalsStatus: "Waiting",
    consultStatus: "Waiting",
    priority: "Normal",
  },
  {
    token: "T-103",
    patient: "Emma Reyes",
    doctor: "Dr. R. Kapoor",
    dept: "Pediatrics",
    apptTime: "09:45 AM",
    vitalsStatus: "Completed",
    consultStatus: "Vitals Completed",
    priority: "Normal",
  },
  {
    token: "T-104",
    patient: "Robert Chen",
    doctor: "Dr. A. Mehta",
    dept: "Cardiology",
    apptTime: "10:00 AM",
    vitalsStatus: "Waiting",
    consultStatus: "Waiting",
    priority: "High",
  },
  {
    token: "T-105",
    patient: "Aisha Kumar",
    doctor: "Dr. S. Nair",
    dept: "Gynecology",
    apptTime: "10:15 AM",
    vitalsStatus: "Completed",
    consultStatus: "Ready",
    priority: "Normal",
  },
  {
    token: "T-106",
    patient: "Marcus Brown",
    doctor: "Dr. V. Rao",
    dept: "Orthopedics",
    apptTime: "10:30 AM",
    vitalsStatus: "Completed",
    consultStatus: "Completed",
    priority: "Normal",
  },
  {
    token: "T-107",
    patient: "Nina Patel",
    doctor: "Dr. K. Verma",
    dept: "Neurology",
    apptTime: "10:45 AM",
    vitalsStatus: "Waiting",
    consultStatus: "Waiting",
    priority: "Normal",
  },
];

// Section 05: Patient Distribution by Department (Horizontal Bar Chart)
const NURSE_DEPT_DIST = [
  { department: "General OPD", assisted: 18 },
  { department: "Cardiology", assisted: 14 },
  { department: "Orthopedics", assisted: 10 },
  { department: "Pediatrics", assisted: 8 },
  { department: "Neurology", assisted: 5 },
  { department: "Gynecology", assisted: 9 },
];

// Section 06: Vitals Completion Summary (Pie / Bar Chart)
const NURSE_VITALS_STATUS_DIST = [
  { name: "Completed", count: 42, color: "#66BB6A" },
  { name: "Pending", count: 8, color: "#F59E0B" },
  { name: "Delayed", count: 3, color: "#EF4444" },
  { name: "Not Required", count: 5, color: "#64748B" },
];

// Section 09: Today's Nursing Performance (Statistics Table)
const NURSE_PERFORMANCE_METRICS = [
  {
    metric: "Patients Assisted",
    today: "64",
    yesterday: "58",
    status: "Ahead (+10.3%)",
  },
  {
    metric: "Vitals Recorded",
    today: "54",
    yesterday: "49",
    status: "Optimal (+10.2%)",
  },
  {
    metric: "Patients Prepared",
    today: "48",
    yesterday: "44",
    status: "Ahead (+9.1%)",
  },
  {
    metric: "Doctor Assistance",
    today: "36",
    yesterday: "32",
    status: "High (+12.5%)",
  },
  {
    metric: "Average Preparation Time",
    today: "6.5 min",
    yesterday: "7.2 min",
    status: "Faster (-9.7%)",
  },
  {
    metric: "Completed Tasks",
    today: "52",
    yesterday: "46",
    status: "Optimal (+13.0%)",
  },
];

const NURSE_STATUS_CHIP: Record<
  string,
  "success" | "warning" | "info" | "error" | "teal" | "default"
> = {
  Completed: "success",
  Ready: "teal",
  "Vitals Completed": "info",
  Waiting: "warning",
  High: "error",
  Normal: "default",
};

const NURSE_QUICK_ACTIONS = [
  {
    label: "Record Vitals",
    Icon: Activity,
    color: "#009688",
    action: "vitals",
  },
  {
    label: "View Patient Queue",
    Icon: Users,
    color: "#0D47A1",
    action: "queue",
  },
  {
    label: "Prepare Patient",
    Icon: UserPlus,
    color: "#4DB6AC",
    action: "prep",
  },
  {
    label: "Assist Consultation",
    Icon: Stethoscope,
    color: "#66BB6A",
    action: "assist",
  },
  { label: "Search Patient", Icon: Search, color: "#64748B", action: "search" },
  {
    label: "View Assigned Patients",
    Icon: ClipboardList,
    color: "#F59E0B",
    action: "assigned",
  },
];

export function NurseDashboard({
  onRecordVitalsClick,
  onViewQueueClick,
  onNavigateNav,
}: {
  onRecordVitalsClick?: () => void;
  onViewQueueClick?: () => void;
  onNavigateNav?: (nav: string) => void;
}) {
  const totalPrepPatients = NURSE_PREP_STATUS_DIST.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: "#F1F5F9" }}
    >
      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1"
          style={{ fontFamily: PP }}
        >
          Clinical Support Quick Actions
        </span>
        {NURSE_QUICK_ACTIONS.map(({ label, Icon, color, action }) => (
          <button
            key={label}
            onClick={() => {
              if (action === "vitals" && onRecordVitalsClick)
                onRecordVitalsClick();
              else if (action === "queue" && onViewQueueClick)
                onViewQueueClick();
              else if (action === "vitals" && onNavigateNav)
                onNavigateNav("patient-queue");
              else if (action === "queue" && onNavigateNav)
                onNavigateNav("patient-queue");
              else if (action === "prep" && onNavigateNav)
                onNavigateNav("patient-queue");
              else if (action === "assist" && onNavigateNav)
                onNavigateNav("appointments");
              else if (action === "search" && onNavigateNav)
                onNavigateNav("patient-search");
              else if (action === "assigned" && onNavigateNav)
                onNavigateNav("patients");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Row — 5 Clinical Support KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi
          title="Patients Assigned Today"
          value="64"
          sub="Assigned for Nursing Assistance"
          trend="+8.5% vs Yesterday"
          up={true}
          data={[
            { v: 48 },
            { v: 52 },
            { v: 55 },
            { v: 58 },
            { v: 60 },
            { v: 64 },
          ]}
          color="#0D47A1"
          gid="nr1"
          Icon={Users}
        />
        <DKpi
          title="Vitals Recorded"
          value="54"
          sub="Completed Vital Signs"
          trend="84.4% Today's Progress"
          up={true}
          data={[
            { v: 35 },
            { v: 40 },
            { v: 42 },
            { v: 48 },
            { v: 50 },
            { v: 54 },
          ]}
          color="#009688"
          gid="nr2"
          Icon={Activity}
        />
        <DKpi
          title="Waiting for Vitals"
          value="8"
          sub="Pending Nursing Assessment"
          trend="Current Queue Count"
          up={false}
          data={[
            { v: 14 },
            { v: 12 },
            { v: 11 },
            { v: 10 },
            { v: 9 },
            { v: 8 },
          ]}
          color="#F59E0B"
          gid="nr3"
          Icon={Clock}
        />
        <DKpi
          title="Doctor Assistance"
          value="36"
          sub="Consultations Assisted Today"
          trend="92.3% Completion Rate"
          up={true}
          data={[
            { v: 22 },
            { v: 26 },
            { v: 28 },
            { v: 31 },
            { v: 34 },
            { v: 36 },
          ]}
          color="#66BB6A"
          gid="nr4"
          Icon={Stethoscope}
        />
        <DKpi
          title="Completed Nursing Tasks"
          value="52"
          sub="Daily Nursing Activities"
          trend="89.6% Progress"
          up={true}
          data={[
            { v: 30 },
            { v: 36 },
            { v: 40 },
            { v: 44 },
            { v: 48 },
            { v: 52 },
          ]}
          color="#4DB6AC"
          gid="nr5"
          Icon={CheckSquare}
        />
      </div>

      {/* ── Main Clinical Operations Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 01: Vitals Recording Progress (Large Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Vitals Recorded Throughout the Day
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                Monitors hourly patient vital recordings (08 AM - 05 PM)
              </div>
            </div>
            <span
              className="text-[10px] font-semibold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: RB }}
            >
              Completed: 54 Vitals
            </span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={NURSE_VITALS_PROGRESS}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="nurseVitalsGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#009688" stopOpacity={0.25} />
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
                formatter={(val: unknown) => [
                  `${val} Patients`,
                  "Completed Vitals",
                ]}
              />
              <Area
                type="monotone"
                dataKey="assisted"
                stroke="#009688"
                strokeWidth={2.5}
                fill="url(#nurseVitalsGrad)"
                dot={{ r: 3, fill: "#009688" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            <span>
              Peak Nursing Workload: 10 AM - 11 AM (13 Vitals Processed)
            </span>
            <span className="font-semibold text-[#111827]">
              54 Total Recorded
            </span>
          </div>
        </div>

        {/* Section 02: Patient Preparation Status (Donut / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Patient Preparation Status"
            sub="Quick Understanding of Patient Readiness"
          />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={NURSE_PREP_STATUS_DIST}
              layout="vertical"
              margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={115}
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
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={13}>
                {NURSE_PREP_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-1.5 mt-2 pt-3 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {NURSE_PREP_STATUS_DIST.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: m.color }}
                  />
                  <span className="text-[#64748B] text-[10px]">{m.name}</span>
                </div>
                <span className="font-bold text-[#111827]">{m.value}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-[11px] text-center text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            Total Patients in Pipeline: {totalPrepPatients}
          </div>
        </div>
      </div>

      {/* ── Section 03: Current Nursing Queue Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Current Nursing Queue
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Monitor patients requiring vital recording and consultation
              support
            </div>
          </div>
          <span
            className="text-xs font-semibold text-[#009688] bg-teal-50 px-2.5 py-1 rounded-lg"
            style={{ fontFamily: RB }}
          >
            8 Waiting for Vitals
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {[
                  "Token",
                  "Patient Name",
                  "Assigned Doctor",
                  "Department",
                  "Appointment Time",
                  "Vitals Status",
                  "Consultation Status",
                  "Priority",
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
              {NURSE_QUEUES.map((q, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                    {q.token}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Av name={q.patient} size="sm" />
                      <span
                        className="text-xs font-medium text-[#111827]"
                        style={{ fontFamily: RB }}
                      >
                        {q.patient}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {q.doctor}
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {q.dept}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">
                    {q.apptTime}
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={q.vitalsStatus}
                      variant={NURSE_STATUS_CHIP[q.vitalsStatus] || "default"}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={q.consultStatus}
                      variant={NURSE_STATUS_CHIP[q.consultStatus] || "default"}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={q.priority}
                      variant={NURSE_STATUS_CHIP[q.priority] || "default"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 04, 05 & 06: Doctor Assistance, Dept Distribution & Vitals Summary ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 04: Doctor Assistance Summary (Reusable Summary Cards) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Doctor Assistance Summary"
            sub="Real-time Nursing Support Metrics"
          />
          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-blue-100 bg-blue-50/50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Doctors Assisted Today
              </span>
              <span
                className="text-sm font-bold text-[#0D47A1]"
                style={{ fontFamily: PP }}
              >
                8 Doctors
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-teal-100 bg-teal-50/50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Patients Prepared
              </span>
              <span
                className="text-sm font-bold text-[#009688]"
                style={{ fontFamily: PP }}
              >
                48 Patients
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Average Preparation Time
              </span>
              <span
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                6.5 Mins
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-green-100 bg-green-50/50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Current Active Consultations
              </span>
              <span
                className="text-sm font-bold text-[#66BB6A]"
                style={{ fontFamily: PP }}
              >
                12 Active
              </span>
            </div>
          </div>
          <div
            className="mt-3 pt-2 text-xs text-[#64748B] text-center"
            style={{ fontFamily: RB }}
          >
            Optimal nursing support flow across OPD consultations
          </div>
        </div>

        {/* Section 05: Patient Distribution by Department (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Patients Assisted by Dept"
            sub="Nursing Workload Distribution"
          />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={NURSE_DEPT_DIST}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 15, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="department"
                type="category"
                tick={{ fontSize: 10, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [`${v} Patients`, "Assisted"]}
              />
              <Bar
                dataKey="assisted"
                fill="#0D47A1"
                radius={[0, 4, 4, 0]}
                barSize={13}
              />
            </BarChart>
          </ResponsiveContainer>
          <div
            className="mt-2 pt-2 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Highest Workload: General OPD</span>
            <span className="font-semibold text-[#0D47A1]">
              64 Total Assisted
            </span>
          </div>
        </div>

        {/* Section 06: Vitals Completion Summary (Pie / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Vitals Recording Status"
            sub="Quick Overview of Vitals Task Completion"
          />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={NURSE_VITALS_STATUS_DIST}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
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
                formatter={(v: unknown) => [`${v} Patients`, "Count"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {NURSE_VITALS_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {NURSE_VITALS_STATUS_DIST.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-[#64748B] text-[11px]">{r.name}:</span>
                <span className="font-bold text-[#111827]">{r.count}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-xs font-semibold text-center text-[#009688]"
            style={{ fontFamily: PP }}
          >
            Total Vitals Logged Today: 58
          </div>
        </div>
      </div>

      {/* ── Section 09: Today's Nursing Performance ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Today's Nursing Performance
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Clinical support operations & vitals assessment metrics
            </div>
          </div>
          <button
            className="text-xs text-[#0D47A1] font-semibold hover:underline"
            style={{ fontFamily: RB }}
          >
            Export Nursing Summary →
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
            {NURSE_PERFORMANCE_METRICS.map((m) => (
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
                      m.status.includes("Optimal") ||
                      m.status.includes("High") ||
                      m.status.includes("Faster")
                        ? "success"
                        : "warning"
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
