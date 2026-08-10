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
  Eye,
  FileSpreadsheet,
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
import type { PatientReportRecord } from "../types/reports.types";
import {
  usePatientRegistrationDetails,
  usePatientMasterRegister,
  usePatientAgeDemographics,
  useDepartmentPatientVisits,
  useDoctorPatientWorkload,
  useGenderBreakdown,
  usePatientRegistrationSummary,
} from "../hooks/useReports";
const PATIENT_REPORT_TABLE_DATA: PatientReportRecord[] = [
  {
    mrn: "MRN-89201",
    patientName: "Sarah Mitchell",
    age: 34,
    gender: "Female",
    mobile: "+91 98765 43210",
    department: "Cardiology",
    doctorName: "Dr. Sarah Jenkins",
    registrationDate: "2026-07-20",
    lastVisit: "2026-07-26",
    visitType: "Follow-up",
    status: "Active",
  },
  {
    mrn: "MRN-89202",
    patientName: "James Thornton",
    age: 48,
    gender: "Male",
    mobile: "+91 97654 32109",
    department: "Neurology",
    doctorName: "Dr. Rajesh Kapoor",
    registrationDate: "2026-07-26",
    lastVisit: "2026-07-26",
    visitType: "New Visit",
    status: "Active",
  },
  {
    mrn: "MRN-89203",
    patientName: "Emma Reyes",
    age: 29,
    gender: "Female",
    mobile: "+91 96543 21098",
    department: "General Medicine",
    doctorName: "Dr. Priya Sharma",
    registrationDate: "2026-07-24",
    lastVisit: "2026-07-26",
    visitType: "Walk-in",
    status: "Active",
  },
  {
    mrn: "MRN-89204",
    patientName: "David Walsh",
    age: 52,
    gender: "Male",
    mobile: "+91 95432 10987",
    department: "Orthopedics",
    doctorName: "Dr. Arjun Mehta",
    registrationDate: "2026-07-22",
    lastVisit: "2026-07-26",
    visitType: "Follow-up",
    status: "Completed",
  },
  {
    mrn: "MRN-89205",
    patientName: "Aisha Kumar",
    age: 27,
    gender: "Female",
    mobile: "+91 94321 09876",
    department: "Gynecology",
    doctorName: "Dr. Sunita Patel",
    registrationDate: "2026-07-26",
    lastVisit: "2026-07-26",
    visitType: "New Visit",
    status: "Active",
  },
  {
    mrn: "MRN-89206",
    patientName: "Robert Vance",
    age: 61,
    gender: "Male",
    mobile: "+91 93210 98765",
    department: "General Medicine",
    doctorName: "Dr. Priya Sharma",
    registrationDate: "2026-07-15",
    lastVisit: "2026-07-25",
    visitType: "Follow-up",
    status: "Pending Follow-up",
  },
  {
    mrn: "MRN-89207",
    patientName: "Elena Rostova",
    age: 41,
    gender: "Female",
    mobile: "+91 92109 87654",
    department: "Cardiology",
    doctorName: "Dr. Sarah Jenkins",
    registrationDate: "2026-07-26",
    lastVisit: "2026-07-26",
    visitType: "Walk-in",
    status: "Active",
  },
];

const AGE_DISTRIBUTION_DATA = [
  { group: "0â€“12", count: 45, percentage: 12 },
  { group: "13â€“18", count: 30, percentage: 8 },
  { group: "19â€“30", count: 110, percentage: 28 },
  { group: "31â€“45", count: 125, percentage: 32 },
  { group: "46â€“60", count: 55, percentage: 14 },
  { group: "60+", count: 25, percentage: 6 },
];

const GENDER_DISTRIBUTION_DATA = [
  { name: "Female", value: 180, percentage: 46, color: "#009688" },
  { name: "Male", value: 195, percentage: 50, color: "#0D47A1" },
  { name: "Other", value: 15, percentage: 4, color: "#4DB6AC" },
];

const PATIENT_REGISTRATION_TREND_DATA = [
  { date: "Jul 20", New: 24, Returning: 12, Total: 36 },
  { date: "Jul 21", New: 28, Returning: 15, Total: 43 },
  { date: "Jul 22", New: 26, Returning: 14, Total: 40 },
  { date: "Jul 23", New: 32, Returning: 18, Total: 50 },
  { date: "Jul 24", New: 30, Returning: 16, Total: 46 },
  { date: "Jul 25", New: 31, Returning: 19, Total: 50 },
  { date: "Jul 26", New: 34, Returning: 24, Total: 58 },
];

const DEPT_PATIENT_VISITS_DATA = [
  {
    department: "Gen. Medicine",
    total: 168,
    newPatients: 110,
    returningPatients: 58,
  },
  {
    department: "Cardiology",
    total: 120,
    newPatients: 75,
    returningPatients: 45,
  },
  {
    department: "Orthopedics",
    total: 95,
    newPatients: 60,
    returningPatients: 35,
  },
  { department: "ENT", total: 65, newPatients: 45, returningPatients: 20 },
  {
    department: "Neurology",
    total: 80,
    newPatients: 50,
    returningPatients: 30,
  },
  {
    department: "Pediatrics",
    total: 90,
    newPatients: 65,
    returningPatients: 25,
  },
];

const DOCTOR_PATIENT_DATA = [
  { doctor: "Dr. S. Jenkins", assigned: 142, completed: 134, followup: 24 },
  { doctor: "Dr. R. Kapoor", assigned: 118, completed: 110, followup: 18 },
  { doctor: "Dr. P. Sharma", assigned: 195, completed: 188, followup: 32 },
  { doctor: "Dr. A. Mehta", assigned: 130, completed: 121, followup: 21 },
  { doctor: "Dr. S. Patel", assigned: 156, completed: 149, followup: 28 },
];

const RECENT_PATIENT_TIMELINE = [
  {
    id: "PT-101",
    type: "Patient Registered",
    patient: "James Thornton",
    mrn: "MRN-89202",
    doctor: "Dr. Rajesh Kapoor",
    time: "09:30 AM",
  },
  {
    id: "PT-102",
    type: "Appointment Booked",
    patient: "Aisha Kumar",
    mrn: "MRN-89205",
    doctor: "Dr. Sunita Patel",
    time: "09:15 AM",
  },
  {
    id: "PT-103",
    type: "Checked-In",
    patient: "Emma Reyes",
    mrn: "MRN-89203",
    doctor: "Dr. Priya Sharma",
    time: "08:50 AM",
  },
  {
    id: "PT-104",
    type: "Consultation Completed",
    patient: "Sarah Mitchell",
    mrn: "MRN-89201",
    doctor: "Dr. Sarah Jenkins",
    time: "08:30 AM",
  },
  {
    id: "PT-105",
    type: "Follow-up Scheduled",
    patient: "David Walsh",
    mrn: "MRN-89204",
    doctor: "Dr. Arjun Mehta",
    time: "08:00 AM",
  },
];

export function PatientReportScreen({
  onBack,
  onOpenAppointmentReport,
  onOpenDoctorReport,
}: {
  onBack?: () => void;
  onOpenAppointmentReport?: () => void;
  onOpenDoctorReport?: () => void;
}) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [genderFilter, setGenderFilter] = useState("All Genders");
  const [ageGroupFilter, setAgeGroupFilter] = useState("All Age Groups");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All Visit Types");
  const [regStatusFilter, setRegStatusFilter] = useState("All Statuses");

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: "Today",
    gender: "All Genders",
    ageGroup: "All Age Groups",
    dept: "All Departments",
    doctor: "All Doctors",
    visitType: "All Visit Types",
    regStatus: "All Statuses",
  });

  // ─── API Data Hooks ──────────────────────────────────────────────────────
  const reportFilters = { fromDate: "2026-08-01", toDate: "2026-08-08" };
  const { data: registrationDetails } = usePatientRegistrationDetails(reportFilters);
  const { data: masterRegister } = usePatientMasterRegister(reportFilters);
  const { data: ageDemographics } = usePatientAgeDemographics(reportFilters);
  const { data: deptVisits = [] } = useDepartmentPatientVisits(reportFilters);
  const { data: doctorWorkload = [] } = useDoctorPatientWorkload(reportFilters);
  const { data: genderData } = useGenderBreakdown(reportFilters);
  const { data: regSummary } = usePatientRegistrationSummary(reportFilters);

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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [trendDays, setTrendDays] = useState<"7 Days" | "30 Days" | "90 Days">(
    "7 Days",
  );

  const [sortField, setSortField] =
    useState<keyof PatientReportRecord>("registrationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters({
        dateRange,
        gender: genderFilter,
        ageGroup: ageGroupFilter,
        dept: deptFilter,
        doctor: doctorFilter,
        visitType: visitTypeFilter,
        regStatus: regStatusFilter,
      });
      setIsLoading(false);
    }, 300);
  };

  const handleResetFilters = () => {
    setDateRange("Today");
    setGenderFilter("All Genders");
    setAgeGroupFilter("All Age Groups");
    setDeptFilter("All Departments");
    setDoctorFilter("All Doctors");
    setVisitTypeFilter("All Visit Types");
    setRegStatusFilter("All Statuses");
    setSearchQuery("");

    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters({
        dateRange: "Today",
        gender: "All Genders",
        ageGroup: "All Age Groups",
        dept: "All Departments",
        doctor: "All Doctors",
        visitType: "All Visit Types",
        regStatus: "All Statuses",
      });
      setIsLoading(false);
    }, 300);
  };

  // Dynamic filter multiplier for KPI updates
  const patientFilterMultiplier = useMemo(() => {
    let mult = 1.0;
    if (appliedFilters.dept !== "All Departments") mult *= 0.35;
    if (appliedFilters.doctor !== "All Doctors") mult *= 0.2;
    if (appliedFilters.gender === "Female") mult *= 0.46;
    if (appliedFilters.gender === "Male") mult *= 0.5;
    if (appliedFilters.visitType === "New Visit") mult *= 0.65;
    if (appliedFilters.visitType === "Follow-up") mult *= 0.35;
    if (appliedFilters.dateRange === "Last 7 Days") mult *= 6.8;
    if (appliedFilters.dateRange === "This Month") mult *= 28;
    return mult;
  }, [appliedFilters]);

  // Computed KPI Card Values
  const computedPatientStats = useMemo(() => {
    const totalReg = Math.round(
      390 *
        (patientFilterMultiplier > 2
          ? patientFilterMultiplier / 28
          : Math.max(0.25, patientFilterMultiplier)),
    );
    const newCount = Math.round(totalReg * 0.65);
    const returningCount = Math.max(0, totalReg - newCount);
    const walkIns = Math.round(totalReg * 0.24);
    const scheduled = Math.max(0, totalReg - walkIns);
    return {
      totalReg,
      newCount,
      returningCount,
      walkIns,
      scheduled,
      activeCount: Math.round(totalReg * 0.92),
    };
  }, [patientFilterMultiplier]);

  // Filtered records
  const filteredData = useMemo(() => {
    return PATIENT_REPORT_TABLE_DATA.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mobile.includes(searchQuery) ||
        item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender =
        genderFilter === "All Genders" || item.gender === genderFilter;
      const matchesDept =
        deptFilter === "All Departments" || item.department === deptFilter;
      const matchesDoctor =
        doctorFilter === "All Doctors" || item.doctorName === doctorFilter;
      const matchesVisit =
        visitTypeFilter === "All Visit Types" ||
        item.visitType === visitTypeFilter;
      const matchesStatus =
        regStatusFilter === "All Statuses" || item.status === regStatusFilter;

      return (
        matchesSearch &&
        matchesGender &&
        matchesDept &&
        matchesDoctor &&
        matchesVisit &&
        matchesStatus
      );
    });
  }, [
    searchQuery,
    genderFilter,
    deptFilter,
    doctorFilter,
    visitTypeFilter,
    regStatusFilter,
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

  const handleSort = (field: keyof PatientReportRecord) => {
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
                  Patient Report
                </span>
              </nav>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Patient Report
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#009688] border border-teal-200">
                  Demographics Verified
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Analyze patient registrations, demographics, visit history and
                OPD patient activity.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 border border-[#E5E7EB] px-3 py-2 rounded-xl mr-1">
                <Clock className="w-4 h-4 text-[#0D47A1]" />
                <span>
                  Last Updated:{" "}
                  <strong className="text-[#111827]">Today, 10:45 AM</strong>
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
                <span>Export Report</span>
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Patient Name, MRN, Mobile Number, Doctor, Department..."
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
            <span>Filter Patient Demographics & Activity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
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
                Gender
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Genders</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Age Group
              </label>
              <select
                value={ageGroupFilter}
                onChange={(e) => setAgeGroupFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Age Groups</option>
                <option>0â€“12</option>
                <option>13â€“18</option>
                <option>19â€“30</option>
                <option>31â€“45</option>
                <option>46â€“60</option>
                <option>60+</option>
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
                Visit Type
              </label>
              <select
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
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Status
              </label>
              <select
                value={regStatusFilter}
                onChange={(e) => setRegStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Pending Follow-up</option>
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
          appliedFilters.gender !== "All Genders" ||
          appliedFilters.ageGroup !== "All Age Groups" ||
          appliedFilters.dept !== "All Departments" ||
          appliedFilters.doctor !== "All Doctors" ||
          appliedFilters.visitType !== "All Visit Types" ||
          appliedFilters.regStatus !== "All Statuses" ||
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
            {appliedFilters.gender !== "All Genders" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#111827] border border-[#E5E7EB] font-medium">
                Gender: {appliedFilters.gender}
                <button
                  onClick={() => {
                    setGenderFilter("All Genders");
                    setAppliedFilters((prev) => ({
                      ...prev,
                      gender: "All Genders",
                    }));
                  }}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  Ã—
                </button>
              </span>
            )}
            {appliedFilters.visitType !== "All Visit Types" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200 font-medium">
                Type: {appliedFilters.visitType}
                <button
                  onClick={() => {
                    setVisitTypeFilter("All Visit Types");
                    setAppliedFilters((prev) => ({
                      ...prev,
                      visitType: "All Visit Types",
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
              className={`px-2.5 py-1 rounded-lg border text-xs ${hasError ? "bg-red-50 border-red-300 text-[#EF4444]" : "bg-slate-50 border-[#E5E7EB] text-[#64748B]"}`}
            >
              Toggle Error State
            </button>
          </div>
          <span className="text-[11px] text-[#64748B]">
            Simulate real-time patient register states
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
              Unable to Load Patient Report
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Connection timeout while fetching patient demographic database.
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
                {/* Card 1: Total Registered Patients */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Total Registered Patients
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0D47A1]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    {computedPatientStats.totalReg}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#66BB6A] font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +12.8%
                    </span>
                    <span>1,240 monthly total</span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PATIENT_REGISTRATION_TREND_DATA}>
                        <Line
                          type="monotone"
                          dataKey="Total"
                          stroke="#0D47A1"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 2: New Patients */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      New Patients
                    </span>
                    <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    34
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#009688] font-semibold">
                      +18.2% vs last week
                    </span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PATIENT_REGISTRATION_TREND_DATA}>
                        <Area
                          type="monotone"
                          dataKey="New"
                          stroke="#009688"
                          fill="#009688"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 3: Returning Patients */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Returning Patients
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#66BB6A]">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    24
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2">
                    <span className="text-[#66BB6A] font-semibold">
                      16 Repeat | 8 Follow-up
                    </span>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PATIENT_REGISTRATION_TREND_DATA}>
                        <Line
                          type="monotone"
                          dataKey="Returning"
                          stroke="#66BB6A"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 4: Walk-In Patients */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Walk-In Patients
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    8
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    26 Scheduled Appointments
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden mt-3">
                    <div
                      className="bg-[#F59E0B] h-full"
                      style={{ width: "24%" }}
                    />
                    <div
                      className="bg-[#0D47A1] h-full"
                      style={{ width: "76%" }}
                    />
                  </div>
                </div>

                {/* Card 5: Gender Distribution Mini */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Gender Distribution
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-50 text-[#0D47A1]">
                      <PieChart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#111827] mb-1">
                    Male: 50% | Female: 46%
                  </div>
                  <div className="text-[11px] text-[#64748B] mb-2">
                    Other: 4%
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                    <div
                      className="bg-[#0D47A1] h-full"
                      style={{ width: "50%" }}
                    />
                    <div
                      className="bg-[#009688] h-full"
                      style={{ width: "46%" }}
                    />
                    <div
                      className="bg-[#4DB6AC] h-full"
                      style={{ width: "4%" }}
                    />
                  </div>
                </div>

                {/* Card 6: Average Daily Registrations */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#64748B]">
                      Avg Daily Registrations
                    </span>
                    <div
                      className="text-2xl font-bold text-[#111827] mt-1"
                      style={{ fontFamily: PP }}
                    >
                      42 / day
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Peak Day: Monday (58)
                    </p>
                    <div className="mt-1 text-[11px] font-semibold text-[#66BB6A]">
                      âœ“ Optimal Intake Capacity
                    </div>
                  </div>
                  <CircularProgress percentage={84} size={64} strokeWidth={7} />
                </div>
              </div>

              {/* PATIENT REGISTRATION TREND AREA CHART */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Patient Registration Trend
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Daily volume tracking of new vs returning registered
                      patients
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
                      data={PATIENT_REGISTRATION_TREND_DATA}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorNewGrad"
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
                          id="colorRetGrad"
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
                        dataKey="New"
                        name="New Patients"
                        stroke="#009688"
                        fillOpacity={1}
                        fill="url(#colorNewGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Returning"
                        name="Returning Patients"
                        stroke="#0D47A1"
                        fillOpacity={1}
                        fill="url(#colorRetGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AGE DISTRIBUTION & GENDER DISTRIBUTION CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Age Distribution Vertical Bar */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Patient Age Demographics
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Distribution of patients across age groups
                      </p>
                    </div>
                    <Users className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={AGE_DISTRIBUTION_DATA}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="group"
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
                          name="Patient Count"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gender Distribution Donut */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Gender Breakdown
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Ratio of Male, Female, and Other registrations
                      </p>
                    </div>
                    <PieChart className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={GENDER_DISTRIBUTION_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {GENDER_DISTRIBUTION_DATA.map((entry, index) => (
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

              {/* DEPARTMENT PATIENT VISITS & DOCTOR PATIENT DISTRIBUTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Visits Horizontal Bar */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Department-wise Patient Visits
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Total patient visits per specialty department
                      </p>
                    </div>
                    <Building2 className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={DEPT_PATIENT_VISITS_DATA}
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
                          dataKey="total"
                          name="Total Visits"
                          fill="#009688"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Doctor Patient Distribution Vertical Bar */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Doctor-wise Patient Workload
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Assigned patient load per attending physician
                      </p>
                    </div>
                    <UserCheck className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={DOCTOR_PATIENT_DATA}
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
                          dataKey="assigned"
                          name="Assigned Patients"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* PATIENT REPORT TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Patient Master Register
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Detailed OPD patient demographic and visit registry
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      alert("Exporting Patient Master Register (CSV)...")
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
                          onClick={() => handleSort("mrn")}
                        >
                          MRN{" "}
                          {sortField === "mrn" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th
                          className="py-3.5 px-4 cursor-pointer hover:text-[#0D47A1]"
                          onClick={() => handleSort("patientName")}
                        >
                          Patient Name{" "}
                          {sortField === "patientName" &&
                            (sortOrder === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th className="py-3.5 px-4">Age / Gender</th>
                        <th className="py-3.5 px-4">Mobile</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Attending Doctor</th>
                        <th className="py-3.5 px-4">Reg. Date</th>
                        <th className="py-3.5 px-4">Visit Type</th>
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
                            No patient records match the selected filter
                            criteria.
                          </td>
                        </tr>
                      ) : (
                        sortedData.map((item) => (
                          <tr
                            key={item.mrn}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                              {item.mrn}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#111827]">
                              {item.patientName}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.age} yrs / {item.gender}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.mobile}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-[#111827]">
                              {item.department}
                            </td>
                            <td className="py-3.5 px-4 text-[#111827]">
                              {item.doctorName}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.registrationDate}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-[#64748B] text-[10px] font-medium">
                                {item.visitType}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${item.status === "Active" ? "bg-teal-50 border-teal-200 text-[#009688]" : item.status === "Completed" ? "bg-green-50 border-green-200 text-[#66BB6A]" : "bg-amber-50 border-amber-200 text-[#F59E0B]"}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() =>
                                    alert(
                                      `Viewing profile for ${item.patientName}`,
                                    )
                                  }
                                  className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                  title="View Patient"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    alert(`Printing summary for ${item.mrn}`)
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

              {/* RECENT PATIENT VISIT ACTIVITY TIMELINE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3
                  className="text-base font-bold text-[#111827] mb-4"
                  style={{ fontFamily: PP }}
                >
                  Recent Patient Registration & Visit Activity
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7EB]">
                  {RECENT_PATIENT_TIMELINE.map((act) => (
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
                            {act.patient} ({act.mrn})
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            {act.time}
                          </span>
                        </div>
                        <p className="text-[#64748B]">
                          Event:{" "}
                          <strong className="text-[#0D47A1]">{act.type}</strong>{" "}
                          with{" "}
                          <span className="font-semibold text-[#111827]">
                            {act.doctor}
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
                    <span>Patient Summary</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Live OPD registration highlights
                  </p>
                </div>

                {/* Active Scope Summary */}
                <div className="bg-[#F1F5F9] rounded-xl p-3 border border-[#E5E7EB] text-xs space-y-1.5">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">
                    Intake Overview
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Selected Range:</span>
                    <span className="font-semibold text-[#111827]">
                      {dateRange}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Total Patients:</span>
                    <span className="font-bold text-[#0D47A1]">58</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">New Patients:</span>
                    <span className="font-bold text-[#009688]">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Returning Patients:</span>
                    <span className="font-bold text-[#66BB6A]">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Walk-Ins:</span>
                    <span className="font-bold text-[#F59E0B]">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Avg Daily Intake:</span>
                    <span className="font-bold text-[#111827]">42 / day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Most Active Dept:</span>
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

                    {onOpenDoctorReport && (
                      <button
                        onClick={onOpenDoctorReport}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#111827]"
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-[#66BB6A]" />
                          <span>Open Doctor Report</span>
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
                    <span>Demographics RBAC Verified</span>
                  </div>
                  <span>
                    Read-only analytics access granted for Hospital Admin
                    demographic oversight.
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
              {filteredData.length} Patient Report Results
            </strong>
          </div>
          <div>Hospital Management System â€¢ Patient Report v1.0</div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">2026-07-26 01:10</strong>
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
                Export Patient Report
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
                  Patient_Report_{dateRange.replace(/\s+/g, "_")}.
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
                    `Exporting Patient Report as ${exportFormat.toUpperCase()}...`,
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
