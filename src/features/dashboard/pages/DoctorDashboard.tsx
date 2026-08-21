import { useNavigate } from "react-router";
import React, { useMemo } from "react";
import { ROUTES } from "../../../app/routes/routes";
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
  useDoctorStatistics,
  useDoctorCurrentPatient,
  useDoctorNextPatient,
  useDoctorTodayAppointments,
  useDoctorConsultationQueue,
  useDoctorCallToken,
  useDoctorCompleteAppointment,
} from "../hooks/useDoctorDashboard";

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
} from "../../../common/components/recharts-lazy";


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
  onClick,
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
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3 shadow-sm ${
        onClick
          ? "cursor-pointer hover:shadow-md hover:border-[#0D47A1]/30 transition-colors duration-200"
          : ""
      }`}
    >
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
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  const safeName = (name || "??").trim() || "??";
  const initials = safeName
    .split(" ")
    .filter(Boolean)
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
  const bg =
    palette[(safeName?.charCodeAt(0) ?? "?".charCodeAt(0)) % palette.length];
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
// ─── API status → UI mapping helpers ────────────────────────────────────────
const DOC_STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Scheduled",
  BOOKED: "Scheduled",
  CHECKED_IN: "Checked In",
  WAITING_FOR_VITALS: "Waiting",
  WAITING_FOR_DOCTOR_CALL: "Waiting",
  IN_CONSULTATION: "In Consultation",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};

const DOC_STATUS_COLOR: Record<string, string> = {
  Scheduled: "#0D47A1",
  "Checked In": "#009688",
  Waiting: "#F59E0B",
  "In Consultation": "#009688",
  Completed: "#66BB6A",
  Cancelled: "#EF4444",
  "No Show": "#64748B",
};

const DOC_STATUS_CHIP: Record<
  string,
  "success" | "teal" | "warning" | "error" | "info" | "default"
> = {
  Scheduled: "info",
  "Checked In": "teal",
  Waiting: "warning",
  "In Consultation": "teal",
  Completed: "success",
  Cancelled: "error",
  "No Show": "error",
};

const DOC_QUICK_ACTIONS = [
  { label: "Start Consultation", Icon: Stethoscope, color: "#009688" },
  { label: "Open Patient Record", Icon: FileText, color: "#0D47A1" },
  { label: "Write Prescription", Icon: Pill, color: "#0D47A1" },
  { label: "Add Clinical Note", Icon: ClipboardList, color: "#009688" },
];

const hourKey = (time: string) => {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return "";
  let hour = parseInt(match[1], 10) % 12;
  if (match[3] && /pm/i.test(match[3])) hour += 12;
  if (!match[3] && parseInt(match[1], 10) >= 12 && !match[1].startsWith("0")) {
    hour = parseInt(match[1], 10) % 24;
  }
  return `${String(hour).padStart(2, "0")}:00`;
};

export function DoctorDashboard() {
  const navigate = useNavigate();

  const statsQuery = useDoctorStatistics();
  const currentPatientQuery = useDoctorCurrentPatient();
  const nextPatientQuery = useDoctorNextPatient();
  const todayAppointmentsQuery = useDoctorTodayAppointments();
  const consultationQueueQuery = useDoctorConsultationQueue();
  const callTokenMutation = useDoctorCallToken();
  const completeMutation = useDoctorCompleteAppointment();

  const stats = statsQuery.data;
  const currentPatient = currentPatientQuery.data;
  const nextPatient = nextPatientQuery.data;
  const rawTimeline = todayAppointmentsQuery.data?.timeline;
  const timelineItems = useMemo(() => rawTimeline || [], [rawTimeline]);
  const consultationQueue = consultationQueueQuery.data;

  const parseMinutes = (val?: string) => {
    if (!val) return 0;
    const n = parseInt(val.replace(/[^\d]/g, ""), 10);
    return Number.isNaN(n) ? 0 : n;
  };

  const hourlyProgress = useMemo(() => {
    const hours = Array.from(
      { length: 10 },
      (_, i) => `${String(i + 8).padStart(2, "0")}:00`,
    );
    let running = 0;
    return hours.map((hour) => {
      const completedAtHour = timelineItems.filter(
        (a) => a.status === "COMPLETED" && hourKey(a.time) === hour,
      ).length;
      running += completedAtHour;
      return { hour, completed: running, remaining: 0 };
    });
  }, [timelineItems]);

  const totalAppointmentsToday = stats?.todayAppointments ?? 0;
  const completedNow =
    stats?.completed ??
    hourlyProgress[hourlyProgress.length - 1]?.completed ??
    0;
  const remainingQueue = consultationQueue?.summary?.waiting ?? 0;

  const statusDist = useMemo(() => {
    const counts = new Map<string, number>();
    timelineItems.forEach((a) => {
      const label = DOC_STATUS_LABEL[a.status] || a.status || "Unknown";
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({
      name,
      value,
      color: DOC_STATUS_COLOR[name] || "#64748B",
    }));
  }, [timelineItems]);

  const performanceMetrics = useMemo(() => {
    const completionPct =
      totalAppointmentsToday > 0
        ? Math.round(((stats?.completed ?? 0) / totalAppointmentsToday) * 100)
        : 0;
    const avgMins = parseMinutes(stats?.averageConsultationTime);
    return [
      {
        metric: "Appointments Today",
        value: String(totalAppointmentsToday),
        status: totalAppointmentsToday > 0 ? "ACTIVE" : "--",
      },
      {
        metric: "Completed Consultations",
        value: String(stats?.completed ?? 0),
        status:
          completionPct >= 60
            ? "AHEAD"
            : completionPct > 0
              ? "ON TRACK"
              : "PENDING",
      },
      {
        metric: "Pending Consultations",
        value: String(stats?.pending ?? 0),
        status: (stats?.pending ?? 0) > 0 ? "PENDING" : "CLEARED",
      },
      {
        metric: "Average Consultation Time",
        value: `${avgMins} min`,
        status:
          avgMins > 0 && avgMins <= 15
            ? "EFFICIENT"
            : avgMins > 15
              ? "REVIEW"
              : "--",
      },
      {
        metric: "Queue Waiting",
        value: String(remainingQueue),
        status: remainingQueue > 0 ? "PENDING" : "CLEARED",
      },
    ];
  }, [stats, totalAppointmentsToday, remainingQueue]);

  const callNext = () => {
    if (!nextPatient) return;
    callTokenMutation.mutate(nextPatient.token);
  };

  const completeVisit = () => {
    if (!currentPatient) return;
    completeMutation.mutate(currentPatient.appointmentId);
  };

  const isLoading = statsQuery.isLoading;

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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#009688]/40 hover:text-[#009688] hover:bg-teal-50 transition-colors shadow-sm"
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
          value={String(totalAppointmentsToday)}
          sub={isLoading ? "Loading..." : "Scheduled today"}
          trend={totalAppointmentsToday > 0 ? "+100%" : "--"}
          up={totalAppointmentsToday > 0}
          data={
            hourlyProgress.length > 0
              ? hourlyProgress.map((h) => ({ v: h.completed }))
              : [{ v: 0 }]
          }
          color="#0D47A1"
          gid="doc1"
          Icon={Calendar}
          onClick={() =>
            navigate(`${ROUTES.REPORTS}?report=daily-appointments`)
          }
        />
        <DKpi
          title="Patients Consulted"
          value={String(stats?.completedConsultations ?? stats?.completed ?? 0)}
          sub={isLoading ? "Loading..." : "Completed today"}
          trend={
            (stats?.completedConsultations ?? stats?.completed ?? 0) > 0
              ? "+100%"
              : "--"
          }
          up={true}
          data={
            hourlyProgress.length > 0
              ? hourlyProgress.map((h) => ({ v: h.completed }))
              : [{ v: 0 }]
          }
          color="#66BB6A"
          gid="doc2"
          Icon={CheckSquare}
          onClick={() =>
            navigate(`${ROUTES.REPORTS}?report=patient-registrations`)
          }
        />
        <DKpi
          title="Pending Consultations"
          value={String(stats?.pendingConsultations ?? stats?.pending ?? 0)}
          sub={isLoading ? "Loading..." : "Awaiting consultation"}
          trend={
            (stats?.pendingConsultations ?? stats?.pending ?? 0) > 0
              ? "Action Required"
              : "All Clear"
          }
          up={
            stats
              ? (stats.pendingConsultations ?? stats.pending ?? 0) === 0
              : false
          }
          data={
            hourlyProgress.length > 0
              ? hourlyProgress.map((h) => ({ v: h.completed }))
              : [{ v: 0 }]
          }
          color="#F59E0B"
          gid="doc3"
          Icon={Clock}
          onClick={() =>
            navigate(`${ROUTES.REPORTS}?report=daily-appointments`)
          }
        />
        <DKpi
          title="Avg Consultation Time"
          value={
            stats
              ? `${stats.averageConsultationTimeMinutes ?? (parseInt(stats.averageConsultationTime || "12") || 12)} min`
              : "--"
          }
          sub={isLoading ? "Loading..." : "Per patient"}
          trend={
            stats &&
            (stats.averageConsultationTimeMinutes ??
              (parseInt(stats.averageConsultationTime || "12") || 12)) <= 15
              ? "Efficient"
              : "Review"
          }
          up={
            stats
              ? (stats.averageConsultationTimeMinutes ??
                  (parseInt(stats.averageConsultationTime || "12") || 12)) <= 15
              : false
          }
          data={[
            {
              v:
                stats?.averageConsultationTimeMinutes ??
                (stats?.averageConsultationTime
                  ? parseInt(stats.averageConsultationTime)
                  : 12) ??
                0,
            },
          ]}
          color="#009688"
          gid="doc4"
          Icon={Pill}
        />
        <DKpi
          title="Queue Waiting"
          value={String(remainingQueue)}
          sub={isLoading ? "Loading..." : "Patients in queue"}
          trend={remainingQueue > 0 ? `${remainingQueue} waiting` : "No queue"}
          up={true}
          data={[{ v: remainingQueue }]}
          color="#0D47A1"
          gid="doc5"
          Icon={DollarSign}
          onClick={() => navigate(`${ROUTES.APPOINTMENTS}`)}
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
            {currentPatient
              ? currentPatient.token
              : currentPatientQuery.isLoading
                ? "Loading..."
                : "No active token"}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap xl:flex-nowrap">
          <Av
            name={currentPatient?.patientName || "No Active Patient"}
            size="lg"
          />
          <div className="flex-1 min-w-50">
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {currentPatient?.patientName || "No Active Patient"}
              </span>
              {currentPatient && (
                <span className="font-mono text-xs text-[#64748B]">
                  {currentPatient.appointmentId} · {currentPatient.patientId}
                </span>
              )}
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              {currentPatient
                ? `${currentPatient.age} Yrs / ${currentPatient.gender} · BP ${currentPatient.vitals?.bp || "--"} · Pulse ${currentPatient.vitals?.pulse || "--"} · Temp ${currentPatient.vitals?.temperature || "--"}`
                : currentPatientQuery.isLoading
                  ? "Loading active consultation..."
                  : "No active consultation"}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Chip
                label={
                  DOC_STATUS_LABEL[
                    currentPatient?.consultationStatus || "SCHEDULED"
                  ] || "In Consultation"
                }
                variant={
                  DOC_STATUS_CHIP[
                    DOC_STATUS_LABEL[
                      currentPatient?.consultationStatus || "SCHEDULED"
                    ] || "In Consultation"
                  ] || "teal"
                }
              />
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
              onClick={completeVisit}
              disabled={!currentPatient || completeMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#0D47A1] text-[#0D47A1] text-xs font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: PP }}
            >
              <CheckSquare size={13} />
              {completeMutation.isPending ? "Completing..." : "Complete Visit"}
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
              Pace:{" "}
              {stats?.averageConsultationTimeMinutes ??
                (stats?.averageConsultationTime
                  ? parseInt(stats.averageConsultationTime)
                  : 12) ??
                0}{" "}
              min/consultation
            </span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={hourlyProgress}
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
              {completedNow} Completed · {remainingQueue} Remaining Queue
            </span>
          </div>
        </div>

        {/* Section 02: Today's Patient Status (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Patient Consultation Status"
            sub="Current OPD Workflow Breakdown"
          />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={statusDist}
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
                {statusDist.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {statusDist.map((s) => (
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
            {totalAppointmentsToday} Total Appointments Today
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
                  {["Time", "Token", "Patient Name", "Status"].map((h) => (
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
                {timelineItems.map((a) => (
                  <tr
                    key={a.appointmentId || a.token}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                      {a.time}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-600">
                      {a.token}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Av name={a.patientName} size="sm" />
                        <span
                          className="text-xs font-medium text-[#111827]"
                          style={{ fontFamily: RB }}
                        >
                          {a.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Chip
                        label={DOC_STATUS_LABEL[a.status] || a.status}
                        variant={
                          DOC_STATUS_CHIP[
                            DOC_STATUS_LABEL[a.status] || a.status
                          ] || "default"
                        }
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
            <span>
              {timelineItems.length > 0
                ? `${timelineItems.length} appointments today`
                : todayAppointmentsQuery.isLoading
                  ? "Loading appointments..."
                  : "No appointments scheduled"}
            </span>
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
                    {currentPatient?.patientName || "No Active Patient"}
                  </div>
                  <div
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {currentPatient
                      ? `${currentPatient.token} · ${currentPatient.appointmentId}`
                      : currentPatientQuery.isLoading
                        ? "Loading..."
                        : "No active consultation"}
                  </div>
                </div>
                <Chip
                  label={currentPatient ? "In Progress" : "Idle"}
                  variant={currentPatient ? "teal" : "default"}
                />
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
                    {nextPatient?.patientName || "No Next Patient"}
                  </div>
                  <div
                    className="text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {nextPatient
                      ? `${nextPatient.token} · At ${nextPatient.appointmentTime}`
                      : nextPatientQuery.isLoading
                        ? "Loading..."
                        : "Queue is empty"}
                  </div>
                </div>
                <Chip
                  label={nextPatient ? "Waiting" : "Empty"}
                  variant={nextPatient ? "warning" : "default"}
                />
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
                  {remainingQueue}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div
                  className="text-[10px] text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Next Token
                </div>
                <div
                  className="text-base font-bold text-[#F59E0B] mt-0.5"
                  style={{ fontFamily: PP }}
                >
                  {nextPatient?.token || "--"}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                <div
                  className="text-[10px] text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Next At
                </div>
                <div
                  className="text-base font-bold text-[#009688] mt-0.5"
                  style={{ fontFamily: PP }}
                >
                  {nextPatient?.appointmentTime || "--"}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={callNext}
            disabled={!nextPatient || callTokenMutation.isPending}
            className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: PP }}
          >
            <Stethoscope size={13} />
            {callTokenMutation.isPending
              ? "Calling..."
              : nextPatient
                ? `Call Next Patient (${nextPatient.token})`
                : "No Patients in Queue"}
          </button>
        </div>
      </div>

      {/* ── Section 05: Consultation Queue (Live Tokens) ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
        <SH
          title="Consultation Queue"
          sub="Live waiting tokens for this doctor"
        />
        <div className="space-y-2">
          {(consultationQueue?.queue || []).length > 0 ? (
            consultationQueue.queue.map((qItem) => (
              <div
                key={`${qItem.token || "token"}-${qItem.patientId || "pat"}-${qItem.patientName || "unknown"}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#0D47A1]">
                    {qItem.token}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {qItem.patientName} · {qItem.departmentName}
                  </span>
                </div>
                <button
                  onClick={() => callTokenMutation.mutate(qItem.token)}
                  disabled={callTokenMutation.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
                  style={{ fontFamily: PP }}
                >
                  <Stethoscope size={12} /> Call Now
                </button>
              </div>
            ))
          ) : (
            <div
              className="p-6 text-center text-xs text-[#64748B] border border-dashed border-[#E5E7EB] rounded-xl"
              style={{ fontFamily: RB }}
            >
              {consultationQueueQuery.isLoading
                ? "Loading queue..."
                : "No patients waiting in queue"}
            </div>
          )}
        </div>
        <div
          className="mt-3 pt-3 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between"
          style={{ fontFamily: RB }}
        >
          <span>Queue length</span>
          <span className="font-semibold text-[#0D47A1]">
            {remainingQueue} Waiting
          </span>
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
              {["Metric", "Value", "Status"].map((h) => (
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
            {performanceMetrics.map((m) => (
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
                  {m.value}
                </td>
                <td className="px-5 py-3">
                  <Chip
                    label={m.status}
                    variant={
                      m.status === "AHEAD" ||
                      m.status === "EFFICIENT" ||
                      m.status === "CLEARED"
                        ? "success"
                        : m.status === "ON TRACK" || m.status === "ACTIVE"
                          ? "info"
                          : m.status === "PENDING" || m.status === "REVIEW"
                            ? "warning"
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