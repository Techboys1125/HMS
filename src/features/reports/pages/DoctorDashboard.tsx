import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../app/routes/routes";
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
  Clock,
  PieChart as PieChartIcon,
  Eye,
  Printer,
  AlertCircle,
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
  LineChart,
  Line,
} from "../../../common/components/recharts-lazy";


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
export interface DoctorConsultationRecord {
  id: string;
  patientName: string;
  mrn: string;
  appointmentDate: string;
  consultationTime: string;
  diagnosis: string;
  prescription: string;
  status: string;
}

export function DoctorReportsDashboardScreen({
  onOpenReport,
  onOpenKpiDetail,
}: {
  onOpenReport?: (reportId: string) => void;
  onOpenKpiDetail?: (kpiName?: string) => void;
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("Today");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All Visit Types");

  const [trendDays, setTrendDays] = useState<"7" | "30" | "90">("7");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRangeFilter("Today");
    setStatusFilter("All Statuses");
    setVisitTypeFilter("All Visit Types");
  };

  const filteredConsultations = useMemo(() => {
    return ([] as DoctorConsultationRecord[]).filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All Statuses" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div
      className="min-h-screen bg-[#F1F5F9] text-[#111827] pb-12"
      style={{ fontFamily: RB }}
    >
      {/* Top Header Section */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
                <span className="hover:text-[#0D47A1] cursor-pointer">
                  Doctor
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0D47A1] font-semibold">Reports</span>
              </nav>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Reports Dashboard
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D47A1]/10 text-[#0D47A1] border border-blue-200">
                  Doctor Access Level
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monitor your appointments, consultations and patient activity.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 border border-[#E5E7EB] px-3 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-[#0D47A1]" />
                <span>
                  Last Updated:{" "}
                  <strong className="text-[#111827]">
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
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
                onClick={() => alert("Exporting Doctor Summary (PDF)...")}
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
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, appointment or consultation..."
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

        {/* Doctor Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex items-center gap-2 text-xs font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              <Filter className="w-4 h-4 text-[#009688]" />
              <span>Filter Doctor Consultation Analytics</span>
            </div>
            <span className="text-[11px] text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">
              Filter: Logged-in Doctor (Dr. Sarah Jenkins)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Date Range
              </label>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Statuses</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Scheduled</option>
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
                <option>New Consultation</option>
                <option>Follow-up Visit</option>
                <option>Routine Checkup</option>
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
            Simulate Doctor RBAC analytical states
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
              Unable to Load Doctor Reports
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Connection timeout while loading your consultation metrics. Please
              retry.
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
              {/* TOP 6 DOCTOR KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Today's Appointments */}
                <div
                  onClick={() => navigate(ROUTES.DOCTOR_APPOINTMENTS)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#0D47A1] transition">
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
                    0
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#66BB6A] font-semibold flex items-center gap-0.5">
                      --
                    </span>
                    <span className="text-[#0D47A1] font-semibold flex items-center gap-0.5 group-hover:underline">
                      View Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#66BB6A] font-bold">0</div>
                      <div className="text-[#64748B]">Done</div>
                    </div>
                    <div>
                      <div className="text-[#EF4444] font-bold">0</div>
                      <div className="text-[#64748B]">Cancel</div>
                    </div>
                    <div>
                      <div className="text-[#F59E0B] font-bold">0</div>
                      <div className="text-[#64748B]">Pending</div>
                    </div>
                  </div>
                </div>

                {/* Card 2: My Patients */}
                <div
                  onClick={() => navigate(ROUTES.DOCTOR_PATIENTS)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#009688] transition">
                      My Patients
                    </span>
                    <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    0
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#009688] font-semibold flex items-center gap-0.5">
                      --
                    </span>
                    <span className="text-[#009688] font-semibold flex items-center gap-0.5 group-hover:underline">
                      View Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#009688] font-bold">0</div>
                      <div className="text-[#64748B]">New</div>
                    </div>
                    <div>
                      <div className="text-[#0D47A1] font-bold">0</div>
                      <div className="text-[#64748B]">Return</div>
                    </div>
                    <div>
                      <div className="text-[#4DB6AC] font-bold">0</div>
                      <div className="text-[#64748B]">Walk-in</div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Completed Consultations */}
                <div
                  onClick={() => navigate(ROUTES.DOCTOR_MY_SCHEDULE)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#0D47A1] transition">
                      Completed Consultations
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-50 text-[#0D47A1]">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    0
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#0D47A1] font-semibold">--</span>
                    <span className="text-[#0D47A1] font-semibold flex items-center gap-0.5 group-hover:underline">
                      View Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#0D47A1] font-bold">0</div>
                      <div className="text-[#64748B]">Today</div>
                    </div>
                    <div>
                      <div className="text-[#66BB6A] font-bold">0</div>
                      <div className="text-[#64748B]">Monthly</div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Follow-up Patients */}
                <div
                  onClick={() => navigate(ROUTES.DOCTOR_APPOINTMENTS)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#F59E0B] transition">
                      Follow-up Patients
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    0
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#F59E0B] font-semibold">--</span>
                    <span className="text-[#0D47A1] font-semibold flex items-center gap-0.5 group-hover:underline">
                      View Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#F59E0B] font-bold">0</div>
                      <div className="text-[#64748B]">Today</div>
                    </div>
                    <div>
                      <div className="text-[#009688] font-bold">0</div>
                      <div className="text-[#64748B]">Upcoming</div>
                    </div>
                  </div>
                </div>

                {/* Card 5: Average Consultation Time */}
                <div
                  onClick={() => navigate(ROUTES.DOCTOR_MY_SCHEDULE)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#009688] transition">
                      Avg Consultation Time
                    </span>
                    <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#009688] font-semibold">--</span>
                    <span className="text-[#0D47A1] font-semibold flex items-center gap-0.5 group-hover:underline">
                      View Detail <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#009688] font-bold">--</div>
                      <div className="text-[#64748B]">My Avg</div>
                    </div>
                    <div>
                      <div className="text-[#64748B] font-bold">--</div>
                      <div className="text-[#64748B]">Dept Avg</div>
                    </div>
                  </div>
                </div>

                {/* Card 6: Patient Satisfaction */}
                <div
                  onClick={() => navigate(ROUTES.DOCTOR_MY_SCHEDULE)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#64748B] group-hover:text-[#66BB6A] transition">
                      Patient Satisfaction
                    </span>
                    <div
                      className="text-2xl font-bold text-[#111827] mt-1"
                      style={{ fontFamily: PP }}
                    >
                      --
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">--</p>
                    <div className="mt-2 text-[11px] font-semibold text-[#66BB6A] flex items-center gap-0.5 group-hover:underline">
                      View Detail <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                  <CircularProgress percentage={98} size={64} strokeWidth={7} />
                </div>
              </div>

              {/* AVAILABLE DOCTOR REPORTS */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2
                      className="text-lg font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Available Doctor Reports
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Select any report to view your appointments and clinical
                      metrics.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#0D47A1] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                    4 Reports Accessible
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Report 1: Daily Appointment Report */}
                  <div className="border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#0D47A1] hover:shadow-md transition-all flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-[#0D47A1]">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                          Appointments
                        </span>
                      </div>
                      <h3
                        className="text-sm font-bold text-[#111827] group-hover:text-[#0D47A1] transition"
                        style={{ fontFamily: PP }}
                      >
                        Daily Appointment Report
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                        View detailed list of your scheduled, completed, and
                        pending consultations.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">
                        Scope: Logged-in Doctor
                      </span>
                      <button
                        onClick={() => onOpenReport?.("REP-001")}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D47A1] hover:text-blue-900 transition"
                      >
                        <span>Open Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Report 2: Patient Report */}
                  <div className="border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#009688] hover:shadow-md transition-all flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-teal-50 text-[#009688]">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                          Patients
                        </span>
                      </div>
                      <h3
                        className="text-sm font-bold text-[#111827] group-hover:text-[#009688] transition"
                        style={{ fontFamily: PP }}
                      >
                        Patient Report
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                        Patient demographics, visit history, and consultation
                        summaries.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">
                        Scope: My Patients
                      </span>
                      <button
                        onClick={() => onOpenReport?.("REP-003")}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#009688] hover:text-teal-900 transition"
                      >
                        <span>Open Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Report 3: Doctor Performance Report */}
                  <div className="border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#0D47A1] hover:shadow-md transition-all flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-[#0D47A1]">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                          Clinical
                        </span>
                      </div>
                      <h3
                        className="text-sm font-bold text-[#111827] group-hover:text-[#0D47A1] transition"
                        style={{ fontFamily: PP }}
                      >
                        Doctor Performance Report
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                        Track consultation efficiency, completion rates, and
                        patient feedback.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">
                        Scope: Personal Metrics
                      </span>
                      <button
                        onClick={() => onOpenReport?.("REP-004")}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D47A1] hover:text-blue-900 transition"
                      >
                        <span>Open Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Report 4: Dashboard KPI Detail */}
                  <div className="border border-[#E5E7EB] rounded-2xl p-4 hover:border-[#009688] hover:shadow-md transition-all flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-[#009688]">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
                          Analytics
                        </span>
                      </div>
                      <h3
                        className="text-sm font-bold text-[#111827] group-hover:text-[#009688] transition"
                        style={{ fontFamily: PP }}
                      >
                        Dashboard KPI Detail
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                        Drill-down insights and granular logs for your active
                        clinical KPIs.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">
                        Scope: Drill-Down Context
                      </span>
                      <button
                        onClick={() =>
                          onOpenKpiDetail?.("Doctor Workload Performance")
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#009688] hover:text-teal-900 transition"
                      >
                        <span>Open Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* MY APPOINTMENT TREND AREA CHART */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      My Appointment Trend
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Weekly tracking of scheduled vs completed consultations
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] text-xs">
                    {(["7", "30", "90"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTrendDays(t)}
                        className={`px-3 py-1 rounded-lg font-medium transition ${trendDays === t ? "bg-[#0D47A1] text-white shadow-sm" : "text-[#64748B]"}`}
                      >
                        {t} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[]}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="docApptGrad"
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
                          id="docCompGrad"
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
                        dataKey="appointments"
                        name="Total Appointments"
                        stroke="#0D47A1"
                        fillOpacity={1}
                        fill="url(#docApptGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        name="Completed Consultations"
                        stroke="#009688"
                        fillOpacity={1}
                        fill="url(#docCompGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CONSULTATION ANALYTICS & PATIENT DISTRIBUTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Consultation Analytics Line Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Intraday Consultation Progress
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Accumulated completed consults vs avg consult time
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[]}
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
                          dataKey="completed"
                          name="Completed"
                          stroke="#0D47A1"
                          strokeWidth={2}
                          dot={{ fill: "#0D47A1" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgTime"
                          name="Avg Time (min)"
                          stroke="#009688"
                          strokeWidth={2}
                          dot={{ fill: "#009688" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Patient Distribution Donut Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Patient Type Distribution
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Breakdown of new, returning, and follow-up patients
                      </p>
                    </div>
                    <PieChartIcon className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={[]}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {([] as Array<{ name?: string; color: string }>).map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
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

              {/* MY WORKLOAD HORIZONTAL BAR CHART */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Shift Workload Distribution
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Consultation load breakdown across morning, afternoon &
                      evening slots
                    </p>
                  </div>
                  <UserCheck className="w-4 h-4 text-[#0D47A1]" />
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[]}
                      margin={{ top: 5, right: 10, left: 35, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 10, fill: "#64748B" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="slot"
                        tick={{ fontSize: 9, fill: "#111827" }}
                        width={120}
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
                        dataKey="pending"
                        name="Pending"
                        fill="#F59E0B"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* RECENT CONSULTATIONS ENTERPRISE TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Recent Patient Consultations
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Logged-in Doctor active consultation history register
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      alert("Exporting Consultation Summary (CSV)...")
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] text-xs font-semibold text-[#111827] rounded-xl hover:bg-slate-100 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0D47A1]" />
                    <span>Export Summary</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F1F5F9] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E5E7EB]">
                        <th className="py-3.5 px-4">Patient Name</th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Appt Date</th>
                        <th className="py-3.5 px-4">Consult Time</th>
                        <th className="py-3.5 px-4">Diagnosis</th>
                        <th className="py-3.5 px-4">Prescription</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {filteredConsultations.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-bold text-[#111827]">
                            {item.patientName}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-[#0D47A1]">
                            {item.mrn}
                          </td>
                          <td className="py-3.5 px-4 text-[#64748B]">
                            {item.appointmentDate}
                          </td>
                          <td className="py-3.5 px-4 text-[#111827] font-medium">
                            {item.consultationTime}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#111827]">
                            {item.diagnosis}
                          </td>
                          <td className="py-3.5 px-4 text-[#009688] font-medium">
                            {item.prescription}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${item.status === "Completed" ? "bg-teal-50 text-[#009688] border border-teal-200" : item.status === "In Progress" ? "bg-amber-50 text-[#F59E0B] border border-amber-200" : "bg-slate-100 text-[#64748B]"}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() =>
                                  alert(
                                    `Viewing consultation details for ${item.patientName}`,
                                  )
                                }
                                className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                title="View Consultation"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  alert(
                                    `Printing summary for ${item.patientName}`,
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RECENT ACTIVITIES TIMELINE */}
            </div>

            {/* RIGHT STICKY SUMMARY PANEL (1 Col) */}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <div>
            Showing{" "}
            <strong className="text-[#111827]">
              {filteredConsultations.length} Consultations
            </strong>
          </div>
          <div>
            Hospital Management System â€¢ Doctor Reports Dashboard v1.0
          </div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">
              {new Date().toLocaleString()}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}