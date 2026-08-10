import { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Clock,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Users,
  UserCheck,
  TrendingUp,
  Building2,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Activity,
  FileSpreadsheet,
  Eye,
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
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PP, RB } from "../constants/reports.constants";
import type { DoctorReportRecord } from "../types/reports.types";
import { useDoctorPerformance, useHospitalDoctorPerformance } from "../hooks/useReports";
const DOCTOR_REPORT_TABLE_DATA: DoctorReportRecord[] = [
  {
    doctorId: "DOC-101",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    appointments: 142,
    completed: 134,
    pending: 4,
    cancelled: 4,
    followup: 24,
    avgTimeMinutes: 14.5,
    patientRating: 4.9,
  },
  {
    doctorId: "DOC-102",
    doctorName: "Dr. Rajesh Kapoor",
    department: "Neurology",
    appointments: 118,
    completed: 110,
    pending: 5,
    cancelled: 3,
    followup: 18,
    avgTimeMinutes: 16.2,
    patientRating: 4.8,
  },
  {
    doctorId: "DOC-103",
    doctorName: "Dr. Priya Sharma",
    department: "General Medicine",
    appointments: 195,
    completed: 188,
    pending: 4,
    cancelled: 3,
    followup: 32,
    avgTimeMinutes: 12.0,
    patientRating: 4.7,
  },
  {
    doctorId: "DOC-104",
    doctorName: "Dr. Arjun Mehta",
    department: "Orthopedics",
    appointments: 130,
    completed: 121,
    pending: 6,
    cancelled: 3,
    followup: 21,
    avgTimeMinutes: 15.0,
    patientRating: 4.9,
  },
  {
    doctorId: "DOC-105",
    doctorName: "Dr. Sunita Patel",
    department: "Pediatrics",
    appointments: 156,
    completed: 149,
    pending: 4,
    cancelled: 3,
    followup: 28,
    avgTimeMinutes: 13.8,
    patientRating: 4.8,
  },
];

const DOCTOR_CONSULTATION_TREND_DATA = [
  {
    date: "Jul 20",
    Completed: 160,
    Pending: 15,
    Cancelled: 6,
    Followup: 32,
    CompletionRate: 90.4,
  },
  {
    date: "Jul 21",
    Completed: 172,
    Pending: 12,
    Cancelled: 5,
    Followup: 35,
    CompletionRate: 92.5,
  },
  {
    date: "Jul 22",
    Completed: 168,
    Pending: 18,
    Cancelled: 7,
    Followup: 30,
    CompletionRate: 88.8,
  },
  {
    date: "Jul 23",
    Completed: 180,
    Pending: 14,
    Cancelled: 4,
    Followup: 38,
    CompletionRate: 92.8,
  },
  {
    date: "Jul 24",
    Completed: 175,
    Pending: 16,
    Cancelled: 8,
    Followup: 36,
    CompletionRate: 89.7,
  },
  {
    date: "Jul 25",
    Completed: 182,
    Pending: 13,
    Cancelled: 5,
    Followup: 40,
    CompletionRate: 91.9,
  },
  {
    date: "Jul 26",
    Completed: 184,
    Pending: 18,
    Cancelled: 8,
    Followup: 42,
    CompletionRate: 90.6,
  },
];

const DOCTOR_WORKLOAD_DATA = [
  { doctor: "Dr. S. Jenkins", appointments: 142, completed: 134, pending: 4 },
  { doctor: "Dr. R. Kapoor", appointments: 118, completed: 110, pending: 5 },
  { doctor: "Dr. P. Sharma", appointments: 195, completed: 188, pending: 4 },
  { doctor: "Dr. A. Mehta", appointments: 130, completed: 121, pending: 6 },
  { doctor: "Dr. S. Patel", appointments: 156, completed: 149, pending: 4 },
];

const CONSULTATION_STATUS_DIST_DATA = [
  { name: "Completed", value: 184, percentage: 73.6, color: "#009688" },
  { name: "Follow-up", value: 42, percentage: 16.8, color: "#66BB6A" },
  { name: "Pending", value: 16, percentage: 6.4, color: "#F59E0B" },
  { name: "Cancelled", value: 8, percentage: 3.2, color: "#EF4444" },
];

const DEPT_PERFORMANCE_DATA = [
  {
    department: "Gen. Medicine",
    doctors: 6,
    consultations: 210,
    completionRate: 94.2,
  },
  {
    department: "Cardiology",
    doctors: 4,
    consultations: 145,
    completionRate: 92.8,
  },
  {
    department: "Orthopedics",
    doctors: 4,
    consultations: 135,
    completionRate: 90.5,
  },
  { department: "ENT", doctors: 3, consultations: 98, completionRate: 95.0 },
  {
    department: "Neurology",
    doctors: 3,
    consultations: 120,
    completionRate: 91.6,
  },
  {
    department: "Pediatrics",
    doctors: 4,
    consultations: 160,
    completionRate: 93.4,
  },
];

const AVG_CONSULTATION_TIME_DATA = [
  { date: "Jul 20", minutes: 15.2 },
  { date: "Jul 21", minutes: 14.8 },
  { date: "Jul 22", minutes: 15.6 },
  { date: "Jul 23", minutes: 14.0 },
  { date: "Jul 24", minutes: 14.5 },
  { date: "Jul 25", minutes: 13.9 },
  { date: "Jul 26", minutes: 14.2 },
];

const RECENT_DOCTOR_ACTIVITIES = [
  {
    id: "ACT-201",
    type: "Consultation Completed",
    doctor: "Dr. Sarah Jenkins",
    patient: "Sarah Mitchell",
    department: "Cardiology",
    time: "10:30 AM",
  },
  {
    id: "ACT-202",
    type: "Patient Follow-up Scheduled",
    doctor: "Dr. Rajesh Kapoor",
    patient: "James Thornton",
    department: "Neurology",
    time: "10:15 AM",
  },
  {
    id: "ACT-203",
    type: "Prescription Issued",
    doctor: "Dr. Priya Sharma",
    patient: "Emma Reyes",
    department: "General Medicine",
    time: "09:55 AM",
  },
  {
    id: "ACT-204",
    type: "Appointment Cancelled",
    doctor: "Dr. Arjun Mehta",
    patient: "David Walsh",
    department: "Orthopedics",
    time: "09:20 AM",
  },
  {
    id: "ACT-205",
    type: "Consultation Started",
    doctor: "Dr. Sunita Patel",
    patient: "Aisha Kumar",
    department: "Pediatrics",
    time: "09:00 AM",
  },
];

export function DoctorReportScreen({
  onBack,
  onOpenAppointmentReport,
  onOpenPatientReport,
}: {
  onBack?: () => void;
  onOpenAppointmentReport?: () => void;
  onOpenPatientReport?: () => void;
}) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [aptTypeFilter, setAptTypeFilter] = useState("All Types");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [trendDays, setTrendDays] = useState<"7 Days" | "30 Days" | "90 Days">(
    "7 Days",
  );

  // ─── API Data Hooks ──────────────────────────────────────────────────────
  const reportFilters = { fromDate: "2026-08-01", toDate: "2026-08-08" };
  const { data: doctorPerformanceData } = useDoctorPerformance(reportFilters);

  // Map API doctor performance to table format
  const apiTableData: DoctorReportRecord[] = (doctorPerformanceData?.content ?? []).map((d) => ({
    doctorId: d.doctorId,
    doctorName: d.doctorName,
    department: d.department,
    appointments: d.appointments,
    completed: d.completed,
    pending: d.pending,
    cancelled: d.cancelled,
    followup: d.followUps,
    avgTimeMinutes: d.averageDurationMinutes,
    patientRating: d.rating ?? 0,
  }));
  const doctorTableSource = apiTableData.length > 0 ? apiTableData : DOCTOR_REPORT_TABLE_DATA;

  // Table sorting & pagination
  const [sortField, setSortField] =
    useState<keyof DoctorReportRecord>("completed");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRange("Today");
    setDeptFilter("All Departments");
    setDoctorFilter("All Doctors");
    setStatusFilter("All Statuses");
    setAptTypeFilter("All Types");
    setShiftFilter("All Shifts");
  };

  // Filtered records
  const filteredData = useMemo(() => {
    return doctorTableSource.filter((item) => {
      const matchesSearch =
        item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.doctorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept =
        deptFilter === "All Departments" || item.department === deptFilter;
      const matchesDoctor =
        doctorFilter === "All Doctors" || item.doctorName === doctorFilter;

      return matchesSearch && matchesDept && matchesDoctor;
    });
  }, [searchQuery, deptFilter, doctorFilter]);

  // Sorted records
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  const handleSort = (field: keyof DoctorReportRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

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
                  className="hover:text-[#0D47A1] cursor-pointer"
                  onClick={onBack}
                >
                  Hospital
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span
                  className="hover:text-[#0D47A1] cursor-pointer"
                  onClick={onBack}
                >
                  Reports
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0D47A1] font-semibold">
                  Doctor Report
                </span>
              </nav>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Doctor Report
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#009688] border border-teal-200">
                  Performance Verified
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Analyze doctor workload, consultation performance and OPD
                activity.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 border border-[#E5E7EB] px-3 py-2 rounded-xl mr-1">
                <Clock className="w-4 h-4 text-[#0D47A1]" />
                <span>
                  Last Updated:{" "}
                  <strong className="text-[#111827]">Today, 11:15 AM</strong>
                </span>
              </div>

              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-slate-50 transition shadow-sm"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#0D47A1] ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => alert("Exporting Doctor Report to PDF...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[#0D47A1] hover:bg-blue-900 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => alert("Exporting Doctor Report to Excel...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[#009688] hover:bg-teal-700 transition shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-slate-50 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#0D47A1]" />
                <span>Print</span>
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
              placeholder="Search Doctor Name, Doctor ID, Department..."
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

        {/* Global Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
          <div
            className="flex items-center gap-2 mb-3 text-xs font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            <Filter className="w-4 h-4 text-[#009688]" />
            <span>Filter Doctor Performance & Workload</span>
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
                Department
              </label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Departments</option>
                <option>General Medicine</option>
                <option>Cardiology</option>
                <option>Orthopedics</option>
                <option>Neurology</option>
                <option>ENT</option>
                <option>Pediatrics</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Doctor
              </label>
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Doctors</option>
                <option>Dr. Sarah Jenkins</option>
                <option>Dr. Rajesh Kapoor</option>
                <option>Dr. Priya Sharma</option>
                <option>Dr. Arjun Mehta</option>
                <option>Dr. Sunita Patel</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Consultation Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Statuses</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Cancelled</option>
                <option>Follow-up</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Appointment Type
              </label>
              <select
                value={aptTypeFilter}
                onChange={(e) => setAptTypeFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Types</option>
                <option>New Visit</option>
                <option>Follow-up</option>
                <option>Walk-in</option>
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
                <option>Morning (08:00 - 14:00)</option>
                <option>Evening (14:00 - 20:00)</option>
                <option>Night Shift</option>
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
            Simulate real-time doctor performance analytics
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
              Unable to Load Doctor Report
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Connection timeout while fetching physician performance
              statistics. Please retry.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="mt-4 px-4 py-2 bg-[#EF4444] text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* LOADING SKELETON STATE */}
        {isLoading && (
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 h-32 animate-pulse flex flex-col justify-between"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 h-64 animate-pulse"></div>
          </div>
        )}

        {!isLoading && !hasError && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT MAIN CONTENT AREA (3 Cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* TOP 6 KPI CARDS SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Total Doctors */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Total Doctors
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0D47A1]">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    24
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#66BB6A] font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +8.3%
                    </span>
                    <span>22 Active | 2 On Leave</span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={DOCTOR_CONSULTATION_TREND_DATA}>
                        <Line
                          type="monotone"
                          dataKey="Completed"
                          stroke="#0D47A1"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 2: Total Consultations */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Total Consultations
                    </span>
                    <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    184
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#009688] font-semibold">
                      184 Completed | 18 Pending | 8 Cancelled
                    </span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={DOCTOR_CONSULTATION_TREND_DATA}>
                        <Area
                          type="monotone"
                          dataKey="Completed"
                          stroke="#009688"
                          fill="#009688"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 3: Average Consultation Time */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Avg Consultation Time
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-50 text-[#0D47A1]">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    14.2 min
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#66BB6A] font-semibold">
                      -1.8 min vs target avg
                    </span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={AVG_CONSULTATION_TIME_DATA}>
                        <Line
                          type="monotone"
                          dataKey="minutes"
                          stroke="#0D47A1"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 4: Follow-up Consultations */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Follow-up Consultations
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#66BB6A]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    42
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    22.8% of Total Consultations
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden mt-3">
                    <div
                      className="bg-[#66BB6A] h-full"
                      style={{ width: "23%" }}
                    />
                    <div
                      className="bg-[#009688] h-full"
                      style={{ width: "77%" }}
                    />
                  </div>
                </div>

                {/* Card 5: Doctor Utilization */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Doctor Utilization
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    88%
                  </div>
                  <div className="text-[11px] text-[#64748B] mb-2">
                    Avg 16 Patients per Doctor / Day
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                    <div
                      className="bg-[#F59E0B] h-full"
                      style={{ width: "88%" }}
                    />
                  </div>
                </div>

                {/* Card 6: Patient Satisfaction */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#64748B]">
                      Patient Satisfaction
                    </span>
                    <div
                      className="text-2xl font-bold text-[#111827] mt-1"
                      style={{ fontFamily: PP }}
                    >
                      4.8 / 5.0
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Based on 162 feedbacks
                    </p>
                    <div className="mt-1 text-[11px] font-semibold text-[#66BB6A]">
                      â˜… Top Rated Service
                    </div>
                  </div>
                  <CircularProgress percentage={96} size={64} strokeWidth={7} />
                </div>
              </div>

              {/* CONSULTATION TREND AREA CHART */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Consultation Trend
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Daily volume tracking of completed vs pending OPD
                      consultations
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] text-xs">
                    {(["7 Days", "30 Days", "90 Days"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTrendDays(t)}
                        className={`px-3 py-1 rounded-lg font-medium transition ${trendDays === t ? "bg-white text-[#0D47A1] shadow-sm" : "text-[#64748B]"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={DOCTOR_CONSULTATION_TREND_DATA}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCompGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#009688"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#009688"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPendGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F59E0B"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F59E0B"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#64748B" }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "12px",
                          borderColor: "#E5E7EB",
                          fontSize: "11px",
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{ fontSize: "11px" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Completed"
                        name="Completed Consultations"
                        stroke="#009688"
                        fillOpacity={1}
                        fill="url(#colorCompGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Pending"
                        name="Pending Consultations"
                        stroke="#F59E0B"
                        fillOpacity={1}
                        fill="url(#colorPendGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DOCTOR WORKLOAD & CONSULTATION STATUS DISTRIBUTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Workload Horizontal Bar */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Doctor Workload Analysis
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Completed vs appointments per physician
                      </p>
                    </div>
                    <UserCheck className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={DOCTOR_WORKLOAD_DATA}
                        margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#64748B" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="doctor"
                          tick={{ fontSize: 10, fill: "#111827" }}
                          width={80}
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
                          dataKey="completed"
                          name="Completed"
                          fill="#009688"
                          radius={[0, 4, 4, 0]}
                        />
                        <Bar
                          dataKey="appointments"
                          name="Total Appointments"
                          fill="#0D47A1"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Consultation Status Distribution Donut */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Consultation Status Share
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Distribution of completed, pending, follow-up &
                        cancelled
                      </p>
                    </div>
                    <PieChart className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={CONSULTATION_STATUS_DIST_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {CONSULTATION_STATUS_DIST_DATA.map((entry, index) => (
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

              {/* DEPARTMENT PERFORMANCE & AVERAGE CONSULTATION TIME CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Performance Vertical Bar */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Department Consultation Volume
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Total OPD consultations by specialty department
                      </p>
                    </div>
                    <Building2 className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={DEPT_PERFORMANCE_DATA}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="department"
                          tick={{ fontSize: 9, fill: "#64748B" }}
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
                          dataKey="consultations"
                          name="Consultations"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Average Consultation Duration Line Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Avg Consultation Duration
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Average consultation duration (minutes) by day
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={AVG_CONSULTATION_TIME_DATA}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
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
                        <Line
                          type="monotone"
                          dataKey="minutes"
                          name="Duration (min)"
                          stroke="#009688"
                          strokeWidth={2.5}
                          dot={{ fill: "#009688" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* DOCTOR PERFORMANCE TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Doctor Performance Register
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Detailed OPD consultation and patient rating register
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      alert("Exporting Doctor Performance Register (CSV)...")
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
                        <th
                          className="py-3.5 px-4 cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("doctorId")}
                        >
                          Doctor ID{" "}
                          {sortField === "doctorId" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th
                          className="py-3.5 px-4 cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("doctorName")}
                        >
                          Doctor Name{" "}
                          {sortField === "doctorName" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4 text-center">
                          Appointments
                        </th>
                        <th
                          className="py-3.5 px-4 text-center cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("completed")}
                        >
                          Completed{" "}
                          {sortField === "completed" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th className="py-3.5 px-4 text-center">Pending</th>
                        <th className="py-3.5 px-4 text-center">Cancelled</th>
                        <th className="py-3.5 px-4 text-center">Follow-up</th>
                        <th className="py-3.5 px-4 text-center">
                          Avg Duration
                        </th>
                        <th className="py-3.5 px-4 text-center">Rating</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {sortedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={11}
                            className="py-8 text-center text-[#64748B]"
                          >
                            No doctor performance records match the selected
                            filter criteria.
                          </td>
                        </tr>
                      ) : (
                        sortedData.map((item) => (
                          <tr
                            key={item.doctorId}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                              {item.doctorId}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#111827]">
                              {item.doctorName}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-[#111827]">
                              {item.department}
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-[#111827]">
                              {item.appointments}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-[#009688]">
                              {item.completed}
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-[#F59E0B]">
                              {item.pending}
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-[#EF4444]">
                              {item.cancelled}
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-[#66BB6A]">
                              {item.followup}
                            </td>
                            <td className="py-3.5 px-4 text-center text-[#64748B]">
                              {item.avgTimeMinutes} min
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-[#0D47A1]">
                              â˜… {item.patientRating}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() =>
                                    alert(
                                      `Viewing performance details for ${item.doctorName}`,
                                    )
                                  }
                                  className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    alert(
                                      `Printing performance summary for ${item.doctorId}`,
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
                    Showing 1 to {sortedData.length} of {sortedData.length}{" "}
                    entries
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

              {/* RECENT DOCTOR ACTIVITIES TIMELINE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3
                  className="text-base font-bold text-[#111827] mb-4"
                  style={{ fontFamily: PP }}
                >
                  Recent Doctor OPD Activities & Logs
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7EB]">
                  {RECENT_DOCTOR_ACTIVITIES.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-4 relative z-10"
                    >
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0D47A1] flex items-center justify-center text-[#0D47A1] shrink-0">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-[#F1F5F9] rounded-xl p-3 border border-[#E5E7EB] flex-1 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#111827]">
                            {act.doctor} ({act.department})
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            {act.time}
                          </span>
                        </div>
                        <p className="text-[#64748B]">
                          Action:{" "}
                          <strong className="text-[#0D47A1]">{act.type}</strong>{" "}
                          for patient{" "}
                          <span className="font-semibold text-[#111827]">
                            {act.patient}
                          </span>
                          .
                        </p>
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
                    <span>Doctor Summary</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Live OPD physician highlights
                  </p>
                </div>

                {/* Active Scope Summary */}
                <div className="bg-[#F1F5F9] rounded-xl p-3 border border-[#E5E7EB] text-xs space-y-1.5">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">
                    Performance Overview
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Selected Range:</span>
                    <span className="font-semibold text-[#111827]">
                      {dateRange}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Active Doctors:</span>
                    <span className="font-bold text-[#0D47A1]">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Total Consultations:</span>
                    <span className="font-bold text-[#111827]">184</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Completed:</span>
                    <span className="font-bold text-[#009688]">184</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Pending:</span>
                    <span className="font-bold text-[#F59E0B]">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Cancelled:</span>
                    <span className="font-bold text-[#EF4444]">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Avg Duration:</span>
                    <span className="font-bold text-[#111827]">14.2 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Top Department:</span>
                    <span className="font-bold text-[#0D47A1]">
                      Gen. Medicine
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
                      onClick={() => alert("Exporting Excel...")}
                      className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-semibold text-[#009688]"
                    >
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#009688]" />
                        <span>Export Excel Report</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#111827]"
                    >
                      <div className="flex items-center gap-2">
                        <Printer className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Print Summary</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>

                    {onOpenAppointmentReport && (
                      <button
                        onClick={onOpenAppointmentReport}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#111827]"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#0D47A1]" />
                          <span>Open Appointment Report</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                    )}

                    {onOpenPatientReport && (
                      <button
                        onClick={onOpenPatientReport}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#111827]"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#009688]" />
                          <span>Open Patient Report</span>
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
                    <span>Workload RBAC Verified</span>
                  </div>
                  <span>
                    Read-only analytics access granted for Hospital Admin
                    physician oversight.
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
              {filteredData.length} Doctor Report Results
            </strong>
          </div>
          <div>Hospital Management System â€¢ Doctor Report v1.0</div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">2026-07-26 01:12</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
