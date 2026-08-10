import  { useState} from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  UserCheck,
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  PieChart,
  Eye,
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


export type DoctorKpiKey =
  | "today-appointments"
  | "completed-consultations"
  | "my-patients"
  | "returning-patients"
  | "followup-patients"
  | "avg-consult-time"
  | "patient-satisfaction";

interface DoctorKpiMeta {
  key: DoctorKpiKey;
  title: string;
  value: string;
  yesterdayComp: string;
  monthlyComp: string;
  growth: string;
  isPositive: boolean;
  unit: string;
}

const DOCTOR_KPI_METADATA_MAP: Record<DoctorKpiKey, DoctorKpiMeta> = {
  "today-appointments": {
    key: "today-appointments",
    title: "Today's Appointments",
    value: "32",
    yesterdayComp: "28 (+14.2%)",
    monthlyComp: "134 Total",
    growth: "+14.2%",
    isPositive: true,
    unit: "Appts",
  },
  "completed-consultations": {
    key: "completed-consultations",
    title: "Completed Consultations",
    value: "28",
    yesterdayComp: "24 (+16.6%)",
    monthlyComp: "118 Total",
    growth: "+16.6%",
    isPositive: true,
    unit: "Done",
  },
  "my-patients": {
    key: "my-patients",
    title: "My Patients",
    value: "58",
    yesterdayComp: "54 (+7.4%)",
    monthlyComp: "58 Total",
    growth: "+7.4%",
    isPositive: true,
    unit: "Patients",
  },
  "returning-patients": {
    key: "returning-patients",
    title: "Returning Patients",
    value: "10",
    yesterdayComp: "8 (+25.0%)",
    monthlyComp: "36 Total",
    growth: "+25.0%",
    isPositive: true,
    unit: "Visits",
  },
  "followup-patients": {
    key: "followup-patients",
    title: "Follow-up Patients",
    value: "8",
    yesterdayComp: "6 (+33.3%)",
    monthlyComp: "24 Done",
    growth: "+33.3%",
    isPositive: true,
    unit: "Follow-ups",
  },
  "avg-consult-time": {
    key: "avg-consult-time",
    title: "Average Consultation Time",
    value: "14.2 min",
    yesterdayComp: "15.5m (-8.3%)",
    monthlyComp: "14.5m Avg",
    growth: "-8.3%",
    isPositive: true,
    unit: "Minutes",
  },
  "patient-satisfaction": {
    key: "patient-satisfaction",
    title: "Patient Satisfaction",
    value: "4.9 / 5.0",
    yesterdayComp: "4.8 (+2.1%)",
    monthlyComp: "42 Reviews",
    growth: "+2.1%",
    isPositive: true,
    unit: "Rating",
  },
};

const DOCTOR_KPI_TREND_SERIES: Record<
  DoctorKpiKey,
  { date: string; current: number; previous: number; growth: string }[]
> = {
  "today-appointments": [
    { date: "Jul 20", current: 22, previous: 20, growth: "+10.0%" },
    { date: "Jul 21", current: 25, previous: 22, growth: "+13.6%" },
    { date: "Jul 22", current: 20, previous: 19, growth: "+5.2%" },
    { date: "Jul 23", current: 28, previous: 24, growth: "+16.6%" },
    { date: "Jul 24", current: 26, previous: 23, growth: "+13.0%" },
    { date: "Jul 25", current: 30, previous: 25, growth: "+20.0%" },
    { date: "Jul 26", current: 32, previous: 28, growth: "+14.2%" },
  ],
  "completed-consultations": [
    { date: "Jul 20", current: 18, previous: 16, growth: "+12.5%" },
    { date: "Jul 21", current: 21, previous: 18, growth: "+16.6%" },
    { date: "Jul 22", current: 17, previous: 15, growth: "+13.3%" },
    { date: "Jul 23", current: 24, previous: 20, growth: "+20.0%" },
    { date: "Jul 24", current: 22, previous: 19, growth: "+15.7%" },
    { date: "Jul 25", current: 26, previous: 22, growth: "+18.1%" },
    { date: "Jul 26", current: 28, previous: 24, growth: "+16.6%" },
  ],
  "my-patients": [
    { date: "Jul 20", current: 48, previous: 44, growth: "+9.0%" },
    { date: "Jul 21", current: 50, previous: 45, growth: "+11.1%" },
    { date: "Jul 22", current: 52, previous: 47, growth: "+10.6%" },
    { date: "Jul 23", current: 54, previous: 48, growth: "+12.5%" },
    { date: "Jul 24", current: 55, previous: 50, growth: "+10.0%" },
    { date: "Jul 25", current: 56, previous: 52, growth: "+7.6%" },
    { date: "Jul 26", current: 58, previous: 54, growth: "+7.4%" },
  ],
  "returning-patients": [
    { date: "Jul 20", current: 6, previous: 5, growth: "+20.0%" },
    { date: "Jul 21", current: 7, previous: 6, growth: "+16.6%" },
    { date: "Jul 22", current: 6, previous: 5, growth: "+20.0%" },
    { date: "Jul 23", current: 8, previous: 6, growth: "+33.3%" },
    { date: "Jul 24", current: 8, previous: 7, growth: "+14.2%" },
    { date: "Jul 25", current: 9, previous: 7, growth: "+28.5%" },
    { date: "Jul 26", current: 10, previous: 8, growth: "+25.0%" },
  ],
  "followup-patients": [
    { date: "Jul 20", current: 4, previous: 3, growth: "+33.3%" },
    { date: "Jul 21", current: 5, previous: 4, growth: "+25.0%" },
    { date: "Jul 22", current: 4, previous: 3, growth: "+33.3%" },
    { date: "Jul 23", current: 6, previous: 5, growth: "+20.0%" },
    { date: "Jul 24", current: 6, previous: 5, growth: "+20.0%" },
    { date: "Jul 25", current: 7, previous: 6, growth: "+16.6%" },
    { date: "Jul 26", current: 8, previous: 6, growth: "+33.3%" },
  ],
  "avg-consult-time": [
    { date: "Jul 20", current: 15.2, previous: 16.5, growth: "-7.8%" },
    { date: "Jul 21", current: 14.8, previous: 16.0, growth: "-7.5%" },
    { date: "Jul 22", current: 16.0, previous: 17.2, growth: "-6.9%" },
    { date: "Jul 23", current: 13.9, previous: 15.5, growth: "-10.3%" },
    { date: "Jul 24", current: 14.5, previous: 15.8, growth: "-8.2%" },
    { date: "Jul 25", current: 14.0, previous: 15.2, growth: "-7.8%" },
    { date: "Jul 26", current: 14.2, previous: 15.5, growth: "-8.3%" },
  ],
  "patient-satisfaction": [
    { date: "Jul 20", current: 4.7, previous: 4.6, growth: "+2.1%" },
    { date: "Jul 21", current: 4.8, previous: 4.6, growth: "+4.3%" },
    { date: "Jul 22", current: 4.7, previous: 4.5, growth: "+4.4%" },
    { date: "Jul 23", current: 4.9, previous: 4.7, growth: "+4.2%" },
    { date: "Jul 24", current: 4.8, previous: 4.7, growth: "+2.1%" },
    { date: "Jul 25", current: 4.9, previous: 4.7, growth: "+4.2%" },
    { date: "Jul 26", current: 4.9, previous: 4.8, growth: "+2.1%" },
  ],
};

const DOCTOR_KPI_DONUT_MAP: Record<
  DoctorKpiKey,
  { name: string; value: number; color: string }[]
> = {
  "today-appointments": [
    { name: "Completed", value: 28, color: "#66BB6A" },
    { name: "Scheduled", value: 2, color: "#0D47A1" },
    { name: "Waiting", value: 1, color: "#F59E0B" },
    { name: "Cancelled", value: 1, color: "#EF4444" },
  ],
  "completed-consultations": [
    { name: "Completed", value: 28, color: "#66BB6A" },
    { name: "Pending", value: 2, color: "#F59E0B" },
    { name: "Cancelled", value: 1, color: "#EF4444" },
    { name: "Follow-up", value: 1, color: "#0D47A1" },
  ],
  "my-patients": [
    { name: "New Patients", value: 18, color: "#009688" },
    { name: "Returning Patients", value: 10, color: "#0D47A1" },
    { name: "Routine Patients", value: 24, color: "#4DB6AC" },
    { name: "Walk-In Patients", value: 6, color: "#F59E0B" },
  ],
  "returning-patients": [
    { name: "Follow-up 1 Week", value: 5, color: "#0D47A1" },
    { name: "Follow-up 2 Weeks", value: 3, color: "#009688" },
    { name: "Follow-up 1 Month", value: 2, color: "#66BB6A" },
  ],
  "followup-patients": [
    { name: "Completed", value: 24, color: "#66BB6A" },
    { name: "Scheduled", value: 5, color: "#0D47A1" },
    { name: "Pending", value: 2, color: "#F59E0B" },
    { name: "Missed", value: 1, color: "#EF4444" },
  ],
  "avg-consult-time": [
    { name: "Under 10 Min", value: 4, color: "#66BB6A" },
    { name: "10 - 15 Min", value: 20, color: "#009688" },
    { name: "15 - 20 Min", value: 6, color: "#F59E0B" },
    { name: "Over 20 Min", value: 2, color: "#EF4444" },
  ],
  "patient-satisfaction": [
    { name: "5 Star Rating", value: 36, color: "#66BB6A" },
    { name: "4 Star Rating", value: 5, color: "#009688" },
    { name: "3 Star Rating", value: 1, color: "#F59E0B" },
  ],
};

const DOCTOR_KPI_SHIFT_CONTRIBUTORS = [
  { category: "Morning Shift (08am-12pm)", volume: 18 },
  { category: "Afternoon Shift (01pm-04pm)", volume: 10 },
  { category: "Evening Shift (05pm-08pm)", volume: 4 },
];

const DOCTOR_RECENT_KPI_TIMELINE = [
  {
    id: "DKPI-101",
    action: "Consultation Completed",
    detail: "Completed consultation for Sarah Mitchell (MRN-89201)",
    date: "Jul 26",
    time: "10:40 AM",
    status: "Completed",
  },
  {
    id: "DKPI-102",
    action: "Prescription Issued",
    detail: "Rx issued for James Thornton (MRN-89202)",
    date: "Jul 26",
    time: "10:15 AM",
    status: "Completed",
  },
  {
    id: "DKPI-103",
    action: "Patient Checked-In",
    detail: "Michael Chang checked in at reception desk",
    date: "Jul 26",
    time: "09:40 AM",
    status: "Waiting",
  },
  {
    id: "DKPI-104",
    action: "Follow-up Scheduled",
    detail: "Scheduled 2-week follow-up for Emma Reyes",
    date: "Jul 26",
    time: "09:15 AM",
    status: "Scheduled",
  },
  {
    id: "DKPI-105",
    action: "Patient Feedback Submitted",
    detail: "Aisha Kumar rated consultation 5/5 stars",
    date: "Jul 25",
    time: "04:50 PM",
    status: "Active",
  },
];

export function DoctorDashboardKpiDetailScreen({
  initialKpiKey = "today-appointments",
  onBack,
  onOpenReport,
}: {
  initialKpiKey?: DoctorKpiKey;
  onBack?: () => void;
  onOpenReport?: (view: string) => void;
}) {
  const [selectedKpi, setSelectedKpi] = useState<DoctorKpiKey>(initialKpiKey);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [consultStatusFilter, setConsultStatusFilter] =
    useState("All Statuses");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All Visit Types");
  const [followUpStatusFilter, setFollowUpStatusFilter] = useState(
    "All Follow-up Statuses",
  );
  const [shiftFilter, setShiftFilter] = useState("All Shifts");

  const [trendDays, setTrendDays] = useState<
    "7 Days" | "30 Days" | "90 Days" | "1 Year"
  >("7 Days");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const meta =
    DOCTOR_KPI_METADATA_MAP[selectedKpi] ||
    DOCTOR_KPI_METADATA_MAP["today-appointments"];
  const trendData =
    DOCTOR_KPI_TREND_SERIES[selectedKpi] ||
    DOCTOR_KPI_TREND_SERIES["today-appointments"];
  const donutData =
    DOCTOR_KPI_DONUT_MAP[selectedKpi] ||
    DOCTOR_KPI_DONUT_MAP["today-appointments"];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRange("Today");
    setConsultStatusFilter("All Statuses");
    setVisitTypeFilter("All Visit Types");
    setFollowUpStatusFilter("All Follow-up Statuses");
    setShiftFilter("All Shifts");
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
                  Doctor
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
                  Dashboard KPI Detail
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D47A1]/10 text-[#0D47A1] border border-blue-200">
                  Doctor KPI Drill-down
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                View detailed analytics for your selected KPI.
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
                  alert(`Exporting KPI Detail (${meta.title}) PDF...`)
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
        {/* LARGE HIGHLIGHT CARD (KPI SWITCHER) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Selected KPI Focus
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedKpi}
                  onChange={(e) =>
                    setSelectedKpi(e.target.value as DoctorKpiKey)
                  }
                  className="bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-base font-bold text-[#111827] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  <option value="today-appointments">
                    Today's Appointments
                  </option>
                  <option value="completed-consultations">
                    Completed Consultations
                  </option>
                  <option value="my-patients">My Patients</option>
                  <option value="returning-patients">Returning Patients</option>
                  <option value="followup-patients">Follow-up Patients</option>
                  <option value="avg-consult-time">
                    Average Consultation Time
                  </option>
                  <option value="patient-satisfaction">
                    Patient Satisfaction
                  </option>
                </select>
                <span className="px-3 py-1 bg-teal-50 text-[#009688] font-bold text-xs rounded-full border border-teal-200">
                  {meta.growth} Growth
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#F1F5F9] p-3 rounded-xl border border-[#E5E7EB]">
                <div className="text-[#64748B] text-[11px]">Current Value</div>
                <div
                  className="text-xl font-bold text-[#111827] mt-0.5"
                  style={{ fontFamily: PP }}
                >
                  {meta.value}
                </div>
              </div>
              <div className="bg-[#F1F5F9] p-3 rounded-xl border border-[#E5E7EB]">
                <div className="text-[#64748B] text-[11px]">
                  Yesterday Comparison
                </div>
                <div className="text-sm font-semibold text-[#009688] mt-1">
                  {meta.yesterdayComp}
                </div>
              </div>
              <div className="bg-[#F1F5F9] p-3 rounded-xl border border-[#E5E7EB] col-span-2 sm:col-span-1">
                <div className="text-[#64748B] text-[11px]">
                  Monthly Benchmark
                </div>
                <div className="text-sm font-semibold text-[#0D47A1] mt-1">
                  {meta.monthlyComp}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, consultation ID, appointment ID..."
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
              <span>Filter KPI Drill-down Data</span>
            </div>
            <span className="text-[11px] text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">
              Filter: Logged-in Doctor (Dr. Sarah Jenkins)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                Consultation Status
              </label>
              <select
                value={consultStatusFilter}
                onChange={(e) => setConsultStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Statuses</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Cancelled</option>
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
                Follow-up Status
              </label>
              <select
                value={followUpStatusFilter}
                onChange={(e) => setFollowUpStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Follow-up Statuses</option>
                <option>Completed</option>
                <option>Scheduled</option>
                <option>Pending</option>
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
                <option>Morning (08am-12pm)</option>
                <option>Afternoon (01pm-04pm)</option>
                <option>Evening (05pm-08pm)</option>
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
            Simulate Doctor KPI drill-down state
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
              Unable to Load KPI Details
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Connection error while loading KPI drill-down analytics. Please
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
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 h-64 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 h-64 animate-pulse"></div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 h-64 animate-pulse"></div>
            </div>
          </div>
        )}

        {!isLoading && !hasError && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT MAIN CONTENT AREA (3 Cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* KPI PERFORMANCE TREND & PERIOD COMPARISON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* KPI Performance Trend Area Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        KPI Performance Trend
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        {meta.title} performance over time
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] text-[10px]">
                      {(
                        ["7 Days", "30 Days", "90 Days", "1 Year"] as const
                      ).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTrendDays(t)}
                          className={`px-2 py-0.5 rounded-lg font-medium transition ${trendDays === t ? "bg-[#0D47A1] text-white shadow-sm" : "text-[#64748B]"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={trendData}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="docKpiTrendGrad"
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
                          dataKey="current"
                          name="Current Value"
                          stroke="#0D47A1"
                          fillOpacity={1}
                          fill="url(#docKpiTrendGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Period Comparison Grouped Bar Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Period Comparison
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Current vs previous period performance
                      </p>
                    </div>
                    <Activity className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={trendData}
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
                        <Bar
                          dataKey="current"
                          name="Current Period"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="previous"
                          name="Previous Period"
                          fill="#4DB6AC"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* KPI DISTRIBUTION DONUT & TOP CONTRIBUTORS HORIZONTAL BAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* KPI Distribution Donut Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        KPI Category Breakdown
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Distribution for {meta.title}
                      </p>
                    </div>
                    <PieChart className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => (
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

                {/* Top Contributors Horizontal Bar Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Shift Workload Contributors
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Volume contributed per shift slot
                      </p>
                    </div>
                    <UserCheck className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={DOCTOR_KPI_SHIFT_CONTRIBUTORS}
                        margin={{ top: 5, right: 10, left: 45, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#64748B" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="category"
                          tick={{ fontSize: 9, fill: "#111827" }}
                          width={130}
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
                          dataKey="volume"
                          name="Volume"
                          fill="#009688"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* DYNAMIC KPI DETAILS TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      {meta.title} Register
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Detailed records contributing to selected KPI
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      alert(`Exporting ${meta.title} Register (CSV)...`)
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
                        <th className="py-3.5 px-4">Record ID / MRN</th>
                        <th className="py-3.5 px-4">Patient Name</th>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Visit Type / Diagnosis</th>
                        <th className="py-3.5 px-4 text-center">
                          Status / Rating
                        </th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {[
                        {
                          id: "APT-901",
                          patient: "Sarah Mitchell",
                          date: "2026-07-26 09:00 AM",
                          detail: "New Patient â€¢ Hypertension",
                          status: "Completed",
                        },
                        {
                          id: "APT-902",
                          patient: "James Thornton",
                          date: "2026-07-26 09:30 AM",
                          detail: "Follow-up â€¢ Bronchitis",
                          status: "Completed",
                        },
                        {
                          id: "APT-903",
                          patient: "Emma Reyes",
                          date: "2026-07-26 10:00 AM",
                          detail: "Routine Checkup â€¢ Diabetes",
                          status: "Completed",
                        },
                        {
                          id: "APT-904",
                          patient: "Aisha Kumar",
                          date: "2026-07-26 10:30 AM",
                          detail: "Follow-up â€¢ Migraine",
                          status: "In Progress",
                        },
                        {
                          id: "APT-905",
                          patient: "Michael Chang",
                          date: "2026-07-26 11:00 AM",
                          detail: "New Patient â€¢ Osteoarthritis",
                          status: "Scheduled",
                        },
                      ].map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-bold text-[#0D47A1]">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#111827]">
                            {item.patient}
                          </td>
                          <td className="py-3.5 px-4 text-[#64748B]">
                            {item.date}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#111827]">
                            {item.detail}
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
                                  alert(`Viewing details for ${item.patient}`)
                                }
                                className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  alert(`Printing record for ${item.id}`)
                                }
                                className="p-1.5 text-[#64748B] hover:bg-slate-100 rounded-lg transition"
                                title="Print Record"
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

                {/* Table Pagination */}
                <div className="p-4 bg-[#F1F5F9] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
                  <span>Showing 1 to 5 of 5 entries</span>
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

              {/* PERSONAL INSIGHTS PANEL (OBSERVATIONAL RULES) */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#009688]" />
                  <h3
                    className="text-base font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    Personal Observational Insights
                  </h3>
                  <span className="ml-auto text-[11px] font-semibold text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Informational Only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                    <div className="font-bold text-[#009688] mb-1">
                      Consultation Efficiency +12%
                    </div>
                    <p className="text-[#64748B]">
                      Completed consultations increased by 12% compared to last
                      week.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="font-bold text-[#0D47A1] mb-1">
                      Follow-up Compliance +9%
                    </div>
                    <p className="text-[#64748B]">
                      Scheduled follow-up completion improved by 9% across
                      morning slots.
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="font-bold text-[#66BB6A] mb-1">
                      Avg Consult Time -3.0 min
                    </div>
                    <p className="text-[#64748B]">
                      Average consultation duration reduced from 17.2m to 14.2m.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="font-bold text-[#F59E0B] mb-1">
                      Satisfaction Rating 4.9â˜…
                    </div>
                    <p className="text-[#64748B]">
                      98% of patients provided 5-star feedback for your care
                      quality.
                    </p>
                  </div>
                </div>
              </div>

              {/* RECENT KPI ACTIVITIES TIMELINE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3
                  className="text-base font-bold text-[#111827] mb-4"
                  style={{ fontFamily: PP }}
                >
                  Recent KPI Activity Logs
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7EB]">
                  {DOCTOR_RECENT_KPI_TIMELINE.map((act) => (
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
                    <span>KPI Summary</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Live selected KPI overview
                  </p>
                </div>

                {/* Metrics Overview */}
                <div className="bg-[#F1F5F9] rounded-xl p-3 border border-[#E5E7EB] text-xs space-y-2">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">
                    Selected Focus
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Selected KPI:</span>
                    <span className="font-bold text-[#111827]">
                      {meta.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Current Value:</span>
                    <span className="font-bold text-[#0D47A1]">
                      {meta.value}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Growth %:</span>
                    <span className="font-bold text-[#66BB6A]">
                      {meta.growth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Applied Filters:</span>
                    <span className="font-bold text-[#111827]">
                      {dateRange}
                    </span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-2 flex justify-between">
                    <span className="text-[#64748B]">Last Updated:</span>
                    <span className="font-semibold text-[#111827]">
                      11:45 AM
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

                    {onBack && (
                      <button
                        onClick={onBack}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#009688]"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronLeft className="w-3.5 h-3.5 text-[#009688]" />
                          <span>Back to Reports Dashboard</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                    )}

                    {onOpenReport && (
                      <button
                        onClick={() => onOpenReport("daily-appointments")}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#0D47A1]"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#0D47A1]" />
                          <span>Open Related Report</span>
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
                    <span>Doctor KPI Scope Verified</span>
                  </div>
                  <span>
                    Read-only KPI drill-down analytics for logged-in doctor
                    performance.
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
              Doctor KPI Analytics ({meta.title})
            </strong>
          </div>
          <div>
            Hospital Management System â€¢ Doctor Dashboard KPI Detail v1.0
          </div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">2026-07-26 13:19</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
