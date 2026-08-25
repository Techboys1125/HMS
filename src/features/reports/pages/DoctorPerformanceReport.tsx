import React, { useState, useMemo, useTransition } from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Clock,
  PieChart as PieChartIcon,
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
import { PP, RB } from "../constants/reports.constants";
import type {
  DoctorReportRecord,
  DoctorPerformanceSummary,
} from "../types/reports.types";
import { useDoctorPerformance, extractList } from "../hooks/useReports";

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
} from "../../../common/components/recharts-lazy";

function CircularProgress({
  percentage,
  size = 64,
  strokeWidth = 7,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#0D47A1"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const [lastUpdated] = useState(() => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${day}, ${time}`;
  });
  const [lastRefreshed] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16).replace("T", " ");
  });
  const [isPending, startTransition] = useTransition();
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);
  const isLoading = isPending || showLoadingDemo;
  const [hasError, setHasError] = useState(false);
  const [trendDays, setTrendDays] = useState<"7 Days" | "30 Days" | "90 Days">(
    "7 Days",
  );

  // ─── API Data Hooks ──────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const getDateRange = (range: string) => {
    const now = new Date();
    if (range === "Today") return { fromDate: today, toDate: today };
    if (range === "7 Days") {
      const from = new Date(now);
      from.setDate(now.getDate() - 7);
      return { fromDate: from.toISOString().slice(0, 10), toDate: today };
    }
    if (range === "30 Days") {
      const from = new Date(now);
      from.setDate(now.getDate() - 30);
      return { fromDate: from.toISOString().slice(0, 10), toDate: today };
    }
    return { fromDate: "2025-01-01", toDate: today };
  };
  const reportFilters = getDateRange(dateRange);
  const { data: rawDoctorPerformance } = useDoctorPerformance(reportFilters);

  const doctorList = useMemo(
    () => extractList<DoctorPerformanceSummary>(rawDoctorPerformance),
    [rawDoctorPerformance],
  );

  // Map API doctor performance to table format
  const doctorTableSource = useMemo(() => {
    return doctorList.map((d: DoctorPerformanceSummary) => ({
      doctorId: d.doctorId || d.id || `DOC-${d.code || ""}`,
      doctorName: d.doctorName || d.name || "Doctor",
      department: d.department || "General Medicine",
      appointments: Number(d.appointments || d.totalAppointments || 0),
      completed: Number(d.completed || d.completedAppointments || 0),
      pending: Number(d.pending || d.pendingAppointments || 0),
      cancelled: Number(d.cancelled || d.cancelledAppointments || 0),
      followup: Number(d.followUps || d.followup || 0),
      avgTimeMinutes: Number(
        d.averageDurationMinutes || d.avgConsultationTimeMinutes || 15,
      ),
      patientRating: Number(d.rating || d.patientRating || 4.8),
    }));
  }, [doctorList]);

  // Build a doctorPerformanceData-compatible object from the raw list
  // so all existing JSX references (doctorPerformanceData?.summary.*) work correctly
  const doctorPerformanceData = useMemo(() => {
    const totalDoctors = doctorList.length;
    const totalConsultations = doctorList.reduce(
      (s: number, d: DoctorPerformanceSummary) =>
        s + Number(d.appointments || 0),
      0,
    );
    const completedConsultations = doctorList.reduce(
      (s: number, d: DoctorPerformanceSummary) => s + Number(d.completed || 0),
      0,
    );
    const pendingConsultations = doctorList.reduce(
      (s: number, d: DoctorPerformanceSummary) => s + Number(d.pending || 0),
      0,
    );
    const cancelledConsultations = doctorList.reduce(
      (s: number, d: DoctorPerformanceSummary) => s + Number(d.cancelled || 0),
      0,
    );
    const followUpConsultations = doctorList.reduce(
      (s: number, d: DoctorPerformanceSummary) => s + Number(d.followUps || 0),
      0,
    );
    const avgRating =
      totalDoctors > 0
        ? doctorList.reduce(
            (s: number, d: DoctorPerformanceSummary) =>
              s + Number(d.rating || 4.8),
            0,
          ) / totalDoctors
        : 0;
    const averageConsultationDurationMinutes =
      totalDoctors > 0
        ? doctorList.reduce(
            (sum: number, d: DoctorPerformanceSummary) =>
              sum +
              Number(
                d.averageDurationMinutes || d.avgConsultationTimeMinutes || 15,
              ),
            0,
          ) / totalDoctors
        : 0;

    const doctorUtilizationPercentage =
      totalConsultations > 0
        ? (completedConsultations / totalConsultations) * 100
        : 0;

    const topDoc =
      doctorList.length > 0
        ? doctorList.toSorted(
            (a: DoctorPerformanceSummary, b: DoctorPerformanceSummary) =>
              Number(b.completed || 0) - Number(a.completed || 0),
          )[0]
        : null;
    return {
      summary: {
        totalDoctors,
        activeDoctors: totalDoctors,
        onLeaveDoctors: 0,
        totalConsultations,
        completedConsultations,
        pendingConsultations,
        cancelledConsultations,
        followUpConsultations,
        patientSatisfaction: avgRating,
        topPerformingDepartment: topDoc?.department ?? "--",
        averageConsultationDurationMinutes,
        doctorUtilizationPercentage,
      },
      content: doctorList,
    };
  }, [doctorList]);

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
  }, [searchQuery, deptFilter, doctorFilter, doctorTableSource]);

  // Sorted records
  const sortedData = useMemo(() => {
    return filteredData.toSorted((a, b) => {
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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
                <button
                  type="button"
                  className="hover:text-[#0D47A1] cursor-pointer"
                  onClick={onBack}
                >
                  Hospital
                </button>
                <ChevronRight className="w-3.5 h-3.5" />
                <button
                  type="button"
                  className="hover:text-[#0D47A1] cursor-pointer"
                  onClick={onBack}
                >
                  Reports
                </button>
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
                  <strong className="text-[#111827]">{lastUpdated}</strong>
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
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              aria-label="Input field"
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

        {/* TOP 6 KPI CARDS (Single Line Grid Above Filter Bar) */}
        {!isLoading && !hasError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            {/* Card 1: Total Doctors */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#64748B] truncate">
                    Total Doctors
                  </span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-[#0D47A1] shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div
                  className="text-xl font-bold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  {doctorPerformanceData?.summary?.totalDoctors ?? 0}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#64748B] mb-2">
                  <span className="text-[#66BB6A] font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> --
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] pt-1.5 border-t border-[#E5E7EB] truncate">
                {doctorPerformanceData?.summary?.activeDoctors ?? 0} Active | {doctorPerformanceData?.summary?.onLeaveDoctors ?? 0} Leave
              </div>
            </div>

            {/* Card 2: Total Consultations */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#64748B] truncate">
                    Total Consults
                  </span>
                  <div className="p-1.5 rounded-lg bg-teal-50 text-[#009688] shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div
                  className="text-xl font-bold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  {doctorPerformanceData?.summary?.totalConsultations ?? 0}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#64748B] mb-2">
                  <span className="text-[#009688] font-semibold truncate">
                    {doctorPerformanceData?.summary?.completedConsultations ?? 0} Completed
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] pt-1.5 border-t border-[#E5E7EB] truncate">
                {doctorPerformanceData?.summary?.pendingConsultations ?? 0} Pend | {doctorPerformanceData?.summary?.cancelledConsultations ?? 0} Canc
              </div>
            </div>

            {/* Card 3: Average Consultation Time */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#64748B] truncate">
                    Avg Consult Time
                  </span>
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-[#0D47A1] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div
                  className="text-xl font-bold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  {doctorPerformanceData?.summary?.averageConsultationDurationMinutes ?? 0} m
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#64748B] mb-2">
                  <span className="text-[#66BB6A] font-semibold">
                    Target Met
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] pt-1.5 border-t border-[#E5E7EB] truncate">
                Avg Duration / Patient
              </div>
            </div>

            {/* Card 4: Follow-up Consultations */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#64748B] truncate">
                    Follow-ups
                  </span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-[#66BB6A] shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div
                  className="text-xl font-bold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  {doctorPerformanceData?.summary?.followUpConsultations ?? 0}
                </div>
                <div className="text-[10px] text-[#64748B] mb-2 truncate">
                  {doctorPerformanceData?.summary?.totalConsultations
                    ? Math.round(
                        ((doctorPerformanceData?.summary?.followUpConsultations ?? 0) /
                          doctorPerformanceData.summary.totalConsultations) *
                          100,
                      )
                    : 0}% of Total
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 flex overflow-hidden mt-1">
                <div className="bg-[#66BB6A] h-full" style={{ width: "23%" }} />
                <div className="bg-[#009688] h-full" style={{ width: "77%" }} />
              </div>
            </div>

            {/* Card 5: Doctor Utilization */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#64748B] truncate">
                    Doctor Utilization
                  </span>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-[#F59E0B] shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div
                  className="text-xl font-bold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  {doctorPerformanceData?.summary?.doctorUtilizationPercentage ?? 0}%
                </div>
                <div className="text-[10px] text-[#64748B] mb-2 truncate">
                  Capacity Load
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 flex overflow-hidden mt-1">
                <div className="bg-[#F59E0B] h-full" style={{ width: "88%" }} />
              </div>
            </div>

            {/* Card 6: Patient Satisfaction */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#64748B] block leading-tight truncate">
                  Satisfaction
                </span>
                <div
                  className="text-xl font-bold text-[#111827] mt-1"
                  style={{ fontFamily: PP }}
                >
                  {doctorPerformanceData?.summary?.patientSatisfaction ?? "--"} / 5
                </div>
                <div className="mt-2 text-[10px] font-semibold text-[#66BB6A]">
                  ★ Top Rated
                </div>
              </div>
              <CircularProgress
                percentage={
                  doctorPerformanceData?.summary?.patientSatisfaction
                    ? (doctorPerformanceData.summary.patientSatisfaction / 5) * 100
                    : 98
                }
                size={48}
                strokeWidth={5}
              />
            </div>
          </div>
        )}

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
              <span className="block text-[11px] font-medium text-[#64748B] mb-1">
                Date Range
                <select
                  aria-label="Select option"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                >
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                </select>
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#64748B] mb-1">
                Department
                <select
                  aria-label="Select option"
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
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#64748B] mb-1">
                Doctor
                <select
                  aria-label="Select option"
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
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#64748B] mb-1">
                Consultation Status
                <select
                  aria-label="Select option"
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
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#64748B] mb-1">
                Appointment Type
                <select
                  aria-label="Select option"
                  value={aptTypeFilter}
                  onChange={(e) => setAptTypeFilter(e.target.value)}
                  className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                >
                  <option>All Types</option>
                  <option>New Visit</option>
                  <option>Follow-up</option>
                  <option>Walk-in</option>
                </select>
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-[#64748B] mb-1">
                Shift
                <select
                  aria-label="Select option"
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                >
                  <option>All Shifts</option>
                  <option>Morning (08:00 - 14:00)</option>
                  <option>Evening (14:00 - 20:00)</option>
                  <option>Night Shift</option>
                </select>
              </span>
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
                startTransition(() => {
                  setShowLoadingDemo(!showLoadingDemo);
                  setHasError(false);
                });
                setHasError(false);
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs ${isLoading ? "bg-amber-50 border-amber-300 text-[#F59E0B]" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
            >
              Toggle Loading Skeleton
            </button>
            <button
              onClick={() => {
                setHasError(!hasError);
                setShowLoadingDemo(false);
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
          <div className="w-full space-y-6">
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
                      data={[]}
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
                        data={[]}
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
                          {([] as Array<{ name?: string; color: string }>).map(
                            (entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ),
                          )}
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
                        data={[]}
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
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              (e.currentTarget as HTMLElement).click();
                            }
                          }}
                          className="py-3.5 px-4 cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("doctorId")}
                        >
                          Doctor ID{" "}
                          {sortField === "doctorId" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              (e.currentTarget as HTMLElement).click();
                            }
                          }}
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
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              (e.currentTarget as HTMLElement).click();
                            }
                          }}
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
                      aria-label="Previous"
                      disabled
                      className="p-1 rounded-lg border border-[#E5E7EB] opacity-50 cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-[#111827]">
                      Page 1 of 1
                    </span>
                    <button
                      aria-label="Next"
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
                  {(
                    [] as {
                      id: string;
                      doctor: string;
                      department: string;
                      time: string;
                      type: string;
                      patient: string;
                    }[]
                  ).map((act) => (
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

        )}

      </div>
    </div>
  );
}
