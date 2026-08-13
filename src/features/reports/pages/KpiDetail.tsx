import { useState, useMemo } from "react";
import {
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Clock,
  PieChart,
  AlertCircle,
  TrendingUp,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Eye,
  BarChart3,
} from "lucide-react";
import {
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
import type {
  KpiRevenueRecord,
  KpiAppointmentRecord,
  KpiPatientRecord,
  KpiConsultationRecord,
  KpiPendingPaymentRecord,
} from "../types/reports.types";
import {
  useDailyRevenueDetails,
  useDailyAppointmentDetails,
  usePatientMasterRegister,
  useInvoiceRegister,
  extractList,
} from "../hooks/useReports";


export function DashboardKpiDetailScreen({
  onBack,
  initialKpi = "Today's Revenue",
}: {
  onBack?: () => void;
  onOpenRelatedReport?: () => void;
  initialKpi?: string;
}) {
  // State
  const [selectedKpi, setSelectedKpi] = useState<string>(initialKpi);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All Visit Types");
  const [payStatusFilter, setPayStatusFilter] = useState(
    "All Payment Statuses",
  );
  const [aptStatusFilter, setAptStatusFilter] = useState(
    "All Appointment Statuses",
  );

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: "Today",
    dept: "All Departments",
    doctor: "All Doctors",
    visitType: "All Visit Types",
    payStatus: "All Payment Statuses",
    aptStatus: "All Appointment Statuses",
  });

  // API Data Hooks
  const today = new Date().toISOString().slice(0, 10);
  const getDateRange = (range: string) => {
    const now = new Date();
    if (range === "Today") return { fromDate: today, toDate: today };
    if (range === "7 Days") {
      const from = new Date(now); from.setDate(now.getDate() - 7);
      return { fromDate: from.toISOString().slice(0, 10), toDate: today };
    }
    if (range === "30 Days") {
      const from = new Date(now); from.setDate(now.getDate() - 30);
      return { fromDate: from.toISOString().slice(0, 10), toDate: today };
    }
    return { fromDate: "2025-01-01", toDate: today };
  };
  const reportFilters = getDateRange(appliedFilters.dateRange);

  const { data: rawRevenueDetails } = useDailyRevenueDetails(reportFilters);
  const { data: rawApptDetails } = useDailyAppointmentDetails(reportFilters);
  const { data: rawPatientRegister } = usePatientMasterRegister(reportFilters);
  const { data: rawInvoiceRegister } = useInvoiceRegister(reportFilters);

  const revenueList = useMemo(() => extractList<any>(rawRevenueDetails), [rawRevenueDetails]);
  const apptList = useMemo(() => extractList<any>(rawApptDetails), [rawApptDetails]);
  const patientList = useMemo(() => extractList<any>(rawPatientRegister), [rawPatientRegister]);
  const invoiceList = useMemo(() => extractList<any>(rawInvoiceRegister), [rawInvoiceRegister]);

  // Enterprise Export & Print Modal States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">(
    "pdf",
  );
  const [exportScope, setExportScope] = useState<
    "current" | "filtered" | "complete"
  >("filtered");
  const [includeOptions, setIncludeOptions] = useState({
    kpi: true,
    charts: true,
    tables: true,
    filters: true,
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
        visitType: visitTypeFilter,
        payStatus: payStatusFilter,
        aptStatus: aptStatusFilter,
      });
      setIsLoading(false);
    }, 300);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRange("Today");
    setDeptFilter("All Departments");
    setDoctorFilter("All Doctors");
    setVisitTypeFilter("All Visit Types");
    setPayStatusFilter("All Payment Statuses");
    setAptStatusFilter("All Appointment Statuses");
    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters({
        dateRange: "Today",
        dept: "All Departments",
        doctor: "All Doctors",
        visitType: "All Visit Types",
        payStatus: "All Payment Statuses",
        aptStatus: "All Appointment Statuses",
      });
      setIsLoading(false);
    }, 300);
  };

  // Determine active KPI category
  const isRevenueKpi =
    selectedKpi.includes("Revenue") || selectedKpi.includes("Collected");
  const isAppointmentKpi =
    selectedKpi.includes("Appointments") ||
    selectedKpi.includes("OPD Appointments");
  const isPatientKpi =
    selectedKpi.includes("Registered") || selectedKpi.includes("Patients");
  const isConsultationKpi =
    selectedKpi.includes("Consultations") ||
    selectedKpi.includes("OPD Consultations");
  const isPendingKpi =
    selectedKpi.includes("Pending") || selectedKpi.includes("Pending Payments");

  // Dynamic filter visibility rules
  const showPayStatusFilter = isRevenueKpi || isPendingKpi;
  const showAptStatusFilter = isAppointmentKpi;
  const showVisitTypeFilter = isAppointmentKpi || isPatientKpi;

  // Filtered dataset generator based on selected KPI
  const currentDataset = useMemo(() => {
    const q = searchQuery.toLowerCase();

    if (isRevenueKpi) {
      const source = revenueList.length > 0 ? revenueList : invoiceList;
      const mapped = source.map((d: any) => ({
        invoiceId: d.paymentId || d.invoiceNumber || d.receiptNumber || `INV-${d.id || ""}`,
        patientName: d.patientName || "N/A",
        mrn: d.mrn ? (String(d.mrn).startsWith("MRN-") ? String(d.mrn) : `MRN-${d.mrn}`) : `MRN-${d.patientId || ""}`,
        doctorName: d.doctorName || "N/A",
        department: d.department || "General Medicine",
        invoiceDate: d.paidAt || d.invoiceDate || d.createdDate || today,
        totalAmount: Number(d.amount || d.billedAmount || 0),
        collectedAmount: Number(d.paidAmount || d.amount || d.collectedAmount || 0),
        outstandingAmount: Number(d.outstandingAmount || 0),
        paymentMethod: d.paymentMethod || "Cash",
        invoiceStatus: d.paymentStatus || "Paid",
        cashierName: d.collectedBy || d.cashierName || "System",
      }));
      return mapped.filter((item) => {
        const matchesSearch =
          item.invoiceId.toLowerCase().includes(q) ||
          item.patientName.toLowerCase().includes(q) ||
          item.mrn.toLowerCase().includes(q) ||
          item.doctorName.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q);
        const matchesDept =
          appliedFilters.dept === "All Departments" ||
          item.department === appliedFilters.dept;
        const matchesDoctor =
          appliedFilters.doctor === "All Doctors" ||
          item.doctorName === appliedFilters.doctor;
        const matchesStatus =
          appliedFilters.payStatus === "All Payment Statuses" ||
          item.invoiceStatus === appliedFilters.payStatus;
        return matchesSearch && matchesDept && matchesDoctor && matchesStatus;
      });
    }

    if (isAppointmentKpi) {
      const mapped = apptList.map((d: any) => ({
        appointmentId: d.appointmentNumber || d.id || `APT-${d.appointmentId || ""}`,
        patientName: d.patientName || "N/A",
        mrn: d.mrn ? (String(d.mrn).startsWith("MRN-") ? String(d.mrn) : `MRN-${d.mrn}`) : `MRN-${d.patientId || ""}`,
        doctorName: d.doctorName || "N/A",
        department: d.department || "General Medicine",
        appointmentDate: d.appointmentDate || d.date || today,
        appointmentTime: d.appointmentTime || "09:00 AM",
        visitType: d.visitType || d.appointmentType || "New Visit",
        appointmentStatus: d.status || "Scheduled",
        queueNumber: d.queueNumber || "Q-1",
      }));
      return mapped.filter((item) => {
        const matchesSearch =
          item.appointmentId.toLowerCase().includes(q) ||
          item.patientName.toLowerCase().includes(q) ||
          item.mrn.toLowerCase().includes(q) ||
          item.doctorName.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q);
        const matchesDept =
          appliedFilters.dept === "All Departments" ||
          item.department === appliedFilters.dept;
        const matchesDoctor =
          appliedFilters.doctor === "All Doctors" ||
          item.doctorName === appliedFilters.doctor;
        const matchesVisit =
          appliedFilters.visitType === "All Visit Types" ||
          item.visitType === appliedFilters.visitType;
        const matchesStatus =
          appliedFilters.aptStatus === "All Appointment Statuses" ||
          item.appointmentStatus === appliedFilters.aptStatus;
        return (
          matchesSearch &&
          matchesDept &&
          matchesDoctor &&
          matchesVisit &&
          matchesStatus
        );
      });
    }

    if (isPatientKpi) {
      const mapped = patientList.map((d: any) => ({
        patientId: d.patientId || d.id || "",
        patientName: d.patientName || d.fullName || "N/A",
        mrn: d.mrn ? (String(d.mrn).startsWith("MRN-") ? String(d.mrn) : `MRN-${d.mrn}`) : `MRN-${d.patientId || ""}`,
        mobile: d.mobile || d.phone || "",
        gender: d.gender || "Other",
        age: d.age || 0,
        department: d.department || "General Medicine",
        assignedDoctor: d.doctorName || "Unassigned",
        registrationDate: d.registrationDate || d.createdDate || today,
        visitType: d.visitType || "New Visit",
        patientStatus: d.status || "Active",
      }));
      return mapped.filter((item) => {
        const matchesSearch =
          item.patientName.toLowerCase().includes(q) ||
          item.mrn.toLowerCase().includes(q) ||
          item.mobile.includes(q) ||
          item.assignedDoctor.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q);
        const matchesDept =
          appliedFilters.dept === "All Departments" ||
          item.department === appliedFilters.dept;
        const matchesDoctor =
          appliedFilters.doctor === "All Doctors" ||
          item.assignedDoctor === appliedFilters.doctor;
        const matchesVisit =
          appliedFilters.visitType === "All Visit Types" ||
          item.visitType === appliedFilters.visitType;
        return matchesSearch && matchesDept && matchesDoctor && matchesVisit;
      });
    }

    if (isConsultationKpi) {
      const mapped = apptList.map((d: any) => ({
        consultationId: d.consultationId || d.appointmentNumber || `CNS-${d.id || ""}`,
        patientName: d.patientName || "N/A",
        mrn: d.mrn ? (String(d.mrn).startsWith("MRN-") ? String(d.mrn) : `MRN-${d.mrn}`) : `MRN-${d.patientId || ""}`,
        doctorName: d.doctorName || "N/A",
        department: d.department || "General Medicine",
        consultationDate: d.appointmentDate || today,
        consultationTime: d.appointmentTime || "10:00 AM",
        diagnosis: d.diagnosis || "General OPD Checkup",
        consultationStatus: d.status === "Completed" || d.status === "COMPLETED" ? "Completed" : "In Consultation",
        prescriptionIssued: d.prescriptionIssued ?? true,
      }));
      return mapped.filter((item) => {
        const matchesSearch =
          item.consultationId.toLowerCase().includes(q) ||
          item.patientName.toLowerCase().includes(q) ||
          item.mrn.toLowerCase().includes(q) ||
          item.doctorName.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q);
        const matchesDept =
          appliedFilters.dept === "All Departments" ||
          item.department === appliedFilters.dept;
        const matchesDoctor =
          appliedFilters.doctor === "All Doctors" ||
          item.doctorName === appliedFilters.doctor;
        return matchesSearch && matchesDept && matchesDoctor;
      });
    }

    if (isPendingKpi) {
      const pendingInvoices = invoiceList.filter((d: any) => Number(d.outstandingAmount || 0) > 0 || d.paymentStatus === "Pending" || d.paymentStatus === "UNPAID");
      const source = pendingInvoices.length > 0 ? pendingInvoices : invoiceList;
      const mapped = source.map((d: any) => ({
        billId: d.invoiceNumber || d.billId || `BILL-${d.id || ""}`,
        patientName: d.patientName || "N/A",
        mrn: d.mrn ? (String(d.mrn).startsWith("MRN-") ? String(d.mrn) : `MRN-${d.mrn}`) : `MRN-${d.patientId || ""}`,
        doctorName: d.doctorName || "N/A",
        department: d.department || "General Medicine",
        billDate: d.invoiceDate || today,
        totalBillAmount: Number(d.billedAmount || d.amount || 0),
        paidAmount: Number(d.paidAmount || 0),
        pendingBalance: Number(d.outstandingAmount || d.billedAmount || 0),
        dueDate: d.dueDate || today,
        overdueDays: d.overdueDays || 0,
      }));
      return mapped.filter((item) => {
        const matchesSearch =
          item.billId.toLowerCase().includes(q) ||
          item.patientName.toLowerCase().includes(q) ||
          item.mrn.toLowerCase().includes(q) ||
          item.doctorName.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q);
        const matchesDept =
          appliedFilters.dept === "All Departments" ||
          item.department === appliedFilters.dept;
        const matchesDoctor =
          appliedFilters.doctor === "All Doctors" ||
          item.doctorName === appliedFilters.doctor;
        return matchesSearch && matchesDept && matchesDoctor;
      });
    }

    return [];
  }, [
    isRevenueKpi,
    isAppointmentKpi,
    isPatientKpi,
    isConsultationKpi,
    isPendingKpi,
    searchQuery,
    appliedFilters,
    revenueList,
    apptList,
    patientList,
    invoiceList,
    today,
  ]);



  // Computed Report Summary Card Calculations
  const summaryMetrics = useMemo(() => {
    const count = currentDataset.length;
    let totalAmt = 0;
    let collectedAmt = 0;
    let pendingAmt = 0;

    if (isRevenueKpi) {
      (currentDataset as KpiRevenueRecord[]).forEach((d) => {
        totalAmt += d.invoiceAmount;
        collectedAmt += d.collectedAmount;
      });
    } else if (isPendingKpi) {
      (currentDataset as KpiPendingPaymentRecord[]).forEach((d) => {
        pendingAmt += d.pendingAmount;
      });
    }

    return {
      recordCount: count,
      totalAmount: totalAmt,
      collectedAmount: collectedAmt,
      pendingAmount: pendingAmt,
      averageValue:
        count > 0 ? Math.round((totalAmt || pendingAmt || 500) / count) : 0,
    };
  }, [currentDataset, isRevenueKpi, isPendingKpi]);

  // Render status badge helper
  const renderStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; dot: string }> = {
      Paid: {
        bg: "bg-emerald-50 border-teal-200",
        text: "text-[#009688]",
        dot: "bg-[#009688]",
      },
      Completed: {
        bg: "bg-emerald-50 border-teal-200",
        text: "text-[#009688]",
        dot: "bg-[#009688]",
      },
      "Partially Paid": {
        bg: "bg-blue-50 border-blue-200",
        text: "text-[#0D47A1]",
        dot: "bg-[#0D47A1]",
      },
      "Checked-In": {
        bg: "bg-blue-50 border-blue-200",
        text: "text-[#0D47A1]",
        dot: "bg-[#0D47A1]",
      },
      "In-Progress": {
        bg: "bg-blue-50 border-blue-200",
        text: "text-[#0D47A1]",
        dot: "bg-[#0D47A1]",
      },
      Pending: {
        bg: "bg-amber-50 border-amber-200",
        text: "text-[#F59E0B]",
        dot: "bg-[#F59E0B]",
      },
      Scheduled: {
        bg: "bg-amber-50 border-amber-200",
        text: "text-[#F59E0B]",
        dot: "bg-[#F59E0B]",
      },
      Cancelled: {
        bg: "bg-red-50 border-red-200",
        text: "text-[#EF4444]",
        dot: "bg-[#EF4444]",
      },
      Overdue: {
        bg: "bg-red-50 border-red-200",
        text: "text-[#EF4444]",
        dot: "bg-[#EF4444]",
      },
    };

    const style = map[status] || {
      bg: "bg-slate-50 border-slate-200",
      text: "text-[#64748B]",
      dot: "bg-[#64748B]",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {status}
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
                  Dashboard KPI Detail
                </span>
              </nav>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {selectedKpi} Register
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0D47A1] border border-blue-200">
                  Phase 1 OPD Audit Register
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Audit, verify, and export transaction details for {selectedKpi}.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 border border-[#E5E7EB] px-3 py-2 rounded-xl mr-1">
                <Clock className="w-4 h-4 text-[#0D47A1]" />
                <span>
                  Last Updated:{" "}
                  <strong className="text-[#111827]">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong>
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
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[#0D47A1] hover:bg-blue-900 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Register</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-slate-50 transition shadow-sm"
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
        {/* UNIFIED ENTERPRISE KPI DRILL-DOWN CONTEXT CARD */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-4 mb-4">
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Selected Dashboard KPI Drill-Down Context
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2
                  className="text-2xl font-bold text-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  {selectedKpi}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#66BB6A] border border-green-200 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> --
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label
                className="text-xs font-medium text-[#64748B]"
                style={{ fontFamily: PP }}
              >
                Select KPI To Inspect:
              </label>
              <select
                value={selectedKpi}
                onChange={(e) => setSelectedKpi(e.target.value)}
                className="bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs font-semibold px-3 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>Today's Revenue</option>
                <option>Today's Appointments</option>
                <option>Patients Registered</option>
                <option>OPD Consultations</option>
                <option>Completed Consultations</option>
                <option>Pending Payments</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC KPI SUMMARY METRICS (Mutates based on selected KPI) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {isRevenueKpi && (
              <>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Current Revenue
                  </span>
                  <strong
                    className="text-xl font-bold text-[#111827] block"
                    style={{ fontFamily: PP }}
                  >
                    â‚¹{summaryMetrics.totalAmount.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-[#009688] font-semibold">
                    Collected: â‚¹
                    {summaryMetrics.collectedAmount.toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Yesterday Revenue
                  </span>
                  <strong
                    className="text-xl font-bold text-[#0D47A1] block"
                    style={{ fontFamily: PP }}
                  >
                    â‚¹--
                  </strong>
                  <span className="text-[10px] text-[#66BB6A] font-semibold">
                    --
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Monthly Growth
                  </span>
                  <strong
                    className="text-xl font-bold text-[#009688] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    vs monthly baseline
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Yearly Growth
                  </span>
                  <strong
                    className="text-xl font-bold text-[#66BB6A] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    YoY growth trajectory
                  </span>
                </div>
              </>
            )}

            {isAppointmentKpi && (
              <>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Today's Appointments
                  </span>
                  <strong
                    className="text-xl font-bold text-[#111827] block"
                    style={{ fontFamily: PP }}
                  >
                    {summaryMetrics.recordCount}
                  </strong>
                  <span className="text-[10px] text-[#009688] font-semibold">
                    Active Tokens
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Yesterday
                  </span>
                  <strong
                    className="text-xl font-bold text-[#0D47A1] block"
                    style={{ fontFamily: PP }}
                  >
                    38
                  </strong>
                  <span className="text-[10px] text-[#66BB6A] font-semibold">
                    --
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Weekly Average
                  </span>
                  <strong
                    className="text-xl font-bold text-[#009688] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    7-day rolling avg
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Monthly Average
                  </span>
                  <strong
                    className="text-xl font-bold text-[#66BB6A] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    Monthly baseline
                  </span>
                </div>
              </>
            )}

            {isPatientKpi && (
              <>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Today's Registrations
                  </span>
                  <strong
                    className="text-xl font-bold text-[#111827] block"
                    style={{ fontFamily: PP }}
                  >
                    {summaryMetrics.recordCount}
                  </strong>
                  <span className="text-[10px] text-[#009688] font-semibold">
                    OPD Walk-ins & Reg
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Yesterday
                  </span>
                  <strong
                    className="text-xl font-bold text-[#0D47A1] block"
                    style={{ fontFamily: PP }}
                  >
                    45
                  </strong>
                  <span className="text-[10px] text-[#66BB6A] font-semibold">
                    --
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Weekly Average
                  </span>
                  <strong
                    className="text-xl font-bold text-[#009688] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    Stable registration
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Monthly Average
                  </span>
                  <strong
                    className="text-xl font-bold text-[#66BB6A] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    Monthly average
                  </span>
                </div>
              </>
            )}

            {(isConsultationKpi ||
              (!isRevenueKpi &&
                !isAppointmentKpi &&
                !isPatientKpi &&
                !isPendingKpi)) && (
              <>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Total Consultations
                  </span>
                  <strong
                    className="text-xl font-bold text-[#111827] block"
                    style={{ fontFamily: PP }}
                  >
                    {summaryMetrics.recordCount}
                  </strong>
                  <span className="text-[10px] text-[#009688] font-semibold">
                    OPD Consultations
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Yesterday
                  </span>
                  <strong
                    className="text-xl font-bold text-[#0D47A1] block"
                    style={{ fontFamily: PP }}
                  >
                    28
                  </strong>
                  <span className="text-[10px] text-[#66BB6A] font-semibold">
                    --
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Avg Consultation Duration
                  </span>
                  <strong
                    className="text-xl font-bold text-[#009688] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    Optimized flow
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Completion Rate
                  </span>
                  <strong
                    className="text-xl font-bold text-[#66BB6A] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#66BB6A] font-semibold">
                    High turnaround
                  </span>
                </div>
              </>
            )}

            {isPendingKpi && (
              <>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Today's Collections
                  </span>
                  <strong
                    className="text-xl font-bold text-[#009688] block"
                    style={{ fontFamily: PP }}
                  >
                    â‚¹14,500
                  </strong>
                  <span className="text-[10px] text-[#009688] font-semibold">
                    Cleared today
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Pending Collections
                  </span>
                  <strong
                    className="text-xl font-bold text-[#EF4444] block"
                    style={{ fontFamily: PP }}
                  >
                    â‚¹{summaryMetrics.pendingAmount.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-[#F59E0B] font-semibold">
                    Requires follow-up
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Invoices Generated
                  </span>
                  <strong
                    className="text-xl font-bold text-[#0D47A1] block"
                    style={{ fontFamily: PP }}
                  >
                    {summaryMetrics.recordCount} Invoices
                  </strong>
                  <span className="text-[10px] text-[#64748B]">
                    Active billing
                  </span>
                </div>
                <div className="bg-[#F1F5F9] rounded-xl p-3.5 border border-[#E5E7EB]">
                  <span className="text-[#64748B] text-[11px] block mb-1">
                    Payment Completion %
                  </span>
                  <strong
                    className="text-xl font-bold text-[#66BB6A] block"
                    style={{ fontFamily: PP }}
                  >
                    --
                  </strong>
                  <span className="text-[10px] text-[#66BB6A] font-semibold">
                    Settled transactions
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* REUSABLE SMART REPORT FILTERS */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div
            className="flex items-center gap-2 mb-3 text-xs font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            <Filter className="w-4 h-4 text-[#009688]" />
            <span>Filter {selectedKpi} Records</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Patient Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, MRN, ID..."
                  className="w-full pl-8 pr-2.5 py-2 bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                />
              </div>
            </div>

            {/* Date Range */}
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

            {/* Department */}
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
                <option>Pediatrics</option>
              </select>
            </div>

            {/* Doctor */}
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

            {/* Dynamic Visit Type Filter */}
            <div>
              <label
                className={`block text-[11px] font-medium mb-1 ${showVisitTypeFilter ? "text-[#64748B]" : "text-slate-400"}`}
              >
                Visit Type
              </label>
              <select
                disabled={!showVisitTypeFilter}
                value={visitTypeFilter}
                onChange={(e) => setVisitTypeFilter(e.target.value)}
                className={`w-full border rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1] ${showVisitTypeFilter ? "bg-[#F1F5F9] border-[#E5E7EB]" : "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"}`}
              >
                <option>All Visit Types</option>
                <option>New Visit</option>
                <option>Follow-up</option>
                <option>Walk-in</option>
                <option>Emergency</option>
              </select>
            </div>

            {/* Dynamic Payment or Appointment Status Filter */}
            {showAptStatusFilter ? (
              <div>
                <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                  Appointment Status
                </label>
                <select
                  value={aptStatusFilter}
                  onChange={(e) => setAptStatusFilter(e.target.value)}
                  className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                >
                  <option>All Appointment Statuses</option>
                  <option>Scheduled</option>
                  <option>Checked-In</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            ) : (
              <div>
                <label
                  className={`block text-[11px] font-medium mb-1 ${showPayStatusFilter ? "text-[#64748B]" : "text-slate-400"}`}
                >
                  Payment Status
                </label>
                <select
                  disabled={!showPayStatusFilter}
                  value={payStatusFilter}
                  onChange={(e) => setPayStatusFilter(e.target.value)}
                  className={`w-full border rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1] ${showPayStatusFilter ? "bg-[#F1F5F9] border-[#E5E7EB]" : "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"}`}
                >
                  <option>All Payment Statuses</option>
                  <option>Paid</option>
                  <option>Partially Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                </select>
              </div>
            )}
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
          appliedFilters.visitType !== "All Visit Types" ||
          appliedFilters.payStatus !== "All Payment Statuses" ||
          appliedFilters.aptStatus !== "All Appointment Statuses" ||
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

        {/* ANALYTICS CHARTS SECTION (DYNAMIC BY KPI) */}
        {!isLoading && currentDataset.length > 0 && (
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: Main Trend (Line / Area) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {isRevenueKpi
                        ? "Revenue Accumulation Trend"
                        : isAppointmentKpi
                          ? "Appointments Intraday Distribution"
                          : isPatientKpi
                            ? "Patient Registration Trend"
                            : "Consultation Activity Trend"}
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      {appliedFilters.dateRange} performance breakdown for{" "}
                      {selectedKpi}
                    </p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#0D47A1]" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        {
                          time: "08:00 AM",
                          value: isRevenueKpi
                            ? 4500
                            : isAppointmentKpi
                              ? 12
                              : 5,
                        },
                        {
                          time: "10:00 AM",
                          value: isRevenueKpi
                            ? 18200
                            : isAppointmentKpi
                              ? 38
                              : 18,
                        },
                        {
                          time: "12:00 PM",
                          value: isRevenueKpi
                            ? 34500
                            : isAppointmentKpi
                              ? 65
                              : 32,
                        },
                        {
                          time: "02:00 PM",
                          value: isRevenueKpi
                            ? 48900
                            : isAppointmentKpi
                              ? 84
                              : 45,
                        },
                        {
                          time: "04:00 PM",
                          value: isRevenueKpi
                            ? 62400
                            : isAppointmentKpi
                              ? 110
                              : 54,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis
                        dataKey="time"
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
                        dataKey="value"
                        stroke="#0D47A1"
                        strokeWidth={2.5}
                        dot={{ fill: "#0D47A1" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Distribution Share (Donut Chart) */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3
                      className="text-sm font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {isRevenueKpi
                        ? "Payment Method Distribution"
                        : isAppointmentKpi
                          ? "Visit Type Breakdown"
                          : isPatientKpi
                            ? "Gender Distribution"
                            : "Status Share"}
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Categorical split of {selectedKpi}
                    </p>
                  </div>
                  <PieChart className="w-4 h-4 text-[#009688]" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={
                          isRevenueKpi
                            ? [
                                { name: "Card", value: 45, color: "#0D47A1" },
                                { name: "UPI", value: 35, color: "#009688" },
                                { name: "Cash", value: 20, color: "#4DB6AC" },
                              ]
                            : isAppointmentKpi
                              ? [
                                  {
                                    name: "New Visit",
                                    value: 50,
                                    color: "#0D47A1",
                                  },
                                  {
                                    name: "Follow-up",
                                    value: 35,
                                    color: "#009688",
                                  },
                                  {
                                    name: "Walk-in",
                                    value: 15,
                                    color: "#F59E0B",
                                  },
                                ]
                              : [
                                  {
                                    name: "Female",
                                    value: 55,
                                    color: "#009688",
                                  },
                                  { name: "Male", value: 42, color: "#0D47A1" },
                                  { name: "Other", value: 3, color: "#4DB6AC" },
                                ]
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {[0, 1, 2].map((idx) => (
                          <Cell
                            key={idx}
                            fill={
                              isRevenueKpi
                                ? ["#0D47A1", "#009688", "#4DB6AC"][idx]
                                : ["#0D47A1", "#009688", "#F59E0B"][idx]
                            }
                          />
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
                        wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Department Breakdown (Bar Chart) */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3
                    className="text-sm font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Department Contribution Analysis
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Volume comparison across active clinical departments
                  </p>
                </div>
                <BarChart3 className="w-4 h-4 text-[#009688]" />
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { dept: "Gen. Medicine", count: 42 },
                      { dept: "Cardiology", count: 35 },
                      { dept: "Orthopedics", count: 28 },
                      { dept: "Neurology", count: 20 },
                      { dept: "Pediatrics", count: 18 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="dept"
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
                      name="Total Volume"
                      fill="#009688"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {!isLoading && currentDataset.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center my-6 shadow-sm">
            <AlertCircle className="w-12 h-12 text-[#F59E0B] mx-auto mb-3" />
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              No records found for selected filters.
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Try adjusting or resetting your applied date, department, or
              status filters to view transactions.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 transition shadow-sm"
              style={{ fontFamily: PP }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* DYNAMIC REUSABLE SMART TRANSACTION TABLE */}
        {!isLoading && currentDataset.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3
                  className="text-base font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {selectedKpi} Transaction Register
                </h3>
                <p className="text-xs text-[#64748B]">
                  Granular drill-down log records supporting {selectedKpi}
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] rounded-xl hover:bg-slate-100 transition"
              >
                <Download className="w-3.5 h-3.5 text-[#0D47A1]" />
                <span>Export Register</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F1F5F9] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E5E7EB]">
                    {isRevenueKpi && (
                      <>
                        <th className="py-3.5 px-4">Invoice No</th>
                        <th className="py-3.5 px-4">Patient</th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Doctor</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Invoice Date</th>
                        <th className="py-3.5 px-4">Method</th>
                        <th className="py-3.5 px-4 text-right">Invoice Amt</th>
                        <th className="py-3.5 px-4 text-right">
                          Collected Amt
                        </th>
                        <th className="py-3.5 px-4 text-center">
                          Invoice Status
                        </th>
                      </>
                    )}

                    {isAppointmentKpi && (
                      <>
                        <th className="py-3.5 px-4">Appointment ID</th>
                        <th className="py-3.5 px-4">Patient</th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Doctor</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Visit Type</th>
                        <th className="py-3.5 px-4">Time</th>
                        <th className="py-3.5 px-4">Token</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                      </>
                    )}

                    {isPatientKpi && (
                      <>
                        <th className="py-3.5 px-4">Patient ID</th>
                        <th className="py-3.5 px-4">Patient Name</th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Gender</th>
                        <th className="py-3.5 px-4">Age</th>
                        <th className="py-3.5 px-4">Registration Date</th>
                        <th className="py-3.5 px-4">Registered By</th>
                        <th className="py-3.5 px-4">Visit Type</th>
                      </>
                    )}

                    {isConsultationKpi && (
                      <>
                        <th className="py-3.5 px-4">Consultation ID</th>
                        <th className="py-3.5 px-4">Patient</th>
                        <th className="py-3.5 px-4">Doctor</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Consultation Time</th>
                        <th className="py-3.5 px-4">Duration</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                      </>
                    )}

                    {isPendingKpi && (
                      <>
                        <th className="py-3.5 px-4">Invoice No</th>
                        <th className="py-3.5 px-4">Patient</th>
                        <th className="py-3.5 px-4">Doctor</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4 text-right">Pending Amt</th>
                        <th className="py-3.5 px-4">Due Date</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                      </>
                    )}
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {/* Revenue Table Body */}
                  {isRevenueKpi &&
                    (currentDataset as KpiRevenueRecord[]).map((row) => (
                      <tr
                        key={row.invoiceId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                          {row.invoiceId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">
                          {row.patientName}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.mrn}
                        </td>
                        <td className="py-3.5 px-4 text-[#111827]">
                          {row.doctorName}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.department}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.invoiceDate}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#111827]">
                          {row.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#111827]">
                          â‚¹{row.invoiceAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#009688]">
                          â‚¹{row.collectedAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {renderStatusBadge(row.invoiceStatus)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => alert(`View ${row.invoiceId}`)}
                              className="p-1 text-[#0D47A1] hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="p-1 text-[#64748B] hover:bg-slate-100 rounded"
                              title="Print"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() => alert(`Download ${row.invoiceId}`)}
                              className="p-1 text-[#009688] hover:bg-teal-50 rounded"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* Appointments Table Body */}
                  {isAppointmentKpi &&
                    (currentDataset as KpiAppointmentRecord[]).map((row) => (
                      <tr
                        key={row.appointmentId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                          {row.appointmentId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">
                          {row.patientName}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.mrn}
                        </td>
                        <td className="py-3.5 px-4 text-[#111827]">
                          {row.doctorName}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.department}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#111827]">
                          {row.visitType}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.appointmentTime}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#0D47A1] font-bold">
                          {row.tokenNumber}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {renderStatusBadge(row.appointmentStatus)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => alert(`View ${row.appointmentId}`)}
                              className="p-1 text-[#0D47A1] hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="p-1 text-[#64748B] hover:bg-slate-100 rounded"
                              title="Print"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() =>
                                alert(`Download ${row.appointmentId}`)
                              }
                              className="p-1 text-[#009688] hover:bg-teal-50 rounded"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* Patients Table Body */}
                  {isPatientKpi &&
                    (currentDataset as KpiPatientRecord[]).map((row) => (
                      <tr
                        key={row.patientId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                          {row.patientId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">
                          {row.patientName}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.mrn}
                        </td>
                        <td className="py-3.5 px-4 text-[#111827]">
                          {row.gender}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.age} yrs
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.registrationDate}
                        </td>
                        <td className="py-3.5 px-4 text-[#111827] font-medium">
                          {row.registeredBy}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#009688]">
                          {row.visitType}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => alert(`View ${row.patientId}`)}
                              className="p-1 text-[#0D47A1] hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="p-1 text-[#64748B] hover:bg-slate-100 rounded"
                              title="Print"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() => alert(`Download ${row.patientId}`)}
                              className="p-1 text-[#009688] hover:bg-teal-50 rounded"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* Consultations Table Body */}
                  {isConsultationKpi &&
                    (currentDataset as KpiConsultationRecord[]).map((row) => (
                      <tr
                        key={row.consultationId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                          {row.consultationId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">
                          {row.patientName}
                        </td>
                        <td className="py-3.5 px-4 text-[#111827]">
                          {row.doctorName}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.department}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.consultationTime}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#111827]">
                          {row.durationMinutes} mins
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {renderStatusBadge(row.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                alert(`View ${row.consultationId}`)
                              }
                              className="p-1 text-[#0D47A1] hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="p-1 text-[#64748B] hover:bg-slate-100 rounded"
                              title="Print"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() =>
                                alert(`Download ${row.consultationId}`)
                              }
                              className="p-1 text-[#009688] hover:bg-teal-50 rounded"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* Pending Payments Table Body */}
                  {isPendingKpi &&
                    (currentDataset as KpiPendingPaymentRecord[]).map((row) => (
                      <tr
                        key={row.invoiceId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                          {row.invoiceId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">
                          {row.patientName}
                        </td>
                        <td className="py-3.5 px-4 text-[#111827]">
                          {row.doctorName}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.department}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#EF4444]">
                          â‚¹{row.pendingAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {row.dueDate}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {renderStatusBadge(row.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => alert(`View ${row.invoiceId}`)}
                              className="p-1 text-[#0D47A1] hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="p-1 text-[#64748B] hover:bg-slate-100 rounded"
                              title="Print"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() => alert(`Download ${row.invoiceId}`)}
                              className="p-1 text-[#009688] hover:bg-teal-50 rounded"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 bg-[#F1F5F9] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
              <span>
                Showing 1 to {currentDataset.length} of {currentDataset.length}{" "}
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
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <div>
            Showing{" "}
            <strong className="text-[#111827]">
              {currentDataset.length} Transactions
            </strong>
          </div>
          <div>
            Safe Hands Hospital Management System â€¢ Dashboard KPI Detail v2.0
          </div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">{new Date().toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* ENTERPRISE EXPORT REPORT MODAL WITH PRINT & CHARTS */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
              <h3
                className="text-base font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Export {selectedKpi} Report
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
                      value="current"
                      checked={exportScope === "current"}
                      onChange={() => setExportScope("current")}
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
                      <span>Hospital Header & Logo</span>
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
                      <span>KPI Charts in PDF</span>
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
                      <span>Transaction Register</span>
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
                      <span>Applied Filter Summary</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label
                  className="block font-semibold text-[#111827] mb-1"
                  style={{ fontFamily: PP }}
                >
                  Generated Export File Name
                </label>
                <div className="p-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl font-mono text-xs text-[#0D47A1] font-semibold">
                  {selectedKpi.replace(/[^a-zA-Z0-9]/g, "_")}_Report_
                  {dateRange.replace(/\s+/g, "_")}.
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
                    `Exporting ${selectedKpi} Register as ${exportFormat.toUpperCase()} with Hospital Header, Applied Filters, and Printable Charts...`,
                  );
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 transition shadow-sm flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Download size={14} />
                <span>Export Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
