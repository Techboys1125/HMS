import { useState, useMemo } from "react";
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  RotateCcw,
  Download,
  Eye,
  Printer,
  Activity,
  ArrowUpRight,
  X,
  ChevronRight,
} from "lucide-react";

// --- Design System Tokens ---
const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

// --- Types ---
export type ConsultationStatus =
  | "Waiting"
  | "In Progress"
  | "Completed"
  | "Follow-up Scheduled"
  | "Cancelled";
export type VisitType = "First Visit" | "Follow-up" | "Walk-In";

export interface AdminConsultationRecord {
  id: string;
  tokenNo: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  doctor: string;
  department: string;
  appointmentTime: string;
  visitType: VisitType;
  status: ConsultationStatus;
  duration: string;
  chiefComplaint: string;
  opdRoom: string;
  date: string;
}

// Initial Mock Dataset for Operational Monitoring
const ADMIN_CONSULTATIONS: AdminConsultationRecord[] = [
  {
    id: "CNS-1001",
    tokenNo: "TK-01",
    patientName: "Sarah Mitchell",
    mrn: "MRN-2024-001",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:00 AM",
    visitType: "First Visit",
    status: "In Progress",
    duration: "18 mins (Active)",
    chiefComplaint: "Chest tightness radiating to left shoulder",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1002",
    tokenNo: "TK-02",
    patientName: "James Thornton",
    mrn: "MRN-2024-002",
    age: 67,
    gender: "Male",
    phone: "+1 (555) 345-6789",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "09:30 AM",
    visitType: "Follow-up",
    status: "Waiting",
    duration: "12 mins wait",
    chiefComplaint: "Post-angioplasty routine checkup",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1003",
    tokenNo: "TK-03",
    patientName: "Emma Reyes",
    mrn: "MRN-2024-003",
    age: 28,
    gender: "Female",
    phone: "+1 (555) 456-7890",
    doctor: "Dr. Priya Sharma",
    department: "General Medicine",
    appointmentTime: "10:00 AM",
    visitType: "Walk-In",
    status: "Waiting",
    duration: "5 mins wait",
    chiefComplaint: "Acute palpitation episodes",
    opdRoom: "OPD Room 202",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1004",
    tokenNo: "TK-04",
    patientName: "Robert Chen",
    mrn: "MRN-2024-004",
    age: 52,
    gender: "Male",
    phone: "+1 (555) 567-8901",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "08:30 AM",
    visitType: "Follow-up",
    status: "Completed",
    duration: "14 mins",
    chiefComplaint: "Hypertension evaluation",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1005",
    tokenNo: "TK-05",
    patientName: "Aisha Kumar",
    mrn: "MRN-2024-005",
    age: 41,
    gender: "Female",
    phone: "+1 (555) 678-9012",
    doctor: "Dr. Rajesh Kapoor",
    department: "Neurology",
    appointmentTime: "10:30 AM",
    visitType: "First Visit",
    status: "Waiting",
    duration: "Scheduled",
    chiefComplaint: "Migraine headaches",
    opdRoom: "OPD Room 305",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1006",
    tokenNo: "TK-06",
    patientName: "David Walsh",
    mrn: "MRN-2024-006",
    age: 38,
    gender: "Male",
    phone: "+1 (555) 789-0123",
    doctor: "Dr. Priya Sharma",
    department: "General Medicine",
    appointmentTime: "11:00 AM",
    visitType: "Follow-up",
    status: "Follow-up Scheduled",
    duration: "12 mins",
    chiefComplaint: "Lower back stiffness",
    opdRoom: "OPD Room 202",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1007",
    tokenNo: "TK-07",
    patientName: "Nina Patel",
    mrn: "MRN-2024-007",
    age: 29,
    gender: "Female",
    phone: "+1 (555) 890-1234",
    doctor: "Dr. Rajesh Kapoor",
    department: "Neurology",
    appointmentTime: "11:30 AM",
    visitType: "First Visit",
    status: "Cancelled",
    duration: "N/A",
    chiefComplaint: "Patient requested reschedule",
    opdRoom: "OPD Room 305",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "CNS-1008",
    tokenNo: "TK-08",
    patientName: "Carlos Mendez",
    mrn: "MRN-2024-008",
    age: 63,
    gender: "Male",
    phone: "+1 (555) 901-2345",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology",
    appointmentTime: "08:00 AM",
    visitType: "Follow-up",
    status: "Completed",
    duration: "16 mins",
    chiefComplaint: "Aortic valve surveillance",
    opdRoom: "OPD Room 104",
    date: new Date().toISOString().split("T")[0],
  },
];

const STATUS_CONFIG: Record<
  ConsultationStatus,
  { bg: string; text: string; dot: string; border: string }
> = {
  Waiting: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
  },
  "In Progress": {
    bg: "bg-teal-50",
    text: "text-[#009688]",
    dot: "bg-[#009688]",
    border: "border-teal-200",
  },
  Completed: {
    bg: "bg-green-50",
    text: "text-[#66BB6A]",
    dot: "bg-[#66BB6A]",
    border: "border-green-200",
  },
  "Follow-up Scheduled": {
    bg: "bg-blue-50",
    text: "text-[#0D47A1]",
    dot: "bg-[#0D47A1]",
    border: "border-blue-200",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
    border: "border-red-200",
  },
};

function StatusChip({ status }: { status: ConsultationStatus }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG["Waiting"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
      style={{ fontFamily: PP }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === "In Progress" ? "animate-pulse" : ""}`}
      />
      {status}
    </span>
  );
}

function Avatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ fontFamily: PP }}
    >
      {initials}
    </div>
  );
}

export function OpdConsultationMonitoringCenterScreen({
  onViewDetails,
  onViewHistory,
  onPatientSelect,
}: {
  onViewDetails?: (consultationId: string) => void;
  onViewHistory?: (patientId?: string) => void;
  onPatientSelect?: (patientId: string) => void;
  onNavigateReports?: () => void;
}) {
  // --- States ---
  const [consultations] =
    useState<AdminConsultationRecord[]>(ADMIN_CONSULTATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVisitType, setFilterVisitType] = useState("All");

  // Modals / Dropdowns
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // --- Filtering Logic ---
  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      if (activeTab !== "All" && item.status !== activeTab) return false;
      if (filterStatus !== "All" && item.status !== filterStatus) return false;
      if (filterVisitType !== "All" && item.visitType !== filterVisitType)
        return false;
      if (filterDepartment !== "All" && item.department !== filterDepartment)
        return false;
      if (filterDoctor !== "All" && item.doctor !== filterDoctor) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.patientName.toLowerCase().includes(q);
        const matchMrn = item.mrn.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchDoc = item.doctor.toLowerCase().includes(q);
        if (!matchName && !matchMrn && !matchId && !matchDoc) return false;
      }

      return true;
    });
  }, [
    consultations,
    activeTab,
    filterStatus,
    filterVisitType,
    filterDepartment,
    filterDoctor,
    searchQuery,
  ]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDate(new Date().toISOString().split("T")[0]);
    setFilterDoctor("All");
    setFilterDepartment("All");
    setFilterStatus("All");
    setFilterVisitType("All");
    setActiveTab("All");
  };

  // Refresh Simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: consultations.length,
      Waiting: consultations.filter((c) => c.status === "Waiting").length,
      "In Progress": consultations.filter((c) => c.status === "In Progress")
        .length,
      Completed: consultations.filter((c) => c.status === "Completed").length,
      "Follow-up Scheduled": consultations.filter(
        (c) => c.status === "Follow-up Scheduled",
      ).length,
      Cancelled: consultations.filter((c) => c.status === "Cancelled").length,
    };
  }, [consultations]);

  // Doctor Workload Statistics

  // Department Summary Statistics

  return (
    <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex flex-col font-sans">
      {/* ── BREADCRUMB & HEADER SECTION ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div
              className="flex items-center gap-2 text-xs text-[#64748B] mb-1"
              style={{ fontFamily: RB }}
            >
              <span>Hospital Admin</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-[#0D47A1]">
                OPD Consultation Management
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              OPD Consultation Monitoring
            </h1>
            <p
              className="text-sm text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Monitor outpatient consultation workflow and doctor activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSummaryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-sm font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Clock size={16} className="text-[#0D47A1]" />
              Today's Summary
            </button>
            <button
              onClick={() =>
                alert("Exporting OPD Operational Report (PDF/Excel)")
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#0a3880] text-white text-sm font-semibold transition-all shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* ── SUMMARY KPI CARDS (5 CARDS) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 01: Today's Consultations */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Today's Consultations
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
                <Stethoscope size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {consultations.length}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <ArrowUpRight size={12} />
                <span>+15% vs yesterday</span>
              </div>
            </div>
          </div>

          {/* Card 02: Patients Waiting */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Patients Waiting
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {tabCounts.Waiting}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-amber-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <Activity size={12} />
                <span>Avg wait: 14 mins</span>
              </div>
            </div>
          </div>

          {/* Card 03: Consultations In Progress */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                In Progress
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center">
                <Activity size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {tabCounts["In Progress"]}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-[#009688] mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
                <span>1 Active Session</span>
              </div>
            </div>
          </div>

          {/* Card 04: Completed Consultations */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Completed
              </span>
              <div className="w-9 h-9 rounded-xl bg-green-50 text-[#66BB6A] flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                {tabCounts.Completed}
              </div>
              <div
                className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                <ArrowUpRight size={12} />
                <span>94% completion rate</span>
              </div>
            </div>
          </div>

          {/* Card 05: Average Consultation Duration */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Avg Duration
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div
                className="text-2xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                14 mins
              </div>
              <div
                className="text-[11px] text-purple-600 mt-1 font-medium"
                style={{ fontFamily: RB }}
              >
                Target: &lt; 15 mins
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN LAYOUT: 3-COLUMN ENTERPRISE GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT & CENTER CONTENT (Columns 1-8 or 1-9) */}
          <div className="lg:col-span-12 space-y-6">
            {/* SEARCH AND FILTER BAR */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Patient Name, MRN, Consultation ID or Doctor Name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]"
                  style={{ fontFamily: RB }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label
                    className="block text-[11px] font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Date Range
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  />
                </div>

                <div>
                  <label
                    className="block text-[11px] font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Doctor
                  </label>
                  <select
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Doctors</option>
                    <option value="Dr. Arjun Mehta">Dr. Arjun Mehta</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                    <option value="Dr. Rajesh Kapoor">Dr. Rajesh Kapoor</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-[11px] font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Department
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Departments</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-[11px] font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Waiting">Waiting</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Follow-up Scheduled">
                      Follow-up Scheduled
                    </option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-[11px] font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Visit Type
                  </label>
                  <select
                    value={filterVisitType}
                    onChange={(e) => setFilterVisitType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] rounded-lg text-xs text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    <option value="All">All Visit Types</option>
                    <option value="First Visit">First Visit</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Walk-In">Walk-In</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Showing{" "}
                  <span className="font-semibold text-[#111827]">
                    {filteredConsultations.length}
                  </span>{" "}
                  consultations
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <RotateCcw size={13} />
                    Reset Filters
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#009688] text-xs font-semibold text-white hover:bg-[#00827a] transition-colors"
                    style={{ fontFamily: PP }}
                  >
                    <Filter size={13} />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* CONSULTATION STATUS TABS */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] overflow-x-auto pb-1">
              {[
                { id: "All", label: "All", count: tabCounts.All },
                { id: "Waiting", label: "Waiting", count: tabCounts.Waiting },
                {
                  id: "In Progress",
                  label: "In Progress",
                  count: tabCounts["In Progress"],
                },
                {
                  id: "Completed",
                  label: "Completed",
                  count: tabCounts.Completed,
                },
                {
                  id: "Follow-up Scheduled",
                  label: "Follow-up Scheduled",
                  count: tabCounts["Follow-up Scheduled"],
                },
                {
                  id: "Cancelled",
                  label: "Cancelled",
                  count: tabCounts.Cancelled,
                },
              ].map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all shrink-0 ${
                      isActive
                        ? "border-[#0D47A1] text-[#0D47A1] bg-white shadow-sm"
                        : "border-transparent text-[#64748B] hover:text-[#111827] hover:bg-white/50"
                    }`}
                    style={{ fontFamily: PP }}
                  >
                    <span>{t.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-blue-100 text-[#0D47A1]"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ENTERPRISE DATA TABLE */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="h-12 bg-slate-50 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ) : filteredConsultations.length === 0 ? (
                <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <Stethoscope size={32} />
                  </div>
                  <h3
                    className="text-base font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    No consultation records available.
                  </h3>
                  <p
                    className="text-xs text-[#64748B] max-w-sm mt-1 mb-4"
                    style={{ fontFamily: RB }}
                  >
                    There are no matching consultation records for the selected
                    operational filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                    style={{ fontFamily: PP }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr
                          className="bg-slate-50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
                          style={{ fontFamily: PP }}
                        >
                          <th className="py-3.5 px-4">Consultation ID</th>
                          <th className="py-3.5 px-4">Patient</th>
                          <th className="py-3.5 px-4">MRN</th>
                          <th className="py-3.5 px-4">Doctor</th>
                          <th className="py-3.5 px-4">Department</th>
                          <th className="py-3.5 px-4">Appt Time</th>
                          <th className="py-3.5 px-4">Visit Type</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y divide-[#E5E7EB] text-xs"
                        style={{ fontFamily: RB }}
                      >
                        {filteredConsultations.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                              <div className="flex items-center gap-1.5">
                                <span>{item.id}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">
                                  {item.tokenNo}
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={item.patientName} size="sm" />
                                <div>
                                  <div
                                    className="font-bold text-[#111827]"
                                    style={{ fontFamily: PP }}
                                  >
                                    {item.patientName}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {item.phone}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              {item.mrn}
                            </td>

                            <td className="py-3.5 px-4 font-semibold text-[#111827]">
                              {item.doctor}
                            </td>

                            <td className="py-3.5 px-4 text-slate-600">
                              {item.department}
                            </td>

                            <td className="py-3.5 px-4 font-medium text-slate-800">
                              {item.appointmentTime}
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-50 text-[#0D47A1]"
                                style={{ fontFamily: PP }}
                              >
                                {item.visitType}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <StatusChip status={item.status} />
                            </td>


                            <td className="py-3.5 px-4 text-right relative">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onViewDetails?.(item.id)}
                                  className="px-2.5 py-1.5 bg-[#0D47A1] hover:bg-[#0a3880] text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                                  style={{ fontFamily: PP }}
                                  title="View Consultation Details"
                                >
                                  <Eye size={14} />
                                  View Details
                                </button>

                                <button
                                  onClick={() => onViewHistory?.(item.mrn)}
                                  className="p-1.5 hover:bg-[#0D47A1]/10 text-[#0D47A1] rounded-lg transition-colors"
                                  title="View Consultation History"
                                >
                                  <RotateCcw size={15} />
                                </button>

                                <button
                                  onClick={() => onPatientSelect?.(item.mrn)}
                                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  title="View Patient Profile"
                                >
                                  <Users size={15} />
                                </button>

                                <button
                                  onClick={() =>
                                    alert(
                                      `Printed Operational Summary for ${item.id}`,
                                    )
                                  }
                                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                                  title="Print Consultation Summary"
                                >
                                  <Printer size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION BAR */}
                  <div
                    className="px-6 py-4 bg-slate-50 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    <div>
                      Showing{" "}
                      <span className="font-semibold text-[#111827]">1</span> to{" "}
                      <span className="font-semibold text-[#111827]">
                        {filteredConsultations.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#111827]">
                        {consultations.length}
                      </span>{" "}
                      consultations
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-slate-400 cursor-not-allowed text-xs font-medium">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-[#0D47A1] text-white rounded-lg text-xs font-semibold">
                        1
                      </button>
                      <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-slate-400 cursor-not-allowed text-xs font-medium">
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT CONTEXT PANEL: OPERATIONAL DASHBOARD */}
        </div>
      </div>

      {/* ── TODAY'S SUMMARY MODAL ── */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Today's Operational Summary
              </h3>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
              <div className="p-3 bg-blue-50 rounded-xl space-y-1">
                <div
                  className="text-[10px] text-blue-600 font-bold uppercase"
                  style={{ fontFamily: PP }}
                >
                  Total OPD Consultations
                </div>
                <div
                  className="text-xl font-bold text-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  8 Consultations Today
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Completed
                  </div>
                  <div className="font-bold text-base text-green-700">2</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Waiting Patients
                  </div>
                  <div className="font-bold text-base text-amber-700">3</div>
                </div>
              </div>

              <div className="pt-2 text-slate-500 italic text-[11px]">
                Hospital Administrator operational view — live monitoring data
                refreshed continuously.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
