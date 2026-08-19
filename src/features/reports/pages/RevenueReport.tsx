import React, { useState, useMemo } from "react";
import {
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Clock,
  PieChart as PieChartIcon,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  DollarSign,
  TrendingUp,
  Building2,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  CreditCard,
  Eye,
} from "lucide-react";
import { PP, RB } from "../constants/reports.constants";
import type { RevenueReportRecord, DailyRevenuePoint, DailyRevenueDetail } from "../types/reports.types";
import {
  useDailyRevenue,
  useDailyRevenueDetails,
  useCollectionRate,
  extractList,
} from "../hooks/useReports";

import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "../../../common/components/recharts-lazy";

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

export function DailyRevenueReportScreen({
  onBack,
}: {
  onBack?: () => void;
  onOpenBillingReport?: () => void;
}) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState("All Statuses");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All Methods");
  const [reportPeriodFilter, setReportPeriodFilter] = useState("Daily");

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
    if (range === "90 Days") {
      const from = new Date(now);
      from.setDate(now.getDate() - 90);
      return { fromDate: from.toISOString().slice(0, 10), toDate: today };
    }
    return { fromDate: today, toDate: today };
  };
  const reportFilters = getDateRange(dateRange);
  const { data: rawDailyRevenue } = useDailyRevenue(reportFilters);
  const { data: rawDetails } = useDailyRevenueDetails(reportFilters);
  const { data: collectionRateData } = useCollectionRate(reportFilters);

  const dailyRevenueData = useMemo(() => extractList<DailyRevenuePoint>(rawDailyRevenue), [rawDailyRevenue]);
  const revenueDetailsList = useMemo(() => extractList<DailyRevenueDetail>(rawDetails), [rawDetails]);

  const revenueTableSource = useMemo(() => {
    return revenueDetailsList.map((d: DailyRevenueDetail) => ({
      id: d.paymentId || d.receiptNumber || d.invoiceNumber || `INV-${d.id || ""}`,
      patientName: d.patientName ?? d.receiptNumber ?? "N/A",
      mrn: d.mrn ? (String(d.mrn).startsWith("MRN-") ? String(d.mrn) : `MRN-${d.mrn}`) : `MRN-${d.patientId || ""}`,
      doctorName: d.doctorName ?? "N/A",
      department: d.department ?? "General Medicine",
      invoiceDate: d.paidAt || d.invoiceDate || d.createdDate || today,
      invoiceAmount: Number(d.amount || d.billedAmount || d.totalAmount || 0),
      collectedAmount: Number(d.paidAmount || d.amount || d.collectedAmount || 0),
      outstandingAmount: Number(d.outstandingAmount || 0),
      paymentMethod: (d.paymentMethod as RevenueReportRecord["paymentMethod"]) ?? "Cash",
      paymentStatus: (d.paymentStatus
        ? d.paymentStatus.charAt(0) + d.paymentStatus.slice(1).toLowerCase()
        : "Paid") as RevenueReportRecord["paymentStatus"],
    }));
  }, [revenueDetailsList, today]);

  // Map API daily revenue to trend chart format
  const trendSource = dailyRevenueData.map((d) => ({
    date: d.date,
    amount: d.amount,
    Revenue: d.amount,
    Collections: Math.round(d.amount * 0.93),
    Outstanding: Math.round(d.amount * 0.07),
  }));

  const paymentMethodShareData = useMemo(() => {
    const map: Record<string, number> = {};
    revenueTableSource.forEach((d) => {
      map[d.paymentMethod] = (map[d.paymentMethod] || 0) + d.collectedAmount;
    });
    const colors: Record<string, string> = {
      Cash: "#009688",
      Card: "#0D47A1",
      UPI: "#66BB6A",
      "Bank Transfer": "#F59E0B",
    };
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || "#64748B",
    }));
  }, [revenueTableSource]);

  const deptRevenueData = useMemo(() => {
    const map: Record<string, { department: string; revenue: number }> = {};
    revenueTableSource.forEach((d) => {
      if (!map[d.department])
        map[d.department] = { department: d.department, revenue: 0 };
      map[d.department].revenue += d.invoiceAmount;
    });
    return Object.values(map);
  }, [revenueTableSource]);

  const doctorRevenueData = useMemo(() => {
    const map: Record<string, { doctor: string; revenue: number }> = {};
    revenueTableSource.forEach((d) => {
      if (!map[d.doctorName])
        map[d.doctorName] = { doctor: d.doctorName, revenue: 0 };
      map[d.doctorName].revenue += d.invoiceAmount;
    });
    return Object.values(map);
  }, [revenueTableSource]);

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
  const [isLoading, setIsLoading] = useState(false);
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
  const [trendDays, setTrendDays] = useState<
    "Today" | "7 Days" | "30 Days" | "90 Days"
  >("7 Days");

  // Table sorting & pagination
  const [sortField, setSortField] =
    useState<keyof RevenueReportRecord>("invoiceDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: "Today",
    dept: "All Departments",
    doctor: "All Doctors",
    paymentStatus: "All Statuses",
    paymentMethod: "All Methods",
    reportPeriod: "Daily",
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters({
        dateRange,
        dept: deptFilter,
        doctor: doctorFilter,
        paymentStatus: paymentStatusFilter,
        paymentMethod: paymentMethodFilter,
        reportPeriod: reportPeriodFilter,
      });
      setIsLoading(false);
    }, 300);
  };

  const handleResetFilters = () => {
    setDateRange("Today");
    setDeptFilter("All Departments");
    setDoctorFilter("All Doctors");
    setPaymentStatusFilter("All Statuses");
    setPaymentMethodFilter("All Methods");
    setReportPeriodFilter("Daily");
    setSearchQuery("");

    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters({
        dateRange: "Today",
        dept: "All Departments",
        doctor: "All Doctors",
        paymentStatus: "All Statuses",
        paymentMethod: "All Methods",
        reportPeriod: "Daily",
      });
      setIsLoading(false);
    }, 300);
  };

  // Computed KPI Card Values from API hooks
  const computedRevenueStats = useMemo(() => {
    const totalRev = collectionRateData?.totalBilled ?? 0;
    const collectedRev = collectionRateData?.totalCollected ?? 0;
    const outstanding = collectionRateData?.outstandingAmount ?? 0;
    const invoicesCount = revenueDetailsList.length ?? 0;
    return {
      totalRev,
      collectedRev,
      outstanding,
      invoicesCount,
      paidInvoices: 0,
      pendingInvoices: 0,
      voidInvoices: 0,
      avgValue: invoicesCount > 0 ? Math.round(totalRev / invoicesCount) : 0,
    };
  }, [collectionRateData, revenueDetailsList]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filtered records
  const filteredData = useMemo(() => {
    return revenueTableSource.filter((item) => {
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
        paymentStatusFilter === "All Statuses" ||
        item.paymentStatus === paymentStatusFilter;
      const matchesMethod =
        paymentMethodFilter === "All Methods" ||
        item.paymentMethod === paymentMethodFilter;

      return (
        matchesSearch &&
        matchesDept &&
        matchesDoctor &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [
    searchQuery,
    deptFilter,
    doctorFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    revenueTableSource,
  ]);

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

  const handleSort = (field: keyof RevenueReportRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Status Chip helper
  const renderStatusChip = (status?: string) => {
    const map: Record<
      string,
      { bg: string; text: string; dot: string }
    > = {
      Paid: {
        bg: "bg-green-50 border-green-200",
        text: "text-[#66BB6A]",
        dot: "bg-[#66BB6A]",
      },
      PAID: {
        bg: "bg-green-50 border-green-200",
        text: "text-[#66BB6A]",
        dot: "bg-[#66BB6A]",
      },
      "Partially Paid": {
        bg: "bg-blue-50 border-blue-200",
        text: "text-[#0D47A1]",
        dot: "bg-[#0D47A1]",
      },
      PARTIALLY_PAID: {
        bg: "bg-blue-50 border-blue-200",
        text: "text-[#0D47A1]",
        dot: "bg-[#0D47A1]",
      },
      Pending: {
        bg: "bg-amber-50 border-amber-200",
        text: "text-[#F59E0B]",
        dot: "bg-[#F59E0B]",
      },
      PENDING: {
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
                  Daily Revenue Report
                </span>
              </nav>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Daily Revenue Report
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#009688] border border-teal-200">
                  OPD Finance Verified
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monitor hospital revenue, collections and billing performance
                for Phase 1 operations.
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
        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Invoice ID, Patient, MRN, Doctor, Department..."
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
            <span>Filter Financial Analytics</span>
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
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Statuses</option>
                <option>Paid</option>
                <option>Partially Paid</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Methods</option>
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Report Period
              </label>
              <select
                value={reportPeriodFilter}
                onChange={(e) => setReportPeriodFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
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
              onClick={handleApplyFilters}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-white bg-[#009688] hover:bg-teal-700 transition shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* APPLIED FILTER CHIPS */}
        {(appliedFilters.dateRange !== "Today" ||
          appliedFilters.dept !== "All Departments" ||
          appliedFilters.doctor !== "All Doctors" ||
          appliedFilters.paymentStatus !== "All Statuses" ||
          appliedFilters.paymentMethod !== "All Methods" ||
          searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap mb-4 bg-white p-3 rounded-2xl border border-[#E5E7EB] text-xs">
            <span
              className="font-semibold text-[#64748B] mr-1"
              style={{ fontFamily: PP }}
            >
              Applied Filters:
            </span>
            {appliedFilters.dateRange !== "Today" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#0D47A1] border border-blue-200 font-medium">
                Period: {appliedFilters.dateRange}
                <button
                  onClick={() => {
                    setDateRange("Today");
                    setAppliedFilters((prev) => ({
                      ...prev,
                      dateRange: "Today",
                    }));
                  }}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  Ã—
                </button>
              </span>
            )}
            {appliedFilters.dept !== "All Departments" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-[#009688] border border-teal-200 font-medium">
                Dept: {appliedFilters.dept}
                <button
                  onClick={() => {
                    setDeptFilter("All Departments");
                    setAppliedFilters((prev) => ({
                      ...prev,
                      dept: "All Departments",
                    }));
                  }}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  Ã—
                </button>
              </span>
            )}
            {appliedFilters.doctor !== "All Doctors" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#66BB6A] border border-emerald-200 font-medium">
                Doctor: {appliedFilters.doctor}
                <button
                  onClick={() => {
                    setDoctorFilter("All Doctors");
                    setAppliedFilters((prev) => ({
                      ...prev,
                      doctor: "All Doctors",
                    }));
                  }}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  Ã—
                </button>
              </span>
            )}
            {appliedFilters.paymentStatus !== "All Statuses" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200 font-medium">
                Status: {appliedFilters.paymentStatus}
                <button
                  onClick={() => {
                    setPaymentStatusFilter("All Statuses");
                    setAppliedFilters((prev) => ({
                      ...prev,
                      paymentStatus: "All Statuses",
                    }));
                  }}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  Ã—
                </button>
              </span>
            )}
            {appliedFilters.paymentMethod !== "All Methods" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                Method: {appliedFilters.paymentMethod}
                <button
                  onClick={() => {
                    setPaymentMethodFilter("All Methods");
                    setAppliedFilters((prev) => ({
                      ...prev,
                      paymentMethod: "All Methods",
                    }));
                  }}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  Ã—
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[#111827] border border-slate-300 font-medium">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  Ã—
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#EF4444] font-semibold hover:underline ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* State Controls for Demo */}
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
              className={`px-2.5 py-1 rounded-lg border text-xs ${hasError ? "bg-red-50 border-red-300 text-[#EF4444]" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
            >
              Toggle Error State
            </button>
          </div>
          <span className="text-[11px] text-[#64748B]">
            Simulate real-time billing states
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
              Unable to Load Revenue Reports
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Network error encountered while fetching financial summaries.
              Please retry.
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
                {/* Card 1: Today's Revenue */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Today's Revenue
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#66BB6A]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    {formatCurrency(computedRevenueStats.totalRev)}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#66BB6A] font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> --
                    </span>
                    <span>vs period average</span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendSource}>
                        <Line
                          type="monotone"
                          dataKey="Revenue"
                          stroke="#66BB6A"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 2: Collected Revenue */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Collected Revenue
                    </span>
                    <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    {formatCurrency(computedRevenueStats.collectedRev)}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#009688] font-semibold">
                      {(
                        (computedRevenueStats.collectedRev /
                          (computedRevenueStats.totalRev || 1)) *
                        100
                      ).toFixed(1)}
                      % Collection Rate
                    </span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendSource}>
                        <Area
                          type="monotone"
                          dataKey="Collections"
                          stroke="#009688"
                          fill="#009688"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 3: Outstanding Amount */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Outstanding Amount
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    {formatCurrency(computedRevenueStats.outstanding)}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#F59E0B] font-semibold">
                      {(
                        (computedRevenueStats.outstanding /
                          (computedRevenueStats.totalRev || 1)) *
                        100
                      ).toFixed(1)}
                      % Outstanding Rate
                    </span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendSource}>
                        <Line
                          type="monotone"
                          dataKey="Outstanding"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 4: Invoices Summary */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Invoices Generated
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0D47A1]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    {computedRevenueStats.invoicesCount}
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center mt-1">
                    <div>
                      <div className="text-[#66BB6A] font-bold">
                        {computedRevenueStats.paidInvoices}
                      </div>
                      <div className="text-[#64748B]">Paid</div>
                    </div>
                    <div>
                      <div className="text-[#F59E0B] font-bold">
                        {computedRevenueStats.pendingInvoices}
                      </div>
                      <div className="text-[#64748B]">Pending</div>
                    </div>
                    <div>
                      <div className="text-[#64748B] font-bold">
                        {computedRevenueStats.voidInvoices}
                      </div>
                      <div className="text-[#64748B]">Void</div>
                    </div>
                  </div>
                </div>

                {/* Card 5: Payment Methods Stack */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Payment Methods
                    </span>
                    <div className="p-2 rounded-xl bg-[#F1F5F9] text-[#0D47A1]">
                      <PieChart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#111827] mb-1">
                    Cash: -- | Card: --
                  </div>
                  <div className="text-[11px] text-[#64748B] mb-2">
                    UPI: -- | Bank: --
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                    <div
                      className="bg-[#009688] h-full"
                      style={{ width: "35%" }}
                    />
                    <div
                      className="bg-[#0D47A1] h-full"
                      style={{ width: "32%" }}
                    />
                    <div
                      className="bg-[#4DB6AC] h-full"
                      style={{ width: "26%" }}
                    />
                    <div
                      className="bg-[#66BB6A] h-full"
                      style={{ width: "7%" }}
                    />
                  </div>
                </div>

                {/* Card 6: Average Invoice Value */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#64748B]">
                      Avg Invoice Value
                    </span>
                    <div
                      className="text-2xl font-bold text-[#111827] mt-1"
                      style={{ fontFamily: PP }}
                    >
                      {formatCurrency(computedRevenueStats.avgValue)}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Highest: -- | Min: --
                    </p>
                    <div className="mt-1 text-[11px] font-semibold text-[#0D47A1]">
                      âœ" OPD Fee Benchmark
                    </div>
                  </div>
                  <CircularProgress
                    percentage={collectionRateData?.collectionRate ?? 0}
                    size={64}
                    strokeWidth={7}
                  />
                </div>
              </div>

              {/* REVENUE TREND AREA CHART */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Revenue & Collection Trend
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Daily comparative tracking of total revenue vs collected
                      cash flow
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] text-xs">
                    {(["Today", "7 Days", "30 Days", "90 Days"] as const).map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => setTrendDays(t)}
                          className={`px-3 py-1 rounded-lg font-medium transition ${trendDays === t ? "bg-white text-[#0D47A1] shadow-sm" : "text-[#64748B]"}`}
                        >
                          {t}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendSource}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevGrad"
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
                          id="colorCollGrad"
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
                        dataKey="Revenue"
                        stroke="#0D47A1"
                        fillOpacity={1}
                        fill="url(#colorRevGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Collections"
                        stroke="#66BB6A"
                        fillOpacity={1}
                        fill="url(#colorCollGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* REVENUE VS COLLECTIONS & PAYMENT METHOD DISTRIBUTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grouped Bar Revenue vs Collections */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Revenue vs Collections
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Billed vs collected amount per day
                      </p>
                    </div>
                    <DollarSign className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={trendSource}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
                        <Legend
                          verticalAlign="top"
                          height={26}
                          wrapperStyle={{ fontSize: "10px" }}
                        />
                        <Bar
                          dataKey="Revenue"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="Collections"
                          fill="#66BB6A"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Payment Method Distribution Donut */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Payment Method Share
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Collection split across payment modes
                      </p>
                    </div>
                    <CreditCard className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    {paymentMethodShareData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={paymentMethodShareData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {paymentMethodShareData.map((entry) => (
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
                     )}
                   </div>
                 </div>
               </div>

              {/* DEPARTMENT REVENUE & DOCTOR REVENUE CONTRIBUTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Revenue Horizontal Bar */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Department Revenue Breakdown
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Total billing per specialty department
                      </p>
                    </div>
                    <Building2 className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    {deptRevenueData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={deptRevenueData}
                          margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#64748B" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="department"
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
                          dataKey="revenue"
                          fill="#009688"
                          radius={[0, 4, 4, 0]}
                        />
                       </BarChart>
                     </ResponsiveContainer>
                     )}
                   </div>
                 </div>

                {/* Doctor Revenue Contribution Vertical Bar */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Doctor Revenue Contribution
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Top revenue generating doctors
                      </p>
                    </div>
                    <UserCheck className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    {doctorRevenueData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={doctorRevenueData}
                          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="doctor"
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
                          dataKey="revenue"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                       </BarChart>
                     </ResponsiveContainer>
                     )}
                   </div>
                 </div>
               </div>

              {/* REVENUE REPORT TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Daily Billing Register
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Detailed OPD invoice transactions and payment collection
                      ledger
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Exporting Billing Register (CSV)...")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] text-xs font-semibold text-[#111827] rounded-xl hover:bg-slate-100 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0D47A1]" />
                    <span>Export Ledger</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F1F5F9] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E5E7EB]">
                        <th
                          className="py-3.5 px-4 cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("id")}
                        >
                          Invoice ID{" "}
                          {sortField === "id" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th
                          className="py-3.5 px-4 cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("patientName")}
                        >
                          Patient{" "}
                          {sortField === "patientName" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Doctor</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th
                          className="py-3.5 px-4 text-right cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("invoiceAmount")}
                        >
                          Billed{" "}
                          {sortField === "invoiceAmount" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th className="py-3.5 px-4 text-right">Collected</th>
                        <th className="py-3.5 px-4 text-center">Method</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {sortedData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={10}
                            className="py-8 text-center text-[#64748B]"
                          >
                            No billing records match the selected filter
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
                            <td className="py-3.5 px-4 text-right font-bold text-[#111827]">
                              {formatCurrency(item.invoiceAmount)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-semibold text-[#66BB6A]">
                              {formatCurrency(item.collectedAmount)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-[#64748B] text-[10px] font-medium">
                                {item.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {renderStatusChip(item.paymentStatus)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() =>
                                    alert(`Viewing invoice ${item.id}`)
                                  }
                                  className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                  title="View Invoice"
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
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <div>
            Showing{" "}
            <strong className="text-[#111827]">
              {filteredData.length} Revenue Report Results
            </strong>
          </div>
          <div>Hospital Management System â€¢ Daily Revenue Report v1.0</div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">{lastRefreshed}</strong>
          </div>
        </div>
      </div>

      {/* ENTERPRISE EXPORT REPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Export Daily Revenue Report
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 transition"
              >
                âœ•
              </button>
            </div>

            <div className="space-y-4 text-xs" style={{ fontFamily: RB }}>
              <div>
                <label
                  className="block font-semibold text-[#111827] mb-2"
                  style={{ fontFamily: PP }}
                >
                  Export Format
                </label>
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
                <label
                  className="block font-semibold text-[#111827] mb-2"
                  style={{ fontFamily: PP }}
                >
                  Export Scope
                </label>
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
                  <label
                    className="block font-semibold text-[#111827] mb-2"
                    style={{ fontFamily: PP }}
                  >
                    Include Options
                  </label>
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
                <label
                  className="block font-semibold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  File Name
                </label>
                <div className="p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl font-mono text-xs text-[#0D47A1] font-semibold">
                  Daily_Revenue_Report_{dateRange.replace(/\s+/g, "_")}.
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
                    `Exporting Daily Revenue Report as ${exportFormat.toUpperCase()}...`,
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