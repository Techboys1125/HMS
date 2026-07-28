import {
  Users,
  Calendar,
  DollarSign,
  UserPlus,
  Stethoscope,
  Clock,
  BarChart2,
  Bell,
  Download,
  Receipt,
  CheckSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  DKpi,
  Av,
  Chip,
  SH,
  AlertRow,
  ProgressBar,
  PP,
  RB,
} from "../components/DashboardShared";

const DOCTORS_AVAIL = [
  {
    name: "Dr. Arjun Mehta",
    dept: "Cardiology",
    status: "in-consultation",
    patients: 8,
  },
  {
    name: "Dr. Priya Sharma",
    dept: "General",
    status: "available",
    patients: 6,
  },
  {
    name: "Dr. Sarah Patel",
    dept: "Obstetrics",
    status: "available",
    patients: 5,
  },
  {
    name: "Dr. Raj Kapoor",
    dept: "Neurology",
    status: "available",
    patients: 4,
  },
  {
    name: "Dr. Linda Walsh",
    dept: "Pediatrics",
    status: "on-leave",
    patients: 0,
  },
  {
    name: "Dr. Chen Wei",
    dept: "Orthopedics",
    status: "in-consultation",
    patients: 7,
  },
];

const HA_REGS = [
  { name: "Anika Petrov", mrn: "MRN-011", age: 29, gender: "F", time: "09:41" },
  { name: "Tom Harrison", mrn: "MRN-012", age: 55, gender: "M", time: "09:53" },
  { name: "Mei Lin", mrn: "MRN-013", age: 38, gender: "F", time: "10:12" },
  { name: "Oscar Ruiz", mrn: "MRN-014", age: 67, gender: "M", time: "10:31" },
  {
    name: "Fatima Al-Rashid",
    mrn: "MRN-015",
    age: 42,
    gender: "F",
    time: "10:48",
  },
];

const HA_DEPTS = [
  {
    name: "OPD — General",
    capacity: 87,
    active: 22,
    total: 25,
    color: "#0D47A1",
  },
  { name: "Cardiology", capacity: 68, active: 17, total: 25, color: "#EF4444" },
  { name: "Pediatrics", capacity: 43, active: 9, total: 21, color: "#009688" },
  { name: "Gynecology", capacity: 70, active: 14, total: 20, color: "#9C27B0" },
  { name: "Neurology", capacity: 55, active: 11, total: 20, color: "#F59E0B" },
];

const HA_TIMELINE = [
  {
    time: "08:00",
    patient: "Helen Brooks",
    complaint: "General Check-up",
    doctor: "Dr. P. Sharma",
    status: "completed",
    room: "OPD-3",
  },
  {
    time: "08:30",
    patient: "Alex Monroe",
    complaint: "Post-op Follow-up",
    doctor: "Dr. A. Mehta",
    status: "completed",
    room: "OPD-1",
  },
  {
    time: "09:00",
    patient: "Sarah Mitchell",
    complaint: "Chest Pain",
    doctor: "Dr. A. Mehta",
    status: "in-progress",
    room: "OPD-1",
  },
  {
    time: "09:30",
    patient: "James Thornton",
    complaint: "Diabetes Follow-up",
    doctor: "Dr. P. Sharma",
    status: "waiting",
    room: null,
  },
  {
    time: "10:00",
    patient: "Emma Reyes",
    complaint: "Prenatal Visit",
    doctor: "Dr. S. Patel",
    status: "checked-in",
    room: "OPD-5",
  },
  {
    time: "10:30",
    patient: "Robert Chen",
    complaint: "Cardiology Review",
    doctor: "Dr. A. Mehta",
    status: "scheduled",
    room: null,
  },
  {
    time: "11:00",
    patient: "Aisha Kumar",
    complaint: "Migraine",
    doctor: "Dr. R. Kapoor",
    status: "scheduled",
    room: null,
  },
  {
    time: "11:30",
    patient: "David Walsh",
    complaint: "Back Pain",
    doctor: "Dr. P. Sharma",
    status: "scheduled",
    room: null,
  },
  {
    time: "14:00",
    patient: "Lily Anderson",
    complaint: "Thyroid Review",
    doctor: "Dr. S. Patel",
    status: "scheduled",
    room: null,
  },
  {
    time: "14:30",
    patient: "Marcus Brown",
    complaint: "Hypertension F/U",
    doctor: "Dr. A. Mehta",
    status: "scheduled",
    room: null,
  },
];

const HA_BILLS = [
  {
    inv: "INV-2891",
    patient: "Helen Brooks",
    amount: "$320",
    status: "paid",
    type: "OPD",
  },
  {
    inv: "INV-2892",
    patient: "Alex Monroe",
    amount: "$680",
    status: "paid",
    type: "Consultation",
  },
  {
    inv: "INV-2893",
    patient: "Sarah Mitchell",
    amount: "$480",
    status: "pending",
    type: "OPD",
  },
  {
    inv: "INV-2894",
    patient: "James Thornton",
    amount: "$260",
    status: "pending",
    type: "Consultation",
  },
  {
    inv: "INV-2895",
    patient: "Emma Reyes",
    amount: "$650",
    status: "paid",
    type: "OPD",
  },
];

const HA_ACTIVITY = [
  {
    Icon: UserPlus,
    action: "New patient registered",
    detail: "Fatima Al-Rashid · MRN-015",
    time: "6m",
    color: "#0D47A1",
  },
  {
    Icon: Calendar,
    action: "Appointment booked",
    detail: "Marcus Brown → Dr. A. Mehta",
    time: "14m",
    color: "#009688",
  },
  {
    Icon: Receipt,
    action: "Bill settled",
    detail: "INV-2892 · $1,250",
    time: "21m",
    color: "#66BB6A",
  },
  {
    Icon: CheckSquare,
    action: "Patient checked in",
    detail: "James Thornton · OPD Wing B",
    time: "38m",
    color: "#F59E0B",
  },
  {
    Icon: Stethoscope,
    action: "Consultation completed",
    detail: "Helen Brooks · Dr. P. Sharma",
    time: "52m",
    color: "#009688",
  },
  {
    Icon: Stethoscope,
    action: "Doctor checked in",
    detail: "Dr. Raj Kapoor · Neurology",
    time: "1h",
    color: "#0D47A1",
  },
];

const HA_ANNOUNCEMENTS = [
  {
    type: "info",
    title: "Staff Meeting — 3:00 PM Today",
    body: "Monthly department heads review in Conference Room A.",
  },
  {
    type: "warning",
    title: "High Patient Volume — OPD",
    body: "OPD General at 87% capacity. Consider adding a slot.",
  },
  {
    type: "success",
    title: "Joint Commission Audit Cleared",
    body: "All departments met compliance standards. Report filed.",
  },
];

const HA_WEEKLY_REV = [
  { day: "Mon", opd: 18.2, billing: 6.4 },
  { day: "Tue", opd: 22.5, billing: 8.1 },
  { day: "Wed", opd: 19.8, billing: 7.2 },
  { day: "Thu", opd: 26.1, billing: 9.5 },
  { day: "Fri", opd: 24.8, billing: 8.8 },
  { day: "Sat", opd: 14.3, billing: 4.9 },
  { day: "Sun", opd: 11.6, billing: 3.8 },
];

const HA_STATUS_COLOR: Record<string, string> = {
  completed: "#66BB6A",
  "in-progress": "#009688",
  waiting: "#F59E0B",
  "checked-in": "#0D47A1",
  scheduled: "#CBD5E1",
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

export function HospitalAdminDashboard() {
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
        {HA_QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button
            key={label}
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

      {/* ── KPI Row — 5 cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi
          title="Today's Patients"
          value="238"
          sub="Active visits today"
          trend="+14 from yesterday"
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
          trend="+8% vs yesterday"
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
          title="Revenue Today"
          value="$24.8K"
          sub="Gross collection"
          trend="+12% this week"
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
          title="Patients Registered"
          value="47"
          sub="New registrations today"
          trend="+9 from yesterday"
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
          title="Doctors on Duty"
          value="18"
          sub="of 24 staff today"
          trend="3 on leave today"
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

      {/* ── Main Workspace ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Appointment Timeline */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
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
                {HA_TIMELINE.length} appointments ·{" "}
                {HA_TIMELINE.filter((a) => a.status === "completed").length}{" "}
                completed
              </div>
            </div>
            <div
              className="flex items-center gap-4 text-[10px]"
              style={{ fontFamily: RB }}
            >
              {[
                { label: "Done", color: "#66BB6A" },
                { label: "Active", color: "#009688" },
                { label: "Waiting", color: "#F59E0B" },
                { label: "Scheduled", color: "#CBD5E1" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1 text-[#64748B]"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          <div
            className="divide-y divide-gray-50 overflow-y-auto"
            style={{ maxHeight: 380 }}
          >
            {HA_TIMELINE.map((a, i) => {
              const sc = HA_STATUS_COLOR[a.status] ?? "#CBD5E1";
              const isActive = a.status === "in-progress";
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${isActive ? "bg-teal-50/40" : ""}`}
                >
                  <div className="font-mono text-xs font-bold text-[#0D47A1] shrink-0 w-12 text-center">
                    {a.time}
                  </div>
                  <div className="relative shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: sc }}
                    />
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-60"
                        style={{ background: sc }}
                      />
                    )}
                  </div>
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
                  <div
                    className="text-xs text-[#64748B] shrink-0 hidden xl:block"
                    style={{ fontFamily: RB }}
                  >
                    {a.doctor}
                  </div>
                  {a.room && (
                    <span className="font-mono text-[10px] font-semibold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded shrink-0">
                      {a.room}
                    </span>
                  )}
                  <Chip
                    label={
                      a.status === "in-progress"
                        ? "Active"
                        : a.status === "checked-in"
                          ? "Checked In"
                          : a.status.charAt(0).toUpperCase() + a.status.slice(1)
                    }
                    variant={
                      a.status === "completed"
                        ? "success"
                        : a.status === "in-progress"
                          ? "teal"
                          : a.status === "waiting"
                            ? "warning"
                            : a.status === "checked-in"
                              ? "info"
                              : "default"
                    }
                  />
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Showing {HA_TIMELINE.length} of 142 appointments
            </span>
            <button
              className="text-xs text-[#0D47A1] font-medium hover:underline"
              style={{ fontFamily: RB }}
            >
              View full schedule →
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Department Overview */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Department Status" sub="Current occupancy" />
            <div className="space-y-3">
              {HA_DEPTS.map((d) => (
                <ProgressBar
                  key={d.name}
                  label={d.name}
                  value={d.active}
                  total={d.total}
                  color={
                    d.capacity >= 90
                      ? "#EF4444"
                      : d.capacity >= 70
                        ? "#F59E0B"
                        : d.color
                  }
                  sub={`${d.active}/${d.total}`}
                />
              ))}
            </div>
            {/* Consultation summary tiles */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-50">
              {[
                {
                  label: "Completed",
                  value: "86",
                  color: "#66BB6A",
                  bg: "bg-green-50",
                },
                {
                  label: "In Progress",
                  value: "12",
                  color: "#009688",
                  bg: "bg-teal-50",
                },
                {
                  label: "Waiting",
                  value: "18",
                  color: "#F59E0B",
                  bg: "bg-amber-50",
                },
                {
                  label: "Scheduled",
                  value: "26",
                  color: "#0D47A1",
                  bg: "bg-blue-50",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className={`${b.bg} rounded-xl p-3 border border-gray-100`}
                >
                  <div
                    className="text-[10px] font-medium mb-1"
                    style={{ fontFamily: RB, color: b.color }}
                  >
                    {b.label}
                  </div>
                  <div
                    className="text-xl font-bold"
                    style={{ fontFamily: PP, color: b.color }}
                  >
                    {b.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors on Duty */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Doctors On Duty" sub="Live staff status" />
            <div className="space-y-0">
              {DOCTORS_AVAIL.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <Av name={d.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-semibold text-[#111827] truncate"
                      style={{ fontFamily: PP }}
                    >
                      {d.name}
                    </div>
                    <div
                      className="text-[10px] text-[#64748B]"
                      style={{ fontFamily: RB }}
                    >
                      {d.dept}
                    </div>
                  </div>
                  <Chip
                    label={
                      d.status === "available"
                        ? "Free"
                        : d.status === "in-consultation"
                          ? "Busy"
                          : "Leave"
                    }
                    variant={
                      d.status === "available"
                        ? "success"
                        : d.status === "in-consultation"
                          ? "teal"
                          : "warning"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Secondary Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Patient Registrations */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Recent Registrations
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                New patients today
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {HA_REGS.map((p) => (
              <div
                key={p.mrn}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
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
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {p.gender}/{p.age} · {p.mrn}
                  </div>
                </div>
                <div className="font-mono text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded shrink-0">
                  {p.time}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <button
              className="text-xs text-[#0D47A1] font-medium hover:underline"
              style={{ fontFamily: RB }}
            >
              View all registrations →
            </button>
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Recent Bills
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                Today's billing activity
              </div>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
              style={{ fontFamily: RB }}
            >
              <Download size={11} /> Export
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {HA_BILLS.map((b) => (
              <div
                key={b.inv}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Receipt size={12} className="text-[#0D47A1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-semibold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {b.inv}
                  </div>
                  <div
                    className="text-[10px] text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {b.patient} · {b.type}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className="text-sm font-bold text-[#111827] mb-0.5"
                    style={{ fontFamily: PP }}
                  >
                    {b.amount}
                  </div>
                  <Chip
                    label={b.status === "paid" ? "Paid" : "Pending"}
                    variant={b.status === "paid" ? "success" : "warning"}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-50">
            <button
              className="text-xs text-[#0D47A1] font-medium hover:underline"
              style={{ fontFamily: RB }}
            >
              View all bills →
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Activity Timeline" sub="Recent operations log" />
          <div>
            {HA_ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 last:pb-0 relative"
              >
                {i < HA_ACTIVITY.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-100" />
                )}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 z-10"
                  style={{ background: a.color + "15" }}
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
                    className="text-[10px] text-[#64748B] truncate mt-0.5"
                    style={{ fontFamily: RB }}
                  >
                    {a.detail}
                  </div>
                </div>
                <span
                  className="text-[10px] text-slate-400 shrink-0 pt-0.5"
                  style={{ fontFamily: RB }}
                >
                  {a.time} ago
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Performance + Announcements ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Weekly Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Hospital Revenue — This Week
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                OPD Consultations · Billing breakdown ($K)
              </div>
            </div>
            <div
              className="flex items-center gap-4 text-[10px]"
              style={{ fontFamily: RB }}
            >
              {[
                { label: "OPD", color: "#0D47A1" },
                { label: "Billing", color: "#009688" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 text-[#64748B]"
                >
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={HA_WEEKLY_REV} barGap={2} barCategoryGap="30%">
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#64748B", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}K`}
                width={38}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [`$${v}K`, ""]}
              />
              <Bar
                dataKey="opd"
                name="OPD"
                fill="#0D47A1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="billing"
                name="Billing"
                fill="#009688"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-50">
            {[
              {
                label: "Total This Week",
                value: "$137.3K",
                up: true,
                trend: "+11% vs last week",
              },
              {
                label: "Today's Revenue",
                value: "$24.8K",
                up: true,
                trend: "+12% vs yesterday",
              },
              {
                label: "Pending Bills",
                value: "$8.4K",
                up: false,
                trend: "18 unpaid invoices",
              },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div
                  className="text-xs text-[#64748B] mb-1"
                  style={{ fontFamily: RB }}
                >
                  {m.label}
                </div>
                <div
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {m.value}
                </div>
                <div
                  className={`flex items-center justify-center gap-1 text-xs font-medium mt-0.5 ${m.up ? "text-[#66BB6A]" : "text-[#EF4444]"}`}
                  style={{ fontFamily: RB }}
                >
                  {m.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {m.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements + Critical Alerts */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex-1">
            <SH title="Announcements" />
            <div className="space-y-3">
              {HA_ANNOUNCEMENTS.map((a, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs ${
                    a.type === "warning"
                      ? "bg-amber-50 border-amber-100"
                      : a.type === "success"
                        ? "bg-green-50 border-green-100"
                        : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <div
                    className={`font-semibold mb-1 leading-snug ${a.type === "warning" ? "text-amber-800" : a.type === "success" ? "text-green-800" : "text-blue-800"}`}
                    style={{ fontFamily: PP }}
                  >
                    {a.title}
                  </div>
                  <div
                    className={`leading-snug ${a.type === "warning" ? "text-amber-700" : a.type === "success" ? "text-green-700" : "text-blue-700"}`}
                    style={{ fontFamily: RB }}
                  >
                    {a.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="System Alerts" />
            <div className="space-y-2">
              <AlertRow
                level="warning"
                msg="High appointment volume — OPD General"
                time="8m"
                sub="87% capacity · Consider adding an afternoon slot"
              />
              <AlertRow
                level="info"
                msg="Pending billing review — 3 invoices"
                time="24m"
                sub="INV-2893, INV-2894, INV-2896 awaiting approval"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
