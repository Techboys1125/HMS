import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  UserCheck,
  RefreshCw,
  Download,
  Search,
  XCircle,
  ArrowUpRight,
  UserCheck as CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Design System Tokens ───
const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

// ─── Data Types ───
export interface ReceptionStaffMember {
  id: string;
  name: string;
  counter: string;
  appointmentsBooked: number;
  patientsRegistered: number;
  checkInsCompleted: number;
  avgCheckInTime: string;
  status: "Active" | "On Break" | "Offline";
  lastActive: string;
}

export interface TodayAppointmentSummary {
  id: string;
  token: string;
  mrn: string;
  patientName: string;
  doctor: string;
  department: string;
  appointmentTime: string;
  status:
    | "Booked"
    | "Checked-In"
    | "Waiting Nurse"
    | "Ready Consultation"
    | "In Doctor"
    | "Billing"
    | "Completed"
    | "Cancelled";
  receptionist: string;
}

// ─── Mock Data ───
const INITIAL_RECEPTION_STAFF: ReceptionStaffMember[] = [
  {
    id: "STF-01",
    name: "Emily Watson",
    counter: "OPD Counter 01 (Main Desk)",
    appointmentsBooked: 38,
    patientsRegistered: 14,
    checkInsCompleted: 42,
    avgCheckInTime: "2.4 mins",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "STF-02",
    name: "Robert Vance",
    counter: "OPD Counter 02 (Express Check-in)",
    appointmentsBooked: 29,
    patientsRegistered: 9,
    checkInsCompleted: 35,
    avgCheckInTime: "1.8 mins",
    status: "Active",
    lastActive: "2 mins ago",
  },
  {
    id: "STF-03",
    name: "Sophia Martinez",
    counter: "OPD Counter 03 (General Desk)",
    appointmentsBooked: 42,
    patientsRegistered: 18,
    checkInsCompleted: 31,
    avgCheckInTime: "2.9 mins",
    status: "On Break",
    lastActive: "12 mins ago",
  },
  {
    id: "STF-04",
    name: "David Miller",
    counter: "OPD Counter 04 (Specialty OPD)",
    appointmentsBooked: 21,
    patientsRegistered: 6,
    checkInsCompleted: 24,
    avgCheckInTime: "3.1 mins",
    status: "Active",
    lastActive: "1 min ago",
  },
  {
    id: "STF-05",
    name: "Anna Kowalski",
    counter: "OPD Counter 05 (Priority Desk)",
    appointmentsBooked: 15,
    patientsRegistered: 4,
    checkInsCompleted: 18,
    avgCheckInTime: "2.1 mins",
    status: "Offline",
    lastActive: "1 hour ago",
  },
];

const INITIAL_TODAY_APPOINTMENTS: TodayAppointmentSummary[] = [
  {
    id: "APT-1001",
    token: "TK-001",
    mrn: "MRN-2026-001",
    patientName: "Sarah Mitchell",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:00 AM",
    status: "In Doctor",
    receptionist: "Emily Watson",
  },
  {
    id: "APT-1002",
    token: "TK-002",
    mrn: "MRN-2026-002",
    patientName: "James Thornton",
    doctor: "Dr. Priya Sharma",
    department: "General OPD",
    appointmentTime: "09:15 AM",
    status: "Waiting Nurse",
    receptionist: "Robert Vance",
  },
  {
    id: "APT-1003",
    token: "TK-003",
    mrn: "MRN-2026-003",
    patientName: "Emma Reyes",
    doctor: "Dr. Sarah Patel",
    department: "Gynecology",
    appointmentTime: "09:30 AM",
    status: "Checked-In",
    receptionist: "Emily Watson",
  },
  {
    id: "APT-1004",
    token: "TK-004",
    mrn: "MRN-2026-004",
    patientName: "Robert Chen",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:45 AM",
    status: "Ready Consultation",
    receptionist: "Sophia Martinez",
  },
  {
    id: "APT-1005",
    token: "TK-005",
    mrn: "MRN-2026-005",
    patientName: "Aisha Kumar",
    doctor: "Dr. Raj Kapoor",
    department: "Neurology",
    appointmentTime: "10:00 AM",
    status: "Booked",
    receptionist: "Robert Vance",
  },
  {
    id: "APT-1006",
    token: "TK-006",
    mrn: "MRN-2026-006",
    patientName: "David Walsh",
    doctor: "Dr. Chen Wei",
    department: "Orthopedics",
    appointmentTime: "10:15 AM",
    status: "Completed",
    receptionist: "Emily Watson",
  },
  {
    id: "APT-1007",
    token: "TK-007",
    mrn: "MRN-2026-007",
    patientName: "Lily Anderson",
    doctor: "Dr. Priya Sharma",
    department: "General OPD",
    appointmentTime: "10:30 AM",
    status: "Billing",
    receptionist: "David Miller",
  },
  {
    id: "APT-1008",
    token: "TK-008",
    mrn: "MRN-2026-008",
    patientName: "Marcus Brown",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "10:45 AM",
    status: "Cancelled",
    receptionist: "Robert Vance",
  },
];

// ─── RECEPTION ACTIVITY BAR CHART DATA ───
const RECEPTION_ACTIVITY_BAR_DATA = [
  {
    time: "08:00 AM",
    Bookings: 18,
    Registrations: 6,
    CheckIns: 12,
    Completed: 4,
  },
  {
    time: "09:00 AM",
    Bookings: 32,
    Registrations: 14,
    CheckIns: 28,
    Completed: 16,
  },
  {
    time: "10:00 AM",
    Bookings: 45,
    Registrations: 18,
    CheckIns: 39,
    Completed: 27,
  },
  {
    time: "11:00 AM",
    Bookings: 28,
    Registrations: 9,
    CheckIns: 24,
    Completed: 35,
  },
  {
    time: "12:00 PM",
    Bookings: 14,
    Registrations: 4,
    CheckIns: 15,
    Completed: 22,
  },
  {
    time: "01:00 PM",
    Bookings: 8,
    Registrations: 2,
    CheckIns: 10,
    Completed: 18,
  },
];

// ─── CURRENT OPD QUEUE STATUS DOUGHNUT CHART DATA ───
const QUEUE_STATUS_DONUT_DATA = [
  { name: "Waiting for Check-In", count: 18, color: "#F59E0B" },
  { name: "Waiting for Nurse", count: 24, color: "#4DB6AC" },
  { name: "Ready for Consultation", count: 18, color: "#009688" },
  { name: "In Consultation", count: 16, color: "#0D47A1" },
  { name: "Completed", count: 82, color: "#66BB6A" },
  { name: "Cancelled", count: 8, color: "#EF4444" },
];

const TOTAL_QUEUE_PATIENTS = QUEUE_STATUS_DONUT_DATA.reduce(
  (acc, curr) => acc + curr.count,
  0,
);

// Helper Chip Component for consistent badge design
function StatusChip({
  label,
  variant,
}: {
  label: string;
  variant: "success" | "teal" | "warning" | "error" | "info" | "default";
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-[#0D47A1] border-blue-200",
    default: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[variant]}`}
      style={{ fontFamily: PP }}
    >
      {label}
    </span>
  );
}

export function ReceptionManagementCenter({
  onNavigate,
}: {
  onNavigate?: (screen: string) => void;
}) {
  void onNavigate;
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [staffSearch, setStaffSearch] = useState("");
  const [selectedStaff, setSelectedStaff] =
    useState<ReceptionStaffMember | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<TodayAppointmentSummary | null>(null);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return INITIAL_TODAY_APPOINTMENTS.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === "All" || apt.department === departmentFilter;
      const matchesStatus =
        statusFilter === "All" || apt.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchTerm, departmentFilter, statusFilter]);

  // Filtered Reception Staff
  const filteredStaff = useMemo(() => {
    return INITIAL_RECEPTION_STAFF.filter(
      (stf) =>
        stf.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
        stf.counter.toLowerCase().includes(staffSearch.toLowerCase()),
    );
  }, [staffSearch]);

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: "#F1F5F9" }}
    >
      {/* ── 1. PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Reception Management
          </h1>
          <p
            className="text-xs text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            Monitor OPD reception activities, appointment flow, patient
            check-ins and reception staff performance.
          </p>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-all shadow-sm"
            style={{ fontFamily: PP }}
          >
            <RefreshCw size={14} className="text-[#009688]" />
            Refresh Dashboard
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-sm shadow-blue-900/10"
            style={{ fontFamily: PP }}
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── 2. KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Today's Appointments
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Calendar size={18} className="text-[#0D47A1]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              145
            </span>
            <span
              className="inline-flex items-center text-xs font-bold text-[#66BB6A]"
              style={{ fontFamily: RB }}
            >
              <ArrowUpRight size={14} /> +12.4% vs yesterday
            </span>
          </div>
          <div
            className="text-xs text-[#64748B] mt-2 pt-2 border-t border-slate-100 flex justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Total Bookings</span>
            <span className="font-semibold text-[#111827]">
              145 Appointments
            </span>
          </div>
        </div>

        {/* Patients Checked-In */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Patients Checked-In
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <UserCheck size={18} className="text-[#009688]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              108
            </span>
            <span
              className="text-xs font-semibold text-[#009688] bg-teal-50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: RB }}
            >
              74.5% Rate
            </span>
          </div>
          <div
            className="text-xs text-[#64748B] mt-2 pt-2 border-t border-slate-100 flex justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Remaining Appointments</span>
            <span className="font-semibold text-[#111827]">37 Pending</span>
          </div>
        </div>

        {/* Patients Waiting */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Patients Waiting
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={18} className="text-[#F59E0B]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              24
            </span>
            <span
              className="text-xs font-semibold text-[#F59E0B] bg-amber-50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: RB }}
            >
              Avg Wait: 14 mins
            </span>
          </div>
          <div
            className="text-xs text-[#64748B] mt-2 pt-2 border-t border-slate-100 flex justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Current Waiting Queue</span>
            <span className="font-semibold text-[#111827]">
              OPD Lobby A & B
            </span>
          </div>
        </div>

        {/* Completed Consultations */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold text-[#64748B]"
              style={{ fontFamily: PP }}
            >
              Completed Consultations
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-[#66BB6A]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              82
            </span>
            <span
              className="text-xs font-semibold text-[#66BB6A] bg-emerald-50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: RB }}
            >
              56.5% Completed
            </span>
          </div>
          <div
            className="text-xs text-[#64748B] mt-2 pt-2 border-t border-slate-100 flex justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Today's Discharges</span>
            <span className="font-semibold text-[#111827]">82 Patients</span>
          </div>
        </div>
      </div>

      {/* ── 4 & 5. RECEPTION ACTIVITY OVERVIEW & CURRENT OPD QUEUE STATUS CHART ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* 4. Reception Activity Today (Bar Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Reception Activity Today
              </h2>
              <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                Comparing bookings, registrations, check-ins, and completed
                visits
              </p>
            </div>
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Hourly Footfall
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={RECEPTION_ACTIVITY_BAR_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    borderColor: "#E5E7EB",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#111827",
                    fontFamily: PP,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: RB,
                    paddingTop: "10px",
                  }}
                />
                <Bar dataKey="Bookings" fill="#0D47A1" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="Registrations"
                  fill="#009688"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="CheckIns" fill="#4DB6AC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed" fill="#66BB6A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Current OPD Queue Status (Doughnut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Current OPD Queue Status
              </h2>
              <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
                Real-time queue distribution across OPD stages
              </p>
            </div>
            <div className="text-right">
              <div
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Total Patients
              </div>
              <div
                className="text-lg font-bold text-[#0D47A1]"
                style={{ fontFamily: PP }}
              >
                {TOTAL_QUEUE_PATIENTS}
              </div>
            </div>
          </div>

          {/* Donut Chart with Center Legend / Stats */}
          <div className="h-56 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={QUEUE_STATUS_DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {QUEUE_STATUS_DONUT_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    borderColor: "#E5E7EB",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    fontFamily: PP,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {TOTAL_QUEUE_PATIENTS}
              </span>
              <span
                className="text-[10px] text-slate-400 font-medium"
                style={{ fontFamily: RB }}
              >
                Active Queue
              </span>
            </div>
          </div>

          {/* Queue Categories Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E5E7EB]">
            {QUEUE_STATUS_DONUT_DATA.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className="text-[11px] font-medium text-slate-700 truncate"
                    style={{ fontFamily: RB }}
                  >
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#111827] ml-1">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 7. OPD RECEPTION STAFF PERFORMANCE ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              OPD Reception Staff Performance
            </h2>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Operational efficiency, check-in speeds, and throughput by OPD
              receptionist
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search receptionist..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#0D47A1] w-48"
                style={{ fontFamily: RB }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-slate-50/70 text-left">
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Receptionist
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Counter
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Appointments Booked
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Patient Registrations
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Check-Ins
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Average Check-In Time
                </th>
                <th
                  className="px-5 py-3 text-right text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredStaff.map((stf) => (
                <tr
                  key={stf.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0D47A1] font-bold text-xs flex items-center justify-center shrink-0">
                        {stf.name[0]}
                      </div>
                      <div>
                        <div
                          className="text-xs font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {stf.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {stf.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs text-[#111827] font-medium"
                    style={{ fontFamily: RB }}
                  >
                    {stf.counter}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono font-bold text-[#0D47A1]">
                    {stf.appointmentsBooked}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono font-bold text-[#009688]">
                    {stf.patientsRegistered}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono font-bold text-[#66BB6A]">
                    {stf.checkInsCompleted}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs text-[#111827] font-semibold"
                    style={{ fontFamily: RB }}
                  >
                    {stf.avgCheckInTime}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedStaff(stf)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0D47A1] text-xs font-semibold hover:bg-blue-100 transition-colors"
                      style={{ fontFamily: PP }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 8. TODAY'S APPOINTMENT SUMMARY ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2
              className="text-sm font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Today's Appointment Summary
            </h2>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Real-time snapshot of appointment bookings and receptionist
              tracking
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search patient, MRN, token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#0D47A1] w-52"
                style={{ fontFamily: RB }}
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs bg-white text-[#111827] focus:outline-none"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General OPD">General OPD</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs bg-white text-[#111827] focus:outline-none"
              style={{ fontFamily: RB }}
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Waiting Nurse">Waiting Nurse</option>
              <option value="Ready Consultation">Ready Consultation</option>
              <option value="In Doctor">In Doctor</option>
              <option value="Billing">Billing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-slate-50/70 text-left">
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Token
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  MRN
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Patient
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Doctor
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Department
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Appointment Time
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Current Status
                </th>
                <th
                  className="px-5 py-3 text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Receptionist
                </th>
                <th
                  className="px-5 py-3 text-right text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 rounded w-fit">
                    {apt.token}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                    {apt.mrn}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {apt.patientName}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs text-slate-700 font-medium"
                    style={{ fontFamily: RB }}
                  >
                    {apt.doctor}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs text-slate-600"
                    style={{ fontFamily: RB }}
                  >
                    {apt.department}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs text-[#111827] font-semibold"
                    style={{ fontFamily: RB }}
                  >
                    {apt.appointmentTime}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusChip
                      label={apt.status}
                      variant={
                        apt.status === "Completed"
                          ? "success"
                          : apt.status === "In Doctor" ||
                              apt.status === "Checked-In"
                            ? "teal"
                            : apt.status === "Billing" ||
                                apt.status === "Waiting Nurse"
                              ? "warning"
                              : apt.status === "Cancelled"
                                ? "error"
                                : "info"
                      }
                    />
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs text-slate-600"
                    style={{ fontFamily: RB }}
                  >
                    {apt.receptionist}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                      style={{ fontFamily: PP }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── STAFF PERFORMANCE MODAL DIALOG ── */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Receptionist Performance Details
                </h3>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  {selectedStaff.name} · {selectedStaff.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                  <span
                    className="text-[11px] text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Assigned Counter
                  </span>
                  <div
                    className="text-xs font-bold text-[#111827] mt-0.5"
                    style={{ fontFamily: PP }}
                  >
                    {selectedStaff.counter}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                  <span
                    className="text-[11px] text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    Current Status
                  </span>
                  <div className="mt-0.5">
                    <StatusChip
                      label={selectedStaff.status}
                      variant={
                        selectedStaff.status === "Active"
                          ? "success"
                          : selectedStaff.status === "On Break"
                            ? "warning"
                            : "default"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <span
                    className="text-[10px] text-[#0D47A1]"
                    style={{ fontFamily: RB }}
                  >
                    Appointments
                  </span>
                  <div
                    className="text-lg font-bold text-[#0D47A1]"
                    style={{ fontFamily: PP }}
                  >
                    {selectedStaff.appointmentsBooked}
                  </div>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-center">
                  <span
                    className="text-[10px] text-[#009688]"
                    style={{ fontFamily: RB }}
                  >
                    Registrations
                  </span>
                  <div
                    className="text-lg font-bold text-[#009688]"
                    style={{ fontFamily: PP }}
                  >
                    {selectedStaff.patientsRegistered}
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span
                    className="text-[10px] text-[#66BB6A]"
                    style={{ fontFamily: RB }}
                  >
                    Check-Ins
                  </span>
                  <div
                    className="text-lg font-bold text-emerald-800"
                    style={{ fontFamily: PP }}
                  >
                    {selectedStaff.checkInsCompleted}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  Average Check-In Speed
                </span>
                <span
                  className="font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {selectedStaff.avgCheckInTime} per patient
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all"
                style={{ fontFamily: PP }}
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT DETAILS DIALOG ── */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Appointment Details
                </h3>
                <p
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  {selectedAppointment.id} · Token {selectedAppointment.token}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  Patient Name
                </span>
                <span
                  className="font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {selectedAppointment.patientName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  MRN
                </span>
                <span className="font-mono text-[#0D47A1] font-bold">
                  {selectedAppointment.mrn}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  Assigned Doctor
                </span>
                <span
                  className="font-medium text-[#111827]"
                  style={{ fontFamily: RB }}
                >
                  {selectedAppointment.doctor}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  Department
                </span>
                <span className="text-[#111827]" style={{ fontFamily: RB }}>
                  {selectedAppointment.department}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  Appointment Time
                </span>
                <span
                  className="font-bold text-[#111827]"
                  style={{ fontFamily: RB }}
                >
                  {selectedAppointment.appointmentTime}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  Handled Receptionist
                </span>
                <span className="text-[#111827]" style={{ fontFamily: RB }}>
                  {selectedAppointment.receptionist}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#64748B]" style={{ fontFamily: RB }}>
                  Current Status
                </span>
                <StatusChip
                  label={selectedAppointment.status}
                  variant={
                    selectedAppointment.status === "Completed"
                      ? "success"
                      : selectedAppointment.status === "In Doctor" ||
                          selectedAppointment.status === "Checked-In"
                        ? "teal"
                        : selectedAppointment.status === "Billing"
                          ? "warning"
                          : "info"
                  }
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all"
                style={{ fontFamily: PP }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
