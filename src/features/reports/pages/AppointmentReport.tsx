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
  XCircle,
  AlertCircle,
  Users,
  UserCheck,
  Building2,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Eye,
} from "lucide-react";
import { PP, RB } from "../constants/reports.constants";
import type {
  AppointmentReportRecord,
  DailyAppointmentSummary,
  DailyAppointmentDetail,
} from "../types/reports.types";
import {
  useDailyAppointments,
  useDailyAppointmentDetails,
  extractList,
} from "../hooks/useReports";

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

const renderStatusChip = (status?: string) => {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Completed: {
      bg: "bg-green-50 border-green-200",
      text: "text-[#66BB6A]",
      dot: "bg-[#66BB6A]",
    },
    COMPLETED: {
      bg: "bg-green-50 border-green-200",
      text: "text-[#66BB6A]",
      dot: "bg-[#66BB6A]",
    },
    Scheduled: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-[#0D47A1]",
      dot: "bg-[#0D47A1]",
    },
    SCHEDULED: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-[#0D47A1]",
      dot: "bg-[#0D47A1]",
    },
    BOOKED: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-[#0D47A1]",
      dot: "bg-[#0D47A1]",
    },
    CONFIRMED: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-[#0D47A1]",
      dot: "bg-[#0D47A1]",
    },
    Waiting: {
      bg: "bg-teal-50 border-teal-200",
      text: "text-[#009688]",
      dot: "bg-[#009688]",
    },
    WAITING: {
      bg: "bg-teal-50 border-teal-200",
      text: "text-[#009688]",
      dot: "bg-[#009688]",
    },
    CHECKED_IN: {
      bg: "bg-teal-50 border-teal-200",
      text: "text-[#009688]",
      dot: "bg-[#009688]",
    },
    IN_CONSULTATION: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    },
    Cancelled: {
      bg: "bg-red-50 border-red-200",
      text: "text-[#EF4444]",
      dot: "bg-[#EF4444]",
    },
    CANCELLED: {
      bg: "bg-red-50 border-red-200",
      text: "text-[#EF4444]",
      dot: "bg-[#EF4444]",
    },
    "No Show": {
      bg: "bg-amber-50 border-amber-200",
      text: "text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    },
    NO_SHOW: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    },
  };
  const defaultStyle = {
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };
  const style = (status && map[status]) || defaultStyle;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status || "Unknown"}
    </span>
  );
};

export function DailyAppointmentReportScreen({
  onBack,
}: {
  onBack?: () => void;
  onOpenPatientReport?: () => void;
  onOpenDoctorReport?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All Visit Types");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, ] = useTransition();
  const [showLoadingDemo, ] = useState(false);
  const isLoading = isPending || showLoadingDemo;
  const [hasError, setHasError] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">(
    "pdf",
  );
  const [exportScope, setExportScope] = useState<
    "page" | "filtered" | "complete"
  >("filtered");
  const [includeOptions, setIncludeOptions] = useState({
    kpi: true,
    charts: true,
    tables: true,
    filters: true,
  });
  const [trendToggle, setTrendToggle] = useState<
    "Today" | "7 Days" | "30 Days"
  >("Today");
  const [sortField, setSortField] =
    useState<keyof AppointmentReportRecord>("appointmentTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
  const { data: rawSummary } = useDailyAppointments(reportFilters);
  const { data: rawDetails } = useDailyAppointmentDetails(reportFilters);

  const detailList = useMemo(
    () => extractList<DailyAppointmentDetail>(rawDetails),
    [rawDetails],
  );
  const summaryList = useMemo(
    () => extractList<DailyAppointmentSummary>(rawSummary),
    [rawSummary],
  );

  const totalAppointments = useMemo(() => {
    if (summaryList.length > 0) {
      return summaryList.reduce(
        (sum, d) => sum + (d.totalAppointments || 0),
        0,
      );
    }
    return detailList.length;
  }, [summaryList, detailList]);

  const completedAppointments = useMemo(() => {
    if (summaryList.length > 0) {
      return summaryList.reduce(
        (sum, d) => sum + (d.completedAppointments || 0),
        0,
      );
    }
    return detailList.filter(
      (d) => d.status === "Completed" || d.status === "COMPLETED",
    ).length;
  }, [summaryList, detailList]);

  const cancelledAppointments = useMemo(() => {
    if (summaryList.length > 0) {
      return summaryList.reduce(
        (sum, d) => sum + (d.cancelledAppointments || 0),
        0,
      );
    }
    return detailList.filter(
      (d) => d.status === "Cancelled" || d.status === "CANCELLED",
    ).length;
  }, [summaryList, detailList]);

  const pendingAppointments = useMemo(() => {
    if (summaryList.length > 0) {
      return summaryList.reduce(
        (sum, d) => sum + (d.pendingAppointments || 0),
        0,
      );
    }
    return detailList.filter(
      (d) =>
        d.status !== "Completed" &&
        d.status !== "COMPLETED" &&
        d.status !== "Cancelled" &&
        d.status !== "CANCELLED",
    ).length;
  }, [summaryList, detailList]);

  const completionRate =
    totalAppointments > 0
      ? ((completedAppointments / totalAppointments) * 100).toFixed(1)
      : "--";
  const cancellationRate =
    totalAppointments > 0
      ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1)
      : "--";
  const noShowRate =
    totalAppointments > 0
      ? ((pendingAppointments / totalAppointments) * 100).toFixed(1)
      : "--";

  // Map API detail records to table format
  const tableDataSource = useMemo(() => {
    return detailList.map((d: DailyAppointmentDetail) => ({
      id: d.appointmentNumber || `APT-${d.appointmentId || ""}`,
      patientName: d.patientName || "N/A",
      mrn: d.mrn
        ? String(d.mrn).startsWith("MRN-")
          ? String(d.mrn)
          : `MRN-${d.mrn}`
        : `MRN-${d.patientId || ""}`,
      doctorName: d.doctorName || "N/A",
      department: d.department || "General Medicine",
      appointmentDate: d.appointmentDate || d.date || today,
      appointmentTime: d.appointmentTime || "09:00 AM",
      visitType: (d.appointmentType ||
        d.visitType ||
        "New Visit") as AppointmentReportRecord["visitType"],
      status: (d.status
        ? d.status.charAt(0) + d.status.slice(1).toLowerCase()
        : "Scheduled") as AppointmentReportRecord["status"],
    }));
  }, [detailList, today]);

  // Status distribution for pie chart
  const statusDistFromApi = useMemo(() => {
    if (summaryList.length > 0) {
      return [
        {
          name: "Completed",
          value: summaryList.reduce(
            (s: number, d: DailyAppointmentSummary) =>
              s + (d.completedAppointments || 0),
            0,
          ),
          color: "#66BB6A",
        },
        {
          name: "Scheduled",
          value: summaryList.reduce(
            (s: number, d: DailyAppointmentSummary) =>
              s + (d.pendingAppointments || 0),
            0,
          ),
          color: "#0D47A1",
        },
        { name: "Waiting", value: 0, color: "#4DB6AC" },
        {
          name: "Cancelled",
          value: summaryList.reduce(
            (s: number, d: DailyAppointmentSummary) =>
              s + (d.cancelledAppointments || 0),
            0,
          ),
          color: "#EF4444",
        },
        { name: "No Show", value: 0, color: "#F59E0B" },
      ];
    }
    return [
      { name: "Completed", value: completedAppointments, color: "#66BB6A" },
      { name: "Scheduled", value: pendingAppointments, color: "#0D47A1" },
      { name: "Waiting", value: 0, color: "#4DB6AC" },
      { name: "Cancelled", value: cancelledAppointments, color: "#EF4444" },
      { name: "No Show", value: 0, color: "#F59E0B" },
    ];
  }, [
    summaryList,
    completedAppointments,
    pendingAppointments,
    cancelledAppointments,
  ]);

  const appointmentTrendData = useMemo(() => {
    if (summaryList.length > 0) {
      return summaryList.map((d: DailyAppointmentSummary) => ({
        date: d.date,
        Booked: d.totalAppointments || 0,
        Completed: d.completedAppointments || 0,
        Cancelled: d.cancelledAppointments || 0,
      }));
    }
    // Derive trend from detail list grouped by date
    const map: Record<
      string,
      { date: string; Booked: number; Completed: number; Cancelled: number }
    > = {};
    detailList.forEach((d: DailyAppointmentDetail) => {
      const date = (d.appointmentDate || d.date || today).slice(0, 10);
      if (!map[date])
        map[date] = { date, Booked: 0, Completed: 0, Cancelled: 0 };
      map[date].Booked += 1;
      if (d.status === "Completed" || d.status === "COMPLETED")
        map[date].Completed += 1;
      if (d.status === "Cancelled" || d.status === "CANCELLED")
        map[date].Cancelled += 1;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [summaryList, detailList, today]);

  const walkInTrendData = useMemo(() => {
    if (summaryList.length > 0) {
      return summaryList.map((d: DailyAppointmentSummary) => ({
        date: d.date,
        Waiting: d.pendingAppointments || 0,
      }));
    }
    const map: Record<string, { date: string; Waiting: number }> = {};
    detailList.forEach((d: DailyAppointmentDetail) => {
      const date = (d.appointmentDate || d.date || today).slice(0, 10);
      if (!map[date]) map[date] = { date, Waiting: 0 };
      if (
        d.status !== "Completed" &&
        d.status !== "COMPLETED" &&
        d.status !== "Cancelled" &&
        d.status !== "CANCELLED"
      )
        map[date].Waiting += 1;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [summaryList, detailList, today]);

  const hourlyTrendData = useMemo(() => {
    const hourMap: Record<
      number,
      { hour: string; Booked: number; Completed: number; Cancelled: number }
    > = {};
    detailList.forEach((d: DailyAppointmentDetail) => {
      const dateStr = d.appointmentTime || d.appointmentDate;
      const h = dateStr ? new Date(dateStr).getHours() : 9;
      const validHour = isNaN(h) ? 9 : h;
      if (!hourMap[validHour])
        hourMap[validHour] = {
          hour: `${validHour}:00`,
          Booked: 0,
          Completed: 0,
          Cancelled: 0,
        };
      hourMap[validHour].Booked += 1;
      if (d.status === "Completed" || d.status === "COMPLETED")
        hourMap[validHour].Completed += 1;
      if (d.status === "Cancelled" || d.status === "CANCELLED")
        hourMap[validHour].Cancelled += 1;
    });
    return Object.values(hourMap).sort((a, b) => a.hour.localeCompare(b.hour));
  }, [detailList]);

  const doctorWorkloadData = useMemo(() => {
    const map: Record<
      string,
      { doctor: string; assigned: number; completed: number }
    > = {};
    detailList.forEach((d: DailyAppointmentDetail) => {
      const doc = d.doctorName || "Unassigned";
      if (!map[doc]) map[doc] = { doctor: doc, assigned: 0, completed: 0 };
      map[doc].assigned += 1;
      if (d.status === "Completed" || d.status === "COMPLETED")
        map[doc].completed += 1;
    });
    return Object.values(map);
  }, [detailList]);

  const deptVolumeData = useMemo(() => {
    const map: Record<
      string,
      { department: string; appointments: number; completed: number }
    > = {};
    detailList.forEach((d: DailyAppointmentDetail) => {
      const dept = d.department || "General Medicine";
      if (!map[dept])
        map[dept] = {
          department: dept,
          appointments: 0,
          completed: 0,
        };
      map[dept].appointments += 1;
      if (d.status === "Completed" || d.status === "COMPLETED")
        map[dept].completed += 1;
    });
    return Object.values(map);
  }, [detailList]);

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
    setVisitTypeFilter("All Visit Types");
    setShiftFilter("All Shifts");
  };

  const filteredData = useMemo(() => {
    return tableDataSource.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept =
        deptFilter === "All Departments" || item.department === deptFilter;
      const matchesDoctor =
        doctorFilter === "All Doctors" || item.doctorName === doctorFilter;
      const matchesStatus =
        statusFilter === "All Statuses" || item.status === statusFilter;
      const matchesVisit =
        visitTypeFilter === "All Visit Types" ||
        item.visitType === visitTypeFilter;
      return (
        matchesSearch &&
        matchesDept &&
        matchesDoctor &&
        matchesStatus &&
        matchesVisit
      );
    });
  }, [
    searchQuery,
    deptFilter,
    doctorFilter,
    statusFilter,
    visitTypeFilter,
    tableDataSource,
  ]);

  const sortedData = useMemo(() => {
    return filteredData.toSorted((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortOrder === "asc") return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });
  }, [filteredData, sortField, sortOrder]);

  const handleSort = (field: keyof AppointmentReportRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div
      className="w-full flex-1 min-h-screen bg-[#F1F5F9] text-[#111827] pb-12"
      style={{ fontFamily: RB }}
    >
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
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200">
                  OPD Phase 1 Verified
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monitor appointment trends, patient visits and doctor schedules.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 border border-[#E5E7EB] px-3 py-2 rounded-xl mr-1">
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-slate-50 transition shadow-sm"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#0D47A1] ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-slate-50 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#0D47A1]" />
                <span>Print Report</span>
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0D47A1] hover:bg-blue-900 transition shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              aria-label="Input field"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Appointment ID, Patient Name, MRN, Doctor, Department..."
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

        {/* TOP 6 KPI CARDS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748B]">
                Total Appointments
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-[#0D47A1]">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mb-1"
              style={{ fontFamily: PP }}
            >
              {totalAppointments}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
              <span className="text-[#64748B] font-semibold">--</span>
            </div>
            {appointmentTrendData.length > 0 && (
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentTrendData}>
                    <Line
                      type="monotone"
                      dataKey="Booked"
                      stroke="#0D47A1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-shadow">
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
              {completedAppointments}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
              <span className="text-[#66BB6A] font-semibold">
                {completionRate}% Completion Rate
              </span>
            </div>
            {appointmentTrendData.length > 0 && (
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={appointmentTrendData}>
                    <Area
                      type="monotone"
                      dataKey="Completed"
                      stroke="#66BB6A"
                      fill="#66BB6A"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748B]">
                Cancelled Appointments
              </span>
              <div className="p-2 rounded-xl bg-red-50 text-[#EF4444]">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mb-1"
              style={{ fontFamily: PP }}
            >
              {cancelledAppointments}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
              <span className="text-[#EF4444] font-semibold">
                {cancellationRate}% Cancellation Rate
              </span>
            </div>
            {appointmentTrendData.length > 0 && (
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentTrendData}>
                    <Line
                      type="monotone"
                      dataKey="Cancelled"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748B]">
                No Show Patients
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mb-1"
              style={{ fontFamily: PP }}
            >
              {pendingAppointments}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
              <span className="text-[#F59E0B] font-semibold">
                {noShowRate}% of total booked
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-2">
              Missed scheduled slots without cancellation
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#64748B]">
                Walk-In Patients
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mb-1"
              style={{ fontFamily: PP }}
            >
              --
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
              <span className="text-[#64748B] font-semibold">--</span>
            </div>
            <div className="h-8">
              {walkInTrendData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={walkInTrendData}>
                    <Line
                      type="monotone"
                      dataKey="Waiting"
                      stroke="#009688"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#64748B]">
                Average Waiting Time
              </span>
              <div
                className="text-2xl font-bold text-[#111827] mt-1"
                style={{ fontFamily: PP }}
              >
                --
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Consult delay: --
              </p>
              <div className="mt-1 text-[11px] font-semibold text-[#64748B]">
                --
              </div>
            </div>
            <CircularProgress percentage={0} size={64} strokeWidth={7} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
          <div
            className="flex items-center gap-2 mb-3 text-xs font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            <Filter className="w-4 h-4 text-[#009688]" />
            <span>Filter Appointment Analytics</span>
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
                Appointment Status
                <select
                  aria-label="Select option"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                >
                  <option>All Statuses</option>
                  <option>Completed</option>
                  <option>Scheduled</option>
                  <option>Waiting</option>
                  <option>Cancelled</option>
                  <option>No Show</option>
                </select>
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-[#64748B] mb-1">
                Visit Type
                <select
                  aria-label="Select option"
                  value={visitTypeFilter}
                  onChange={(e) => setVisitTypeFilter(e.target.value)}
                  className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                >
                  <option>All Visit Types</option>
                  <option>New Visit</option>
                  <option>Follow-up</option>
                  <option>Walk-in</option>
                  <option>Emergency</option>
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
                  <option>Morning (08 AM - 02 PM)</option>
                  <option>Evening (02 PM - 08 PM)</option>
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

        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-center">
            <AlertCircle className="w-10 h-10 text-[#EF4444] mx-auto mb-2" />
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Unable to Load Appointment Reports
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Connection timeout while communicating with OPD appointment
              database. Please retry.
            </p>
            <button
              onClick={() => setHasError(false)}
              className="mt-4 px-4 py-2 bg-[#EF4444] text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition"
            >
              Retry Loading
            </button>
          </div>
        )}

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
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Appointment Status Breakdown
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Percentage distribution across all status types
                      </p>
                    </div>
                    <PieChartIcon className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={statusDistFromApi}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusDistFromApi.map((entry) => (
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
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Hourly Appointment Trend
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Booked vs completed volume across hours
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-lg border text-[10px]">
                      <button
                        onClick={() => setTrendToggle("Today")}
                        className={`px-2 py-0.5 rounded font-medium ${trendToggle === "Today" ? "bg-white text-[#0D47A1]" : "text-[#64748B]"}`}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setTrendToggle("7 Days")}
                        className={`px-2 py-0.5 rounded font-medium ${trendToggle === "7 Days" ? "bg-white text-[#0D47A1]" : "text-[#64748B]"}`}
                      >
                        7 Days
                      </button>
                    </div>
                  </div>
                  <div className="h-60">
                    {hourlyTrendData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={hourlyTrendData}
                          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#F1F5F9"
                          />
                          <XAxis
                            dataKey="hour"
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
                          <Legend
                            verticalAlign="top"
                            height={26}
                            wrapperStyle={{ fontSize: "10px" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Booked"
                            stroke="#0D47A1"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="Completed"
                            stroke="#66BB6A"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="Cancelled"
                            stroke="#EF4444"
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Doctor Appointment Workload
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Assigned vs completed consultations per doctor
                      </p>
                    </div>
                    <UserCheck className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    {doctorWorkloadData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={doctorWorkloadData}
                          margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#F1F5F9"
                          />
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
                            dataKey="assigned"
                            name="Assigned"
                            fill="#0D47A1"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Department Appointment Volume
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Appointments vs cancellations per department
                      </p>
                    </div>
                    <Building2 className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    {deptVolumeData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={deptVolumeData}
                          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#F1F5F9"
                          />
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
                          <Legend
                            verticalAlign="top"
                            height={26}
                            wrapperStyle={{ fontSize: "10px" }}
                          />
                          <Bar
                            dataKey="appointments"
                            name="Appointments"
                            fill="#0D47A1"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="completed"
                            name="Completed"
                            fill="#66BB6A"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Appointment Report Register
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Complete list of OPD appointment records with real-time
                      status
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      alert("Exporting Appointment Table Register (CSV)...")
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] text-xs font-semibold text-[#111827] rounded-xl hover:bg-slate-100 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0D47A1]" />
                    <span>Export Data</span>
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
                          onClick={() => handleSort("id")}
                        >
                          Appointment ID{" "}
                          {sortField === "id" &&
                            (sortOrder === "asc" ? "↑" : "↓")}
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
                          onClick={() => handleSort("patientName")}
                        >
                          Patient Name{" "}
                          {sortField === "patientName" &&
                            (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Doctor</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Visit Type</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {sortedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className="py-8 text-center text-[#64748B]"
                          >
                            No appointment records match the selected filter
                            criteria.
                          </td>
                        </tr>
                      ) : (
                        sortedData.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                              {item.id}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#111827]">
                              {item.patientName}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.mrn}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-[#111827]">
                              {item.doctorName}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.department}
                            </td>
                            <td className="py-3.5 px-4 text-[#111827]">
                              <div>{item.appointmentDate}</div>
                              <div className="text-[10px] text-[#64748B]">
                                {item.appointmentTime}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-[#64748B] text-[10px] font-medium">
                                {item.visitType}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {renderStatusChip(item.status)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() =>
                                    alert(`Details for appointment ${item.id}`)
                                  }
                                  className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    alert(`Printing summary for ${item.id}`)
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
            </div>
          )}

        <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <div>
            Showing{" "}
            <strong className="text-[#111827]">
              {filteredData.length} Appointment Report Results
            </strong>
          </div>
          <div>Hospital Management System • Daily Appointment Report v1.0</div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">
              {new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </div>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl relative transition-opacity duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Export Daily Appointment Report
              </h3>
              <button
                aria-label="Download"
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
              <div>
                <span
                  className="block font-semibold text-[#111827] mb-2"
                  style={{ fontFamily: PP }}
                >
                  Export Format
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${exportFormat === "pdf" ? "bg-blue-50 border-[#0D47A1] text-[#0D47A1] font-semibold" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={exportFormat === "pdf"}
                      onChange={() => setExportFormat("pdf")}
                      className="accent-[#0D47A1]"
                    />
                    <span>PDF</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${exportFormat === "excel" ? "bg-teal-50 border-[#009688] text-[#009688] font-semibold" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      checked={exportFormat === "excel"}
                      onChange={() => setExportFormat("excel")}
                      className="accent-[#009688]"
                    />
                    <span>Excel</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${exportFormat === "csv" ? "bg-slate-100 border-slate-400 text-[#111827] font-semibold" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={() => setExportFormat("csv")}
                      className="accent-slate-700"
                    />
                    <span>CSV</span>
                  </label>
                </div>
              </div>
              <div>
                <span
                  className="block font-semibold text-[#111827] mb-2"
                  style={{ fontFamily: PP }}
                >
                  Export Scope
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exportScope"
                      value="page"
                      checked={exportScope === "page"}
                      onChange={() => setExportScope("page")}
                      className="accent-[#0D47A1]"
                    />
                    <span>Current Page</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exportScope"
                      value="filtered"
                      checked={exportScope === "filtered"}
                      onChange={() => setExportScope("filtered")}
                      className="accent-[#0D47A1]"
                    />
                    <span>Filtered Data</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="exportScope"
                      value="complete"
                      checked={exportScope === "complete"}
                      onChange={() => setExportScope("complete")}
                      className="accent-[#0D47A1]"
                    />
                    <span>Complete</span>
                  </label>
                </div>
              </div>
              {exportFormat !== "csv" && (
                <div>
                  <span
                    className="block font-semibold text-[#111827] mb-2"
                    style={{ fontFamily: PP }}
                  >
                    Include Options
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeOptions.kpi}
                        onChange={(e) =>
                          setIncludeOptions({
                            ...includeOptions,
                            kpi: e.target.checked,
                          })
                        }
                        className="accent-[#0D47A1]"
                      />
                      <span>KPI Summary</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeOptions.charts}
                        onChange={(e) =>
                          setIncludeOptions({
                            ...includeOptions,
                            charts: e.target.checked,
                          })
                        }
                        className="accent-[#0D47A1]"
                      />
                      <span>Charts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeOptions.tables}
                        onChange={(e) =>
                          setIncludeOptions({
                            ...includeOptions,
                            tables: e.target.checked,
                          })
                        }
                        className="accent-[#0D47A1]"
                      />
                      <span>Tables</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeOptions.filters}
                        onChange={(e) =>
                          setIncludeOptions({
                            ...includeOptions,
                            filters: e.target.checked,
                          })
                        }
                        className="accent-[#0D47A1]"
                      />
                      <span>Applied Filters</span>
                    </label>
                  </div>
                </div>
              )}
              <div>
                <span
                  className="block font-semibold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  File Name
                </span>
                <div className="p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl font-mono text-xs text-[#0D47A1] font-semibold">
                  Daily_Appointment_Report_{dateRange.replace(/\s+/g, "_")}.
                  {exportFormat === "excel" ? "xlsx" : exportFormat}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB] mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#64748B] rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(
                    `Exporting Daily Appointment Report as ${exportFormat.toUpperCase()}...`,
                  );
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 transition shadow-sm flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Download size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
