// React imports
import {
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  DollarSign,
  Bell,
  Stethoscope,
  BarChart2,
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

// ─── Mini Shared Components ────────────────────────────────────────────────
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

// Section 01: Appointment Flow Today (Line Chart)
const HA_APPT_FLOW = [
  { hour: "8 AM", completed: 8 },
  { hour: "9 AM", completed: 18 },
  { hour: "10 AM", completed: 32 },
  { hour: "11 AM", completed: 48 },
  { hour: "12 PM", completed: 62 },
  { hour: "1 PM", completed: 74 },
  { hour: "2 PM", completed: 86 },
  { hour: "3 PM", completed: 104 },
  { hour: "4 PM", completed: 122 },
  { hour: "5 PM", completed: 142 },
];

// Section 02: Patient Status Distribution (Pie Chart)
const HA_STATUS_DIST = [
  { name: "Waiting", value: 24, color: "#F59E0B" },
  { name: "In Consultation", value: 16, color: "#009688" },
  { name: "Completed", value: 142, color: "#66BB6A" },
  { name: "Cancelled", value: 12, color: "#EF4444" },
];

// Section 03: Department Workload (Horizontal Bar Chart)
const HA_DEPT_WORKLOAD = [
  { dept: "General OPD", appts: 48 },
  { dept: "Cardiology", appts: 34 },
  { dept: "Orthopedics", appts: 26 },
  { dept: "Pediatrics", appts: 22 },
  { dept: "Neurology", appts: 18 },
  { dept: "Gynecology", appts: 16 },
];

// Section 04: Doctor Availability (Stacked Card)
const HA_DOC_AVAILABILITY = [
  { status: "Available", count: 10, color: "#66BB6A" },
  { status: "In Consultation", count: 6, color: "#009688" },
  { status: "On Break", count: 2, color: "#F59E0B" },
  { status: "Leave", count: 6, color: "#EF4444" },
];

// Section 05: Today's Appointment Timeline
const HA_TIMELINE = [
  {
    time: "08:00 AM",
    patient: "Helen Brooks",
    doctor: "Dr. Priya Sharma",
    dept: "General OPD",
    status: "Completed",
    token: "T-001",
    room: "OPD-3",
    stage: "Discharged",
  },
  {
    time: "08:30 AM",
    patient: "Alex Monroe",
    doctor: "Dr. Arjun Mehta",
    dept: "Cardiology",
    status: "Completed",
    token: "T-002",
    room: "OPD-1",
    stage: "Discharged",
  },
  {
    time: "09:00 AM",
    patient: "Sarah Mitchell",
    doctor: "Dr. Arjun Mehta",
    dept: "Cardiology",
    status: "In Consultation",
    token: "T-003",
    room: "OPD-1",
    stage: "Doctor Review",
  },
  {
    time: "09:30 AM",
    patient: "James Thornton",
    doctor: "Dr. Priya Sharma",
    dept: "General OPD",
    status: "Waiting",
    token: "T-004",
    room: "Waiting Hall A",
    stage: "Vitals Recorded",
  },
  {
    time: "10:00 AM",
    patient: "Emma Reyes",
    doctor: "Dr. Sarah Patel",
    dept: "Gynecology",
    status: "In Consultation",
    token: "T-005",
    room: "OPD-5",
    stage: "Examination",
  },
  {
    time: "10:30 AM",
    patient: "Robert Chen",
    doctor: "Dr. Arjun Mehta",
    dept: "Cardiology",
    status: "Scheduled",
    token: "T-006",
    room: "OPD-1",
    stage: "Checked In",
  },
  {
    time: "11:00 AM",
    patient: "Aisha Kumar",
    doctor: "Dr. Raj Kapoor",
    dept: "Neurology",
    status: "Scheduled",
    token: "T-007",
    room: "OPD-4",
    stage: "Registered",
  },
  {
    time: "11:30 AM",
    patient: "David Walsh",
    doctor: "Dr. Chen Wei",
    dept: "Orthopedics",
    status: "Cancelled",
    token: "T-008",
    room: "N/A",
    stage: "Patient Cancelled",
  },
];

// Section 06: Revenue Collection Summary (Donut Chart)
const HA_REVENUE_DIST = [
  { name: "Cash", value: 8400, color: "#0D47A1" },
  { name: "Card", value: 11200, color: "#009688" },
  { name: "UPI", value: 4200, color: "#4DB6AC" },
  { name: "Other", value: 1000, color: "#64748B" },
];

// Section 09: Quick Department Summary Table
const HA_DEPT_SUMMARY_TABLE = [
  {
    dept: "General OPD",
    appts: 48,
    completed: 36,
    waiting: 8,
    doctors: 6,
    status: "Normal",
  },
  {
    dept: "Cardiology",
    appts: 34,
    completed: 24,
    waiting: 6,
    doctors: 4,
    status: "Busy",
  },
  {
    dept: "Orthopedics",
    appts: 26,
    completed: 18,
    waiting: 4,
    doctors: 3,
    status: "Normal",
  },
  {
    dept: "Pediatrics",
    appts: 22,
    completed: 18,
    waiting: 2,
    doctors: 3,
    status: "Normal",
  },
  {
    dept: "Neurology",
    appts: 18,
    completed: 12,
    waiting: 3,
    doctors: 2,
    status: "Delayed",
  },
  {
    dept: "Gynecology",
    appts: 16,
    completed: 14,
    waiting: 1,
    doctors: 2,
    status: "Normal",
  },
];

const HA_STATUS_COLOR: Record<string, string> = {
  Completed: "#66BB6A",
  "In Consultation": "#009688",
  Waiting: "#F59E0B",
  Scheduled: "#0D47A1",
  Cancelled: "#EF4444",
};

const HA_QUICK_ACTIONS = [
  { label: "View Patients", Icon: Users, color: "#0D47A1", nav: "patients" },
  { label: "View Queue", Icon: Clock, color: "#009688", nav: "appointments" },
  {
    label: "Appointment Management",
    Icon: Calendar,
    color: "#0D47A1",
    nav: "appointments",
  },
  {
    label: "Operational Reports",
    Icon: BarChart2,
    color: "#64748B",
    nav: "reports",
  },
];

interface HospitalAdminDashboardProps {
  onRegisterPatient?: () => void;
  onNavigateNav?: (nav: string) => void;
}

export function HospitalAdminDashboard({
  onRegisterPatient,
  onNavigateNav,
}: HospitalAdminDashboardProps = {}) {
  const totalRevenue = HA_REVENUE_DIST.reduce(
    (acc, curr) => acc + curr.value,
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
          Quick Actions
        </span>
        {onRegisterPatient && (
          <button
            onClick={onRegisterPatient}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#1565C0] transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={13} />
            Register Patient
          </button>
        )}
        {HA_QUICK_ACTIONS.map(({ label, Icon, color, nav }) => (
          <button
            key={label}
            onClick={() => onNavigateNav?.(nav)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
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

      {/* ── KPI Row — 5 Phase 1 Operational Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi
          title="Today's OPD Patients"
          value="238"
          sub="Active visits today"
          trend="+14 vs Yesterday"
          up={true}
          data={[
            { v: 195 },
            { v: 205 },
            { v: 210 },
            { v: 218 },
            { v: 224 },
            { v: 230 },
            { v: 238 },
          ]}
          color="#0D47A1"
          gid="ha1"
          Icon={Users}
        />
        <DKpi
          title="Today's Appointments"
          value="142"
          sub="Scheduled visits"
          trend="+8% vs Yesterday"
          up={true}
          data={[
            { v: 98 },
            { v: 115 },
            { v: 108 },
            { v: 132 },
            { v: 119 },
            { v: 138 },
            { v: 142 },
          ]}
          color="#009688"
          gid="ha2"
          Icon={Calendar}
        />
        <DKpi
          title="Today's Revenue"
          value="$24.8K"
          sub="Gross Collections"
          trend="+12% vs Yesterday"
          up={true}
          data={[
            { v: 18 },
            { v: 21 },
            { v: 19 },
            { v: 24 },
            { v: 22 },
            { v: 23 },
            { v: 24.8 },
          ]}
          color="#66BB6A"
          gid="ha3"
          Icon={DollarSign}
        />
        <DKpi
          title="New Patient Registrations"
          value="47"
          sub="Registered Today"
          trend="+9 vs Yesterday"
          up={true}
          data={[
            { v: 32 },
            { v: 38 },
            { v: 35 },
            { v: 41 },
            { v: 44 },
            { v: 45 },
            { v: 47 },
          ]}
          color="#F59E0B"
          gid="ha4"
          Icon={UserPlus}
        />
        <DKpi
          title="Doctors Available Today"
          value="18 / 24"
          sub="Available / Total"
          trend="18 Active on Duty"
          up={true}
          data={[
            { v: 14 },
            { v: 16 },
            { v: 15 },
            { v: 17 },
            { v: 16 },
            { v: 18 },
            { v: 18 },
          ]}
          color="#0D47A1"
          gid="ha5"
          Icon={Stethoscope}
        />
      </div>

      {/* ── Analytics Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 01: Appointment Flow Today (Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Appointment Flow Today
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                Completed appointments movement by hour · Today (8 AM - 5 PM)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full"
                style={{ fontFamily: RB }}
              >
                Current Period: Today
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={HA_APPT_FLOW}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
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
                  `${val} Completed`,
                  "Appointments",
                ]}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#0D47A1"
                strokeWidth={2.5}
                fill="url(#flowGrad)"
                dot={{ r: 3, fill: "#0D47A1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0D47A1]" /> Peak
              Patient Flow: 3 PM - 4 PM (18 appts/hr)
            </span>
            <span className="font-semibold text-[#111827]">
              Total Cumulative: 142 Completed
            </span>
          </div>
        </div>

        {/* Section 02: Patient Status Distribution (Pie / Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Patient Status Distribution"
            sub="Current OPD Workflow Status"
          />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={HA_STATUS_DIST}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
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
                {HA_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {HA_STATUS_DIST.map((s) => (
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
            Period: Today · 194 Total Recorded Visits
          </div>
        </div>
      </div>

      {/* ── Analytics Grid 2 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 03: Department Workload (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Department Workload"
            sub="Today's Scheduled Appointments"
          />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={HA_DEPT_WORKLOAD}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="dept"
                type="category"
                tick={{ fontSize: 11, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [`${v} Appointments`, "Volume"]}
              />
              <Bar
                dataKey="appts"
                fill="#0D47A1"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
          <div
            className="mt-3 pt-3 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Busiest: General OPD (48 appts)</span>
            <span className="font-semibold text-[#0D47A1]">
              164 Total Appts
            </span>
          </div>
        </div>

        {/* Section 04: Doctor Availability (Stacked Card) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Doctor Availability"
            sub="Current Staffing Overview (24 Doctors)"
          />
          <div className="space-y-3 my-auto">
            {HA_DOC_AVAILABILITY.map((d) => {
              const pct = Math.round((d.count / 24) * 100);
              return (
                <div key={d.status}>
                  <div
                    className="flex items-center justify-between text-xs mb-1"
                    style={{ fontFamily: RB }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: d.color }}
                      />
                      <span className="font-medium text-[#111827]">
                        {d.status}
                      </span>
                    </div>
                    <span className="font-semibold text-[#111827]">
                      {d.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: d.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="mt-4 pt-3 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Available + In Consult: 16 Active</span>
            <span className="font-semibold text-[#66BB6A]">66.7% On Duty</span>
          </div>
        </div>

        {/* Section 06: Revenue Collection Summary (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Revenue Collection Summary"
            sub="Collection Method Distribution"
          />
          <div className="flex items-center justify-center relative py-2">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={HA_REVENUE_DIST}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748B", fontFamily: RB }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: unknown) => [`$${v}`, "Amount"]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                  {HA_REVENUE_DIST.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div
            className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {HA_REVENUE_DIST.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-[#64748B]">{r.name}:</span>
                <span className="font-bold text-[#111827]">
                  ${r.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-xs font-semibold text-center text-[#0D47A1]"
            style={{ fontFamily: PP }}
          >
            Total Gross Collections: ${totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── Section 05: Today's Appointment Timeline ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Today's Appointment Timeline
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Real-time patient flow tracker · {HA_TIMELINE.length} tracked
              records
            </div>
          </div>
          <div
            className="flex items-center gap-3 text-xs"
            style={{ fontFamily: RB }}
          >
            {[
              "Completed",
              "In Consultation",
              "Waiting",
              "Scheduled",
              "Cancelled",
            ].map((st) => (
              <div key={st} className="flex items-center gap-1 text-[#64748B]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: HA_STATUS_COLOR[st] }}
                />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {[
                  "Time",
                  "Token",
                  "Patient",
                  "Doctor",
                  "Department",
                  "Room",
                  "Current Stage",
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
              {HA_TIMELINE.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                    {a.time}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-600">
                    {a.token}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Av name={a.patient} size="sm" />
                      <span
                        className="text-xs font-medium text-[#111827]"
                        style={{ fontFamily: RB }}
                      >
                        {a.patient}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {a.doctor}
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {a.dept}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] font-semibold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">
                      {a.room}
                    </span>
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#111827] font-medium"
                    style={{ fontFamily: RB }}
                  >
                    {a.stage}
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={a.status}
                      variant={
                        a.status === "Completed"
                          ? "success"
                          : a.status === "In Consultation"
                            ? "teal"
                            : a.status === "Waiting"
                              ? "warning"
                              : a.status === "Cancelled"
                                ? "error"
                                : "info"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 09: Quick Department Summary ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Quick Department Summary
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Phase 1 OPD department status & staffing
            </div>
          </div>
          <button
            className="text-xs text-[#0D47A1] font-semibold hover:underline"
            style={{ fontFamily: RB }}
          >
            View Detailed Analytics →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {[
                "Department",
                "Appointments",
                "Completed",
                "Waiting",
                "Doctors Available",
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
            {HA_DEPT_SUMMARY_TABLE.map((d) => (
              <tr key={d.dept} className="hover:bg-slate-50 transition-colors">
                <td
                  className="px-5 py-3 text-xs font-medium text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {d.dept}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#111827]">
                  {d.appts}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#66BB6A]">
                  {d.completed}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#F59E0B]">
                  {d.waiting}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#0D47A1]">
                  {d.doctors}
                </td>
                <td className="px-5 py-3">
                  <Chip
                    label={d.status}
                    variant={
                      d.status === "Normal"
                        ? "success"
                        : d.status === "Busy"
                          ? "warning"
                          : "error"
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
