import { useState, useEffect } from "react";
import { appointmentsApi } from "../../appointments/api/appointments.api";
import { PatientQueueCard } from "../../patients/components/PatientQueueCard";
import {
  Calendar,
  Clock,
  Pill,
  Receipt,
  TrendingDown,
  TrendingUp,
  Download,
  Bell,
  Stethoscope,
  User,
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
const PAT_APPOINTMENT_TIMELINE = [
  {
    date: "Mar 15, 2025",
    time: "10:30 AM",
    doctor: "Dr. Arjun Mehta",
    dept: "Cardiology",
    status: "Upcoming",
  },
  {
    date: "Mar 12, 2025",
    time: "09:15 AM",
    doctor: "Dr. Arjun Mehta",
    dept: "Cardiology",
    status: "Completed",
  },
  {
    date: "Feb 20, 2025",
    time: "11:00 AM",
    doctor: "Dr. Arjun Mehta",
    dept: "Cardiology",
    status: "Completed",
  },
  {
    date: "Feb 05, 2025",
    time: "02:30 PM",
    doctor: "Dr. Priya Sharma",
    dept: "General OPD",
    status: "Cancelled",
  },
  {
    date: "Jan 08, 2025",
    time: "10:00 AM",
    doctor: "Dr. Priya Sharma",
    dept: "General OPD",
    status: "Completed",
  },
];

// Section 02: Consultation History Trend (Line Chart)
const PAT_CONSULTATION_TREND = [
  { month: "Oct", visits: 1 },
  { month: "Nov", visits: 0 },
  { month: "Dec", visits: 1 },
  { month: "Jan", visits: 1 },
  { month: "Feb", visits: 2 },
  { month: "Mar", visits: 2 },
];

// Section 03: Prescription Summary (Pie / Bar Chart)
const PAT_PRESCRIPTION_SUMMARY = [
  { name: "Active", count: 3, color: "#009688" },
  { name: "Completed", count: 5, color: "#66BB6A" },
  { name: "Expired", count: 2, color: "#EF4444" },
];

// Section 04: Billing Summary (Donut / Bar Chart)
const PAT_BILLING_SUMMARY = [
  { name: "Paid", amount: 370.6, color: "#66BB6A" },
  { name: "Pending", amount: 142.6, color: "#F59E0B" },
];

// Section 05: Recent Prescriptions Table
const PAT_RECENT_PRESCRIPTIONS = [
  {
    rxId: "RX-9042",
    doctor: "Dr. Arjun Mehta",
    date: "Mar 12, 2025",
    medsCount: 3,
    status: "Active",
  },
  {
    rxId: "RX-8812",
    doctor: "Dr. Arjun Mehta",
    date: "Feb 20, 2025",
    medsCount: 2,
    status: "Active",
  },
  {
    rxId: "RX-8510",
    doctor: "Dr. Priya Sharma",
    date: "Jan 08, 2025",
    medsCount: 1,
    status: "Completed",
  },
  {
    rxId: "RX-8204",
    doctor: "Dr. Arjun Mehta",
    date: "Dec 14, 2024",
    medsCount: 2,
    status: "Expired",
  },
];

// Section 06: Recent Bills Table
const PAT_RECENT_BILLS = [
  { invoice: "INV-847", date: "Mar 12, 2025", amount: 97.6, status: "Unpaid" },
  { invoice: "INV-831", date: "Feb 20, 2025", amount: 45.0, status: "Pending" },
  { invoice: "INV-810", date: "Jan 08, 2025", amount: 28.0, status: "Paid" },
  { invoice: "INV-790", date: "Dec 14, 2024", amount: 200.0, status: "Paid" },
];

const PAT_STATUS_CHIP: Record<
  string,
  "success" | "warning" | "info" | "error" | "teal" | "default"
> = {
  Upcoming: "teal",
  Confirmed: "success",
  Completed: "success",
  Active: "success",
  Paid: "success",
  Unpaid: "error",
  Pending: "warning",
  Cancelled: "error",
  Expired: "error",
  Downloaded: "info",
  Success: "success",
};

const PAT_QUICK_ACTIONS = [
  {
    label: "Book Appointment",
    Icon: Calendar,
    color: "#009688",
    action: "book",
  },
  {
    label: "View Appointments",
    Icon: Clock,
    color: "#0D47A1",
    action: "appts",
  },
  {
    label: "View Prescriptions",
    Icon: Pill,
    color: "#4DB6AC",
    action: "prescriptions",
  },
  { label: "View Bills", Icon: Receipt, color: "#F59E0B", action: "bills" },
  {
    label: "Download Invoice",
    Icon: Download,
    color: "#66BB6A",
    action: "download",
  },
  { label: "Update Profile", Icon: User, color: "#64748B", action: "profile" },
];

export function PatientDashboard({
  onBookAppointmentClick,
  onViewBillsClick,
  onNavigateNav,
  activePatient,
  familyMembers = [],
  onSwitchPatient,
  onAddFamilyMember,
}: {
  onBookAppointmentClick?: () => void;
  onViewBillsClick?: () => void;
  onNavigateNav?: (nav: string) => void;
  activePatient?: { id?: number | string; mrn?: string; name?: string; patientName?: string; relationship?: string; fullName?: string } | null;
  familyMembers?: { id?: number | string; mrn?: string; name?: string; patientName?: string; fullName?: string; relationship?: string }[];
  onSwitchPatient?: (member: { id?: number | string; mrn?: string; name?: string; patientName?: string; fullName?: string; relationship?: string }) => void;
  onAddFamilyMember?: () => void;
}) {
  interface DashboardAppointment {
    status?: string;
    appointmentDate?: string;
    date?: string;
    startTime?: string;
    time?: string;
  }
  const [appointmentsList, setAppointmentsList] = useState<
    DashboardAppointment[]
  >([]);

  useEffect(() => {
    appointmentsApi
      .getAppointments(
        activePatient?.id || activePatient?.mrn
          ? { patientId: activePatient.id || activePatient.mrn }
          : undefined,
      )
      .then((res: unknown) => {
        const resObj = res as Record<string, unknown> | null | undefined;
        const data = resObj?.data || resObj;
        const list = Array.isArray(data)
          ? (data as DashboardAppointment[])
          : Array.isArray((data as Record<string, unknown>)?.content)
            ? ((data as Record<string, unknown>)
                .content as DashboardAppointment[])
            : [];
        setAppointmentsList(list);
      })
      .catch(() => {
        setAppointmentsList([]);
      });
  }, [activePatient]);

  const upcomingApt = appointmentsList.find(
    (a) => a.status === "SCHEDULED" || a.status === "Confirmed",
  );

  const upcomingStr = upcomingApt
    ? `${upcomingApt.appointmentDate || upcomingApt.date} ${upcomingApt.startTime || upcomingApt.time || ""}`
    : "No Upcoming Visit";

  const totalBillsAmount = PAT_BILLING_SUMMARY.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: "#F1F5F9" }}
    >
      {/* ── ACTIVE PATIENT CONTEXT BANNER ── */}
      {activePatient && (
        <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm">
              {(activePatient.patientName || activePatient.name || "P")[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#111827]">
                  Active Patient:{" "}
                  {activePatient.patientName || activePatient.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0D47A1] text-[10px] font-semibold border border-blue-100">
                  {activePatient.relationship || "Self"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                MRN: {activePatient.mrn || "Generating..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onAddFamilyMember && (
              <button
                onClick={onAddFamilyMember}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1"
              >
                + Add Family Member
              </button>
            )}
            {onSwitchPatient && familyMembers.length > 1 && (
              <button
                onClick={() => onSwitchPatient(familyMembers[0])}
                className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                Switch Patient
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── ACTIVE QUEUE STATUS ── */}
      <PatientQueueCard />

      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1"
          style={{ fontFamily: PP }}
        >
          Personal Healthcare Actions
        </span>
        {PAT_QUICK_ACTIONS.map(({ label, Icon, color, action }) => (
          <button
            key={label}
            onClick={() => {
              if (action === "book" && onBookAppointmentClick)
                onBookAppointmentClick();
              else if (action === "bills" && onViewBillsClick)
                onViewBillsClick();
              else if (action === "book" && onNavigateNav)
                onNavigateNav("appointments");
              else if (action === "appts" && onNavigateNav)
                onNavigateNav("appointments");
              else if (action === "prescriptions" && onNavigateNav)
                onNavigateNav("prescriptions");
              else if (action === "bills" && onNavigateNav)
                onNavigateNav("billing");
              else if (action === "download" && onNavigateNav)
                onNavigateNav("billing");
              else if (action === "profile" && onNavigateNav)
                onNavigateNav("settings");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Row — 5 Personal Healthcare KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi
          title="Upcoming Appointment"
          value={upcomingStr}
          sub="Dr. Arjun Mehta (Cardiology)"
          trend="Confirmed Slot"
          up={true}
          data={[{ v: 1 }, { v: 1 }, { v: 2 }, { v: 1 }, { v: 1 }, { v: 1 }]}
          color="#0D47A1"
          gid="pt1"
          Icon={Calendar}
        />
        <DKpi
          title="Active Prescriptions"
          value="3 Active"
          sub="Metoprolol, Aspirin..."
          trend="All Meds Refilled"
          up={true}
          data={[{ v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 3 }, { v: 3 }]}
          color="#009688"
          gid="pt2"
          Icon={Pill}
        />
        <DKpi
          title="Outstanding Bills"
          value="$142.60"
          sub="2 Pending Invoices"
          trend="Due Mar 15 & Mar 20"
          up={false}
          data={[
            { v: 200 },
            { v: 180 },
            { v: 160 },
            { v: 150 },
            { v: 142.6 },
            { v: 142.6 },
          ]}
          color="#F59E0B"
          gid="pt3"
          Icon={Receipt}
        />
        <DKpi
          title="Completed Consultations"
          value="7 OPD Visits"
          sub="Recent: Mar 12, 2025"
          trend="Stable Angina Review"
          up={true}
          data={[{ v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }]}
          color="#66BB6A"
          gid="pt4"
          Icon={Stethoscope}
        />
        <DKpi
          title="Health Notifications"
          value="3 Unread"
          sub="1 Reminder, 1 Bill, 1 Rx"
          trend="Action Required"
          up={false}
          data={[{ v: 5 }, { v: 4 }, { v: 2 }, { v: 4 }, { v: 3 }, { v: 3 }]}
          color="#EF4444"
          gid="pt5"
          Icon={Bell}
        />
      </div>

      {/* ── Main Personal Healthcare Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 01: My Appointment Timeline */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="My Appointment Timeline"
            sub="View Appointment History & Future Appointments"
            action={
              <button
                onClick={() => onBookAppointmentClick?.()}
                className="text-xs text-[#0D47A1] font-semibold hover:underline"
                style={{ fontFamily: PP }}
              >
                + Book New
              </button>
            }
          />
          <div className="space-y-3.5 my-auto">
            {PAT_APPOINTMENT_TIMELINE.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-slate-50 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-[#0D47A1] font-bold text-xs">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {item.doctor} ·{" "}
                      <span className="text-[#64748B] font-normal">
                        {item.dept}
                      </span>
                    </div>
                    <div
                      className="text-[11px] text-[#64748B] mt-0.5"
                      style={{ fontFamily: RB }}
                    >
                      {item.date} at{" "}
                      <span className="font-mono font-semibold text-[#0D47A1]">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Chip
                  label={item.status}
                  variant={PAT_STATUS_CHIP[item.status] || "default"}
                />
              </div>
            ))}
          </div>
          <div
            className="mt-3 pt-2 border-t border-gray-50 text-xs text-[#64748B] text-center"
            style={{ fontFamily: RB }}
          >
            Next Visit:{" "}
            <span className="font-semibold text-[#0D47A1]">
              Dr. Arjun Mehta on Sat, Mar 15, 2025 (10:30 AM)
            </span>
          </div>
        </div>

        {/* Section 02: Consultation History Trend (Line Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Consultation History" sub="Monthly OPD Visit Frequency" />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={PAT_CONSULTATION_TREND}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="patVisitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
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
                formatter={(v: unknown) => [`${v} Visits`, "Consultations"]}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#0D47A1"
                strokeWidth={2.5}
                fill="url(#patVisitGrad)"
                dot={{ r: 3, fill: "#0D47A1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            className="mt-2 pt-2 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Total OPD Visits: 7 Visits</span>
            <span className="font-semibold text-[#0D47A1]">Avg 1.2/Month</span>
          </div>
        </div>
      </div>

      {/* ── Section 03 & 04: Prescription Summary & Billing Summary Charts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Section 03: Prescription Summary (Pie / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Prescription Status"
            sub="Quick Overview of Medication Status"
          />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={PAT_PRESCRIPTION_SUMMARY}
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
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={26}>
                {PAT_PRESCRIPTION_SUMMARY.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {PAT_PRESCRIPTION_SUMMARY.map((p) => (
              <div
                key={p.name}
                className="text-center p-1.5 rounded-lg bg-slate-50"
              >
                <span className="text-[10px] text-[#64748B] block">
                  {p.name}
                </span>
                <span className="font-bold text-[#111827]">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 04: Billing Summary (Donut / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH title="Billing Overview" sub="Display Personal Payment Status" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={PAT_BILLING_SUMMARY}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: unknown) => `$${v}`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [
                  `$${Number(v).toFixed(2)}`,
                  "Amount",
                ]}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={16}>
                {PAT_BILLING_SUMMARY.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            <span className="text-[#64748B]">
              Total Billing History: ${totalBillsAmount.toFixed(2)}
            </span>
            <span className="font-bold text-[#F59E0B]">
              $142.60 Pending Due
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 05: Recent Prescriptions Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Recent Prescriptions
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Issued medical prescriptions and active orders
            </div>
          </div>
          <span
            className="text-xs font-semibold text-[#009688] bg-teal-50 px-2.5 py-1 rounded-lg"
            style={{ fontFamily: RB }}
          >
            3 Active Meds
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {[
                  "Prescription ID",
                  "Prescribing Doctor",
                  "Issued Date",
                  "Medicine Count",
                  "Status",
                  "Action",
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
              {PAT_RECENT_PRESCRIPTIONS.map((rx, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                    {rx.rxId}
                  </td>
                  <td
                    className="px-5 py-3 text-xs font-medium text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {rx.doctor}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">
                    {rx.date}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#111827]">
                    {rx.medsCount} Medicines
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={rx.status}
                      variant={PAT_STATUS_CHIP[rx.status] || "default"}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      className="px-3 py-1 rounded-lg bg-blue-50 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-100 transition-colors"
                      style={{ fontFamily: PP }}
                    >
                      View Prescription
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 06: Recent Bills Table ── */}
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
              Personal billing statements & payment history
            </div>
          </div>
          <button
            onClick={() => onViewBillsClick?.()}
            className="text-xs text-[#0D47A1] font-semibold hover:underline"
            style={{ fontFamily: RB }}
          >
            Pay Pending Bills →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {[
                  "Invoice Number",
                  "Visit Date",
                  "Amount",
                  "Payment Status",
                  "Action",
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
              {PAT_RECENT_BILLS.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                    {b.invoice}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">
                    {b.date}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#111827]">
                    ${b.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={b.status}
                      variant={PAT_STATUS_CHIP[b.status] || "default"}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      className="px-3 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                      style={{ fontFamily: PP }}
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
