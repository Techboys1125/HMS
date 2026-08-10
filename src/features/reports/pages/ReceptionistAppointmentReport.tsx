import  { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  PieChart,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  AlertCircle,
  Shield,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PP = "Poppins, system-ui, sans-serif";
const RB = "Roboto, system-ui, sans-serif";

function CircularProgress({
  percentage,
  size = 54,
  strokeWidth = 6,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#009688"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span
        className="absolute text-xs font-bold text-[#111827]"
        style={{ fontFamily: RB }}
      >
        {percentage}%
      </span>
    </div>
  );
}
export interface ReceptionistDailyAppointmentRecord {
  appointmentId: string;
  patientName: string;
  mrn: string;
  mobileNumber: string;
  appointmentTime: string;
  visitType: string;
  checkInTime: string;
  queueStatus: string;
  appointmentStatus: string;
}

const RECEPTIONIST_DAILY_APPOINTMENTS_DATA: ReceptionistDailyAppointmentRecord[] =
  [
    {
      appointmentId: "APT-901",
      patientName: "Sarah Mitchell",
      mrn: "MRN-89201",
      mobileNumber: "+1 555-0192",
      appointmentTime: "09:00 AM",
      visitType: "New Patient",
      checkInTime: "08:55 AM",
      queueStatus: "Completed Queue",
      appointmentStatus: "Completed",
    },
    {
      appointmentId: "APT-902",
      patientName: "James Thornton",
      mrn: "MRN-89202",
      mobileNumber: "+1 555-0193",
      appointmentTime: "09:30 AM",
      visitType: "Follow-up",
      checkInTime: "09:20 AM",
      queueStatus: "Completed Queue",
      appointmentStatus: "Completed",
    },
    {
      appointmentId: "APT-903",
      patientName: "Emma Reyes",
      mrn: "MRN-89203",
      mobileNumber: "+1 555-0194",
      appointmentTime: "10:00 AM",
      visitType: "Routine Checkup",
      checkInTime: "09:50 AM",
      queueStatus: "Completed Queue",
      appointmentStatus: "Completed",
    },
    {
      appointmentId: "APT-904",
      patientName: "Aisha Kumar",
      mrn: "MRN-89204",
      mobileNumber: "+1 555-0195",
      appointmentTime: "10:30 AM",
      visitType: "Follow-up",
      checkInTime: "10:15 AM",
      queueStatus: "In Consultation",
      appointmentStatus: "In Progress",
    },
    {
      appointmentId: "APT-905",
      patientName: "Michael Chang",
      mrn: "MRN-89205",
      mobileNumber: "+1 555-0196",
      appointmentTime: "11:00 AM",
      visitType: "New Patient",
      checkInTime: "10:45 AM",
      queueStatus: "Waiting Room",
      appointmentStatus: "Scheduled",
    },
    {
      appointmentId: "APT-906",
      patientName: "David Miller",
      mrn: "MRN-89206",
      mobileNumber: "+1 555-0197",
      appointmentTime: "11:30 AM",
      visitType: "Walk-In",
      checkInTime: "11:10 AM",
      queueStatus: "Cancelled Queue",
      appointmentStatus: "Cancelled",
    },
    {
      appointmentId: "APT-907",
      patientName: "Grace Hopper",
      mrn: "MRN-89207",
      mobileNumber: "+1 555-0198",
      appointmentTime: "12:00 PM",
      visitType: "Routine Checkup",
      checkInTime: "11:45 AM",
      queueStatus: "Waiting Room",
      appointmentStatus: "Scheduled",
    },
  ];

const RECEPTIONIST_APPT_TREND_SERIES = [
  { date: "Jul 20", booked: 75, checkedIn: 62, completed: 58, cancelled: 3 },
  { date: "Jul 21", booked: 80, checkedIn: 68, completed: 60, cancelled: 4 },
  { date: "Jul 22", booked: 78, checkedIn: 65, completed: 59, cancelled: 2 },
  { date: "Jul 23", booked: 84, checkedIn: 70, completed: 62, cancelled: 5 },
  { date: "Jul 24", booked: 82, checkedIn: 69, completed: 61, cancelled: 3 },
  { date: "Jul 25", booked: 85, checkedIn: 71, completed: 63, cancelled: 4 },
  { date: "Jul 26", booked: 86, checkedIn: 72, completed: 64, cancelled: 4 },
];

const RECEPTIONIST_APPT_DONUT = [
  { name: "Booked", value: 86, color: "#0D47A1" },
  { name: "Checked-In", value: 72, color: "#009688" },
  { name: "Waiting", value: 14, color: "#F59E0B" },
  { name: "Completed", value: 64, color: "#66BB6A" },
  { name: "Cancelled", value: 4, color: "#EF4444" },
  { name: "No Show", value: 2, color: "#64748B" },
];

const RECEPTIONIST_CHECKIN_PERFORMANCE_BAR = [
  { shift: "Morning Shift", count: 42 },
  { shift: "Afternoon Shift", count: 26 },
  { shift: "Evening Shift", count: 18 },
];

const RECEPTIONIST_QUEUE_PERFORMANCE_HORIZONTAL = [
  { item: "Waiting Queue", value: 14 },
  { item: "Avg Waiting Time (m)", value: 11.5 },
  { item: "Completed Queue", value: 64 },
  { item: "Longest Waiting (m)", value: 22 },
];

const RECEPTIONIST_APPT_TIMELINE = [
  {
    id: "ACT-201",
    action: "Appointment Booked",
    detail: "APT-901 confirmed for Sarah Mitchell",
    date: "Jul 26",
    time: "08:15 AM",
    status: "Booked",
  },
  {
    id: "ACT-202",
    action: "Patient Registered",
    detail: "Intake details updated for MRN-89201",
    date: "Jul 26",
    time: "08:45 AM",
    status: "Registered",
  },
  {
    id: "ACT-203",
    action: "Patient Checked-In",
    detail: "Sarah Mitchell checked in at reception desk",
    date: "Jul 26",
    time: "08:55 AM",
    status: "Checked-In",
  },
  {
    id: "ACT-204",
    action: "Queue Updated",
    detail: "Patient called to OPD Room 1",
    date: "Jul 26",
    time: "09:05 AM",
    status: "Queue Updated",
  },
  {
    id: "ACT-205",
    action: "Appointment Completed",
    detail: "Consultation completed successfully",
    date: "Jul 26",
    time: "09:30 AM",
    status: "Completed",
  },
  {
    id: "ACT-206",
    action: "Appointment Cancelled",
    detail: "APT-906 cancelled by patient David Miller",
    date: "Jul 26",
    time: "11:10 AM",
    status: "Cancelled",
  },
];

export function ReceptionistDailyAppointmentReportScreen({
  onBack,
  onOpenPatientReport,
}: {
  onBack?: () => void;
  onOpenPatientReport?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [apptStatusFilter, setApptStatusFilter] = useState("All Statuses");
  const [checkInStatusFilter, setCheckInStatusFilter] = useState(
    "All Check-In Statuses",
  );
  const [queueStatusFilter, setQueueStatusFilter] =
    useState("All Queue Statuses");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All Visit Types");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");

  const [trendRange, setTrendRange] = useState<"Today" | "7 Days" | "30 Days">(
    "7 Days",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRange("Today");
    setApptStatusFilter("All Statuses");
    setCheckInStatusFilter("All Check-In Statuses");
    setQueueStatusFilter("All Queue Statuses");
    setVisitTypeFilter("All Visit Types");
    setShiftFilter("All Shifts");
  };

  const filteredAppointments = useMemo(() => {
    return RECEPTIONIST_DAILY_APPOINTMENTS_DATA.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mobileNumber.includes(searchQuery);
      const matchesAppt =
        apptStatusFilter === "All Statuses" ||
        item.appointmentStatus === apptStatusFilter;
      const matchesVisit =
        visitTypeFilter === "All Visit Types" ||
        item.visitType === visitTypeFilter;
      return matchesSearch && matchesAppt && matchesVisit;
    });
  }, [searchQuery, apptStatusFilter, visitTypeFilter]);

  return (
    <div
      className="min-h-screen bg-[#F1F5F9] text-[#111827] pb-12"
      style={{ fontFamily: RB }}
    >
      {/* Top Header Section */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
                <span
                  onClick={onBack}
                  className="hover:text-[#0D47A1] cursor-pointer"
                >
                  Reception
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span
                  onClick={onBack}
                  className="hover:text-[#0D47A1] cursor-pointer"
                >
                  Reports
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0D47A1] font-semibold">
                  Daily Appointment Report
                </span>
              </nav>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Daily Appointment Report
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D47A1]/10 text-[#0D47A1] border border-blue-200">
                  Reception Scoped
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monitor appointment bookings, check-ins, waiting queue and daily
                reception operations.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 border border-[#E5E7EB] px-3 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-[#0D47A1]" />
                <span>
                  Last Updated:{" "}
                  <strong className="text-[#111827]">Today, 11:45 AM</strong>
                </span>
              </div>

              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-slate-50 transition shadow-sm"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#0D47A1] ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>

              <button
                onClick={() =>
                  alert("Exporting Daily Appointment Report (PDF)...")
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#0D47A1] hover:bg-blue-900 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-slate-50 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#0D47A1]" />
                <span>Print Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Appointment ID, Patient Name, MRN, Mobile Number..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#111827]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Reception Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex items-center gap-2 text-xs font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              <Filter className="w-4 h-4 text-[#009688]" />
              <span>Filter Daily Appointment Data</span>
            </div>
            <span className="text-[11px] text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">
              Reception Role Scoped
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>Today</option>
                <option>Yesterday</option>
                <option>Last 7 Days</option>
                <option>This Month</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Appointment Status
              </label>
              <select
                value={apptStatusFilter}
                onChange={(e) => setApptStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Statuses</option>
                <option>Booked</option>
                <option>Checked-In</option>
                <option>Waiting</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Check-In Status
              </label>
              <select
                value={checkInStatusFilter}
                onChange={(e) => setCheckInStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Check-In Statuses</option>
                <option>Checked-In</option>
                <option>Pending Check-In</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Queue Status
              </label>
              <select
                value={queueStatusFilter}
                onChange={(e) => setQueueStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Queue Statuses</option>
                <option>Waiting Room</option>
                <option>In Consultation</option>
                <option>Completed Queue</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Visit Type
              </label>
              <select
                value={visitTypeFilter}
                onChange={(e) => setVisitTypeFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Visit Types</option>
                <option>New Patient</option>
                <option>Follow-up</option>
                <option>Routine Checkup</option>
                <option>Walk-In</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Shift
              </label>
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Shifts</option>
                <option>Morning Shift</option>
                <option>Afternoon Shift</option>
                <option>Evening Shift</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#E5E7EB]">
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#111827] hover:bg-slate-100 transition"
            >
              Reset Filters
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-white bg-[#009688] hover:bg-teal-700 transition shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Demo State Controls */}
        <div className="flex items-center justify-between mb-4 bg-white p-2.5 rounded-xl border border-[#E5E7EB] text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#111827]">
              Demo State Toggles:
            </span>
            <button
              onClick={() => {
                setIsLoading(!isLoading);
                setHasError(false);
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs ${isLoading ? "bg-amber-50 border-amber-300 text-[#F59E0B]" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
            >
              Toggle Loading Skeleton
            </button>
            <button
              onClick={() => {
                setHasError(!hasError);
                setIsLoading(false);
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs ${hasError ? "bg-red-50 border-red-[#EF4444] text-[#EF4444]" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
            >
              Toggle Error State
            </button>
          </div>
          <span className="text-[11px] text-[#64748B]">
            Simulate appointment report state
          </span>
        </div>

        {/* ERROR STATE */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-center">
            <AlertCircle className="w-10 h-10 text-[#EF4444] mx-auto mb-2" />
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Unable to Load Appointment Report
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Connection error while loading appointment report data. Please
              retry.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="mt-4 px-4 py-2 bg-[#EF4444] text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING SKELETON STATE */}
        {isLoading && (
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 h-32 animate-pulse"
                ></div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 h-64 animate-pulse"></div>
          </div>
        )}

        {!isLoading && !hasError && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT MAIN CONTENT AREA (3 Cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* TOP 6 RECEPTIONIST KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Today's Appointments */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Today's Appointments
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0D47A1]">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    86
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#66BB6A] font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +8.2%
                    </span>
                    <span>vs yesterday</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#0D47A1] font-bold">86</div>
                      <div className="text-[#64748B]">Booked</div>
                    </div>
                    <div>
                      <div className="text-[#009688] font-bold">86</div>
                      <div className="text-[#64748B]">Total Today</div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Checked-In Patients */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Checked-In Patients
                    </span>
                    <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    72
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#009688] font-semibold">
                      83.7% Completion Rate
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#009688] font-bold">72</div>
                      <div className="text-[#64748B]">Checked-In</div>
                    </div>
                    <div>
                      <div className="text-[#0D47A1] font-bold">83.7%</div>
                      <div className="text-[#64748B]">Rate</div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Patients Waiting */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Patients Waiting
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    14
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#F59E0B] font-semibold">
                      Current Reception Queue
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#F59E0B] font-bold">14</div>
                      <div className="text-[#64748B]">Waiting</div>
                    </div>
                    <div>
                      <div className="text-[#0D47A1] font-bold">3.2</div>
                      <div className="text-[#64748B]">Avg Queue Size</div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Completed Appointments */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Completed Appointments
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#66BB6A]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    64
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#66BB6A] font-semibold">
                      74.4% Completion %
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#66BB6A] font-bold">64</div>
                      <div className="text-[#64748B]">Done</div>
                    </div>
                    <div>
                      <div className="text-[#0D47A1] font-bold">74.4%</div>
                      <div className="text-[#64748B]">Completion</div>
                    </div>
                  </div>
                </div>

                {/* Card 5: Cancelled / No Show */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Cancelled / No Show
                    </span>
                    <div className="p-2 rounded-xl bg-red-50 text-[#EF4444]">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    6
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#EF4444] font-semibold">
                      6 Total Disruption
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#EF4444] font-bold">4</div>
                      <div className="text-[#64748B]">Cancelled</div>
                    </div>
                    <div>
                      <div className="text-[#64748B] font-bold">2</div>
                      <div className="text-[#64748B]">No Show</div>
                    </div>
                  </div>
                </div>

                {/* Card 6: Average Waiting Time */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#64748B]">
                      Average Waiting Time
                    </span>
                    <div
                      className="text-2xl font-bold text-[#111827] mt-1"
                      style={{ fontFamily: PP }}
                    >
                      11.5 min
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Longest Today: 22.0m
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-[#66BB6A]">
                      âœ“ Target Met
                    </div>
                  </div>
                  <CircularProgress percentage={89} size={64} strokeWidth={7} />
                </div>
              </div>

              {/* APPOINTMENT TREND & STATUS DISTRIBUTION CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appointment Trend Area Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Appointment Trend
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Booked vs checked-in vs completed vs cancelled
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] text-[10px]">
                      {(["Today", "7 Days", "30 Days"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setTrendRange(r)}
                          className={`px-2 py-0.5 rounded-lg font-medium transition ${trendRange === r ? "bg-[#0D47A1] text-white shadow-sm" : "text-[#64748B]"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={RECEPTIONIST_APPT_TREND_SERIES}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="recApptBookedGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#0D47A1"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#0D47A1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="recApptDoneGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#66BB6A"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#66BB6A"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10, fill: "#64748B" }}
                        />
                        <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            borderColor: "#E5E7EB",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="booked"
                          name="Booked"
                          stroke="#0D47A1"
                          fillOpacity={1}
                          fill="url(#recApptBookedGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          name="Completed"
                          stroke="#66BB6A"
                          fillOpacity={1}
                          fill="url(#recApptDoneGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Appointment Status Distribution Donut Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Appointment Status Distribution
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Breakdown of appointment status counts
                      </p>
                    </div>
                    <PieChart className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={RECEPTIONIST_APPT_DONUT}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {RECEPTIONIST_APPT_DONUT.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            borderColor: "#E5E7EB",
                            fontSize: "11px",
                          }}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            fontSize: "10px",
                            paddingTop: "10px",
                          }}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* CHECK-IN PERFORMANCE & QUEUE PERFORMANCE CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Check-In Performance Vertical Bar Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Check-In Performance
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Patients checked in per working shift
                      </p>
                    </div>
                    <UserCheck className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={RECEPTIONIST_CHECKIN_PERFORMANCE_BAR}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="shift"
                          tick={{ fontSize: 10, fill: "#64748B" }}
                        />
                        <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            borderColor: "#E5E7EB",
                            fontSize: "11px",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          name="Checked-In Patients"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Queue Performance Horizontal Bar Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Queue Performance
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Queue volume vs waiting duration metrics
                      </p>
                    </div>
                    <Activity className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={RECEPTIONIST_QUEUE_PERFORMANCE_HORIZONTAL}
                        margin={{ top: 5, right: 10, left: 45, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#64748B" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="item"
                          tick={{ fontSize: 9, fill: "#111827" }}
                          width={135}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            borderColor: "#E5E7EB",
                            fontSize: "11px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name="Metric Value"
                          fill="#009688"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* DAILY APPOINTMENT REPORT ENTERPRISE DATA TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Daily Appointment Register
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Detailed appointment list and reception check-in status
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      alert("Exporting Appointment Register (CSV)...")
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] text-xs font-semibold text-[#111827] rounded-xl hover:bg-slate-100 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0D47A1]" />
                    <span>Export Register</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F1F5F9] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E5E7EB]">
                        <th className="py-3.5 px-4">Appointment ID</th>
                        <th className="py-3.5 px-4">Patient Name</th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Mobile</th>
                        <th className="py-3.5 px-4">Appt Time</th>
                        <th className="py-3.5 px-4">Visit Type</th>
                        <th className="py-3.5 px-4">Check-In Time</th>
                        <th className="py-3.5 px-4">Queue Status</th>
                        <th className="py-3.5 px-4 text-center">Appt Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={10}
                            className="py-8 text-center text-[#64748B]"
                          >
                            No appointments match your search or filter
                            criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((item) => (
                          <tr
                            key={item.appointmentId}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                              {item.appointmentId}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-[#111827]">
                              {item.patientName}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#0D47A1]">
                              {item.mrn}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.mobileNumber}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#111827]">
                              {item.appointmentTime}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-[#111827]">
                              {item.visitType}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.checkInTime}
                            </td>
                            <td className="py-3.5 px-4 text-[#009688] font-medium">
                              {item.queueStatus}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${item.appointmentStatus === "Completed" ? "bg-teal-50 text-[#009688] border border-teal-200" : item.appointmentStatus === "In Progress" ? "bg-amber-50 text-[#F59E0B] border border-amber-200" : item.appointmentStatus === "Cancelled" ? "bg-red-50 text-[#EF4444] border border-red-200" : "bg-slate-100 text-[#64748B]"}`}
                              >
                                {item.appointmentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() =>
                                    alert(
                                      `Viewing appointment ${item.appointmentId}`,
                                    )
                                  }
                                  className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                  title="View Appointment"
                                >
                                  <Calendar className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    alert(`Viewing patient ${item.patientName}`)
                                  }
                                  className="p-1.5 text-[#009688] hover:bg-teal-50 rounded-lg transition"
                                  title="View Patient"
                                >
                                  <Users className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    alert(
                                      `Printing summary for ${item.appointmentId}`,
                                    )
                                  }
                                  className="p-1.5 text-[#64748B] hover:bg-slate-100 rounded-lg transition"
                                  title="Print Summary"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                <div className="p-4 bg-[#F1F5F9] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
                  <span>
                    Showing 1 to {filteredAppointments.length} of{" "}
                    {filteredAppointments.length} entries
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      className="p-1 rounded-lg border border-[#E5E7EB] opacity-50 cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-[#111827]">
                      Page 1 of 1
                    </span>
                    <button
                      disabled
                      className="p-1 rounded-lg border border-[#E5E7EB] opacity-50 cursor-not-allowed"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RECEPTION ACTIVITY TIMELINE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3
                  className="text-base font-bold text-[#111827] mb-4"
                  style={{ fontFamily: PP }}
                >
                  Reception Activity Timeline
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7EB]">
                  {RECEPTIONIST_APPT_TIMELINE.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-4 relative z-10"
                    >
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0D47A1] flex items-center justify-center text-[#0D47A1] shrink-0">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-[#F1F5F9] rounded-xl p-3 border border-[#E5E7EB] flex-1 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#111827]">
                            {act.action}
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            {act.date} â€¢ {act.time}
                          </span>
                        </div>
                        <p className="text-[#64748B]">{act.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT STICKY SUMMARY PANEL (1 Col) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm sticky top-20 space-y-6">
                {/* Header */}
                <div>
                  <h3
                    className="text-base font-bold text-[#111827] flex items-center gap-2"
                    style={{ fontFamily: PP }}
                  >
                    <Shield className="w-4 h-4 text-[#0D47A1]" />
                    <span>Appointment Summary</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Daily reception appointment metrics
                  </p>
                </div>

                {/* Metrics Overview */}
                <div className="bg-[#F1F5F9] rounded-xl p-3 border border-[#E5E7EB] text-xs space-y-2">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">
                    Today's Appointment Counters
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Booked Today:</span>
                    <span className="font-bold text-[#0D47A1]">86 Booked</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Checked-In:</span>
                    <span className="font-bold text-[#009688]">
                      72 Checked In
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Waiting Queue:</span>
                    <span className="font-bold text-[#F59E0B]">14 Waiting</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Completed:</span>
                    <span className="font-bold text-[#66BB6A]">
                      64 Completed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Cancelled / No Show:</span>
                    <span className="font-bold text-[#EF4444]">
                      6 Disrupted
                    </span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-2 flex justify-between">
                    <span className="text-[#64748B]">Avg Waiting Time:</span>
                    <span className="font-semibold text-[#0D47A1]">
                      11.5 min
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4
                    className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2"
                    style={{ fontFamily: PP }}
                  >
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => alert("Exporting PDF...")}
                      className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-semibold text-[#0D47A1]"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-3.5 h-3.5 text-[#0D47A1]" />
                        <span>Export PDF Report</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#111827]"
                    >
                      <div className="flex items-center gap-2">
                        <Printer className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Print Report</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>

                    {onOpenPatientReport && (
                      <button
                        onClick={onOpenPatientReport}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#009688]"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#009688]" />
                          <span>Open Patient Report</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                    )}

                    {onBack && (
                      <button
                        onClick={onBack}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#64748B]"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>Back to Reports Dashboard</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Compliance Note */}
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E5E7EB] text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-1 text-[#009688] font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Receptionist Scope Verified</span>
                  </div>
                  <span>
                    Read-only appointment operations data for reception check-in
                    management.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <div>
            Showing{" "}
            <strong className="text-[#111827]">
              {filteredAppointments.length} Daily Appointment Report Results
            </strong>
          </div>
          <div>
            Hospital Management System â€¢ Receptionist Daily Appointment Report
            v1.0
          </div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">2026-07-26 13:36</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
