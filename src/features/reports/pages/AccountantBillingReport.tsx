import { useState, useMemo } from "react";
import {
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  PieChart,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  AlertCircle,
  Shield,
  FileSpreadsheet,
  CreditCard,
  DollarSign,
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

export function AccountantBillingReportScreen({
  onBack,
  onOpenDailyRevenue,
}: {
  onBack?: () => void;
  onOpenDailyRevenue?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState(
    "All Invoice Statuses",
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(
    "All Payment Statuses",
  );
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(
    "All Payment Methods",
  );
  const [collectedByFilter, setCollectedByFilter] = useState("All Collectors");

  const [trendRange, setTrendRange] = useState<
    "7 Days" | "30 Days" | "90 Days"
  >("7 Days");
  const [collectionFreq, setCollectionFreq] = useState<
    "Daily" | "Weekly" | "Monthly"
  >("Daily");

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
    setInvoiceStatusFilter("All Invoice Statuses");
    setPaymentStatusFilter("All Payment Statuses");
    setPaymentMethodFilter("All Payment Methods");
    setCollectedByFilter("All Collectors");
  };

  const filteredBillingRows = useMemo(() => {
    return ACCOUNTANT_BILLING_TABLE_DATA.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        paymentStatusFilter === "All Payment Statuses" ||
        item.paymentStatus === paymentStatusFilter;
      const matchesInvoiceStatus =
        invoiceStatusFilter === "All Invoice Statuses" ||
        item.invoiceStatus === invoiceStatusFilter;
      const matchesMethod =
        paymentMethodFilter === "All Payment Methods" ||
        item.paymentMethod === paymentMethodFilter;
      return (
        matchesSearch && matchesStatus && matchesInvoiceStatus && matchesMethod
      );
    });
  }, [
    searchQuery,
    paymentStatusFilter,
    invoiceStatusFilter,
    paymentMethodFilter,
  ]);

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
                  Accountant
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
                  Billing Report
                </span>
              </nav>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  Billing Report
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D47A1]/10 text-[#0D47A1] border border-blue-200">
                  Accountant Scoped
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monitor invoices, payments, collections and billing performance.
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
                onClick={() => alert("Exporting Billing Report (PDF)...")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#0D47A1] hover:bg-blue-900 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => alert("Exporting Billing Report (Excel)...")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#009688] bg-teal-50 border border-teal-200 hover:bg-teal-100 transition shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel</span>
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
              placeholder="Search Invoice ID, Patient Name, MRN, Payment Reference..."
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

        {/* Accountant Billing Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex items-center gap-2 text-xs font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              <Filter className="w-4 h-4 text-[#009688]" />
              <span>Filter Billing Operations Data</span>
            </div>
            <span className="text-[11px] text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">
              Accountant Role Scoped
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
                Invoice Status
              </label>
              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Invoice Statuses</option>
                <option>Issued</option>
                <option>Cleared</option>
                <option>Overdue</option>
                <option>Cancelled</option>
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
                <option>All Payment Statuses</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Partially Paid</option>
                <option>Refunded</option>
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
                <option>All Payment Methods</option>
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                Collected By
              </label>
              <select
                value={collectedByFilter}
                onChange={(e) => setCollectedByFilter(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-2 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
              >
                <option>All Collectors</option>
                <option>Robert Vance</option>
                <option>Elena Rostova</option>
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
            Simulate Billing report state
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
              Unable to Load Billing Report
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Connection error while loading invoice billing data. Please retry.
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
              {/* TOP 6 ACCOUNTANT BILLING KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Total Invoices */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Total Invoices
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0D47A1]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    48
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#66BB6A] font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +12.4% Growth
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#0D47A1] font-bold">48</div>
                      <div className="text-[#64748B]">Generated</div>
                    </div>
                    <div>
                      <div className="text-[#009688] font-bold">+12.4%</div>
                      <div className="text-[#64748B]">Growth</div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Paid Invoices */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Paid Invoices
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
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#66BB6A] font-semibold">
                      87.5% Collection Rate
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#66BB6A] font-bold">42</div>
                      <div className="text-[#64748B]">Paid Count</div>
                    </div>
                    <div>
                      <div className="text-[#0D47A1] font-bold">87.5%</div>
                      <div className="text-[#64748B]">Rate</div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Pending Payments */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Pending Payments
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    6
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#F59E0B] font-semibold">
                      $3,250 Outstanding
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#F59E0B] font-bold">6</div>
                      <div className="text-[#64748B]">Invoices</div>
                    </div>
                    <div>
                      <div className="text-[#0D47A1] font-bold">$3,250</div>
                      <div className="text-[#64748B]">Amount</div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Partially Paid */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Partially Paid
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0D47A1]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    2
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#0D47A1] font-semibold">
                      $300 Remaining Balance
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#0D47A1] font-bold">2</div>
                      <div className="text-[#64748B]">Partial Count</div>
                    </div>
                    <div>
                      <div className="text-[#F59E0B] font-bold">$300</div>
                      <div className="text-[#64748B]">Balance</div>
                    </div>
                  </div>
                </div>

                {/* Card 5: Refunded Bills */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Refunded Bills
                    </span>
                    <div className="p-2 rounded-xl bg-red-50 text-[#EF4444]">
                      <XCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className="text-2xl font-bold text-[#111827] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    $450
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-3">
                    <span className="text-[#EF4444] font-semibold">
                      2 Refund Invoices
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-2 border-t border-[#E5E7EB] text-[11px] text-center">
                    <div>
                      <div className="text-[#EF4444] font-bold">2</div>
                      <div className="text-[#64748B]">Count</div>
                    </div>
                    <div>
                      <div className="text-[#64748B] font-bold">$450</div>
                      <div className="text-[#64748B]">Amount</div>
                    </div>
                  </div>
                </div>

                {/* Card 6: Average Invoice Value */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#64748B]">
                      Average Invoice Value
                    </span>
                    <div
                      className="text-2xl font-bold text-[#111827] mt-1"
                      style={{ fontFamily: PP }}
                    >
                      $309.38
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Daily Total: $14,850
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-[#66BB6A]">
                      âœ“ Target Met
                    </div>
                  </div>
                  <CircularProgress percentage={90} size={64} strokeWidth={7} />
                </div>
              </div>

              {/* BILLING TREND & PAYMENT STATUS DISTRIBUTION CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing Trend Area Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Billing & Invoice Trend
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Invoices generated vs paid vs outstanding vs refunded
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] text-[10px]">
                      {(["7 Days", "30 Days", "90 Days"] as const).map((r) => (
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
                        data={ACCOUNTANT_BILLING_TREND_SERIES}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="accBillGenGrad"
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
                            id="accBillPaidGrad"
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
                          dataKey="revenue"
                          name="Invoices Generated ($)"
                          stroke="#0D47A1"
                          fillOpacity={1}
                          fill="url(#accBillGenGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="collections"
                          name="Invoices Paid ($)"
                          stroke="#66BB6A"
                          fillOpacity={1}
                          fill="url(#accBillPaidGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Payment Status Distribution Donut Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Payment Status Distribution
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Invoice breakdown by payment status
                      </p>
                    </div>
                    <PieChart className="w-4 h-4 text-[#009688]" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={ACCOUNTANT_PAYMENT_STATUS_DONUT}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {ACCOUNTANT_PAYMENT_STATUS_DONUT.map(
                            (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
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

              {/* PAYMENT METHOD ANALYSIS & COLLECTION PERFORMANCE CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method Analysis Vertical Bar Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Payment Method Analysis
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Collected amount by payment mode
                      </p>
                    </div>
                    <CreditCard className="w-4 h-4 text-[#0D47A1]" />
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ACCOUNTANT_PAYMENT_METHOD_BAR}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="method"
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
                          dataKey="amount"
                          name="Collected Amount ($)"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Collection Performance Grouped Bar Chart */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        Collection Performance
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Generated vs collected vs outstanding
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] text-[10px]">
                      {(["Daily", "Weekly", "Monthly"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setCollectionFreq(f)}
                          className={`px-2 py-0.5 rounded-lg font-medium transition ${collectionFreq === f ? "bg-[#009688] text-white shadow-sm" : "text-[#64748B]"}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ACCOUNTANT_METHOD_PERFORMANCE_BAR}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="period"
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
                          dataKey="generated"
                          name="Generated ($)"
                          fill="#0D47A1"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="collected"
                          name="Collected ($)"
                          fill="#009688"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* BILLING REPORT DATA TABLE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold text-[#111827]"
                      style={{ fontFamily: PP }}
                    >
                      Billing Report Ledger
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Detailed log of hospital invoices, payment statuses, and
                      balance breakdown
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        alert("Exporting Billing Ledger (Excel)...")
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-xs font-semibold text-[#009688] rounded-xl hover:bg-teal-100 transition"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Export Excel</span>
                    </button>
                    <button
                      onClick={() => alert("Exporting Billing Ledger (CSV)...")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-[#E5E7EB] text-xs font-semibold text-[#111827] rounded-xl hover:bg-slate-100 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0D47A1]" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F1F5F9] text-[11px] font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E5E7EB]">
                        <th className="py-3.5 px-4">Invoice ID</th>
                        <th className="py-3.5 px-4">Patient Name</th>
                        <th className="py-3.5 px-4">MRN</th>
                        <th className="py-3.5 px-4">Invoice Date</th>
                        <th className="py-3.5 px-4 text-right">
                          Invoice Amount
                        </th>
                        <th className="py-3.5 px-4 text-right">Amount Paid</th>
                        <th className="py-3.5 px-4 text-right">
                          Outstanding Balance
                        </th>
                        <th className="py-3.5 px-4">Method</th>
                        <th className="py-3.5 px-4 text-center">
                          Payment Status
                        </th>
                        <th className="py-3.5 px-4 text-center">
                          Invoice Status
                        </th>
                        <th className="py-3.5 px-4">Collected By</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {filteredBillingRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={12}
                            className="py-8 text-center text-[#64748B]"
                          >
                            No billing records match your search or filter
                            criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredBillingRows.map((item) => (
                          <tr
                            key={item.invoiceId}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0D47A1]">
                              {item.invoiceId}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-[#111827]">
                              {item.patientName}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#0D47A1]">
                              {item.mrn}
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.invoiceDate}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-[#111827]">
                              ${item.invoiceAmount.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-[#66BB6A]">
                              ${item.amountPaid.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-[#EF4444]">
                              ${item.outstandingBalance.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-[#111827]">
                              {item.paymentMethod}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${item.paymentStatus === "Paid" ? "bg-teal-50 text-[#009688] border border-teal-200" : item.paymentStatus === "Partially Paid" ? "bg-blue-50 text-[#0D47A1] border border-blue-200" : item.paymentStatus === "Refunded" ? "bg-red-50 text-[#EF4444] border border-red-200" : "bg-amber-50 text-[#F59E0B] border border-amber-200"}`}
                              >
                                {item.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.invoiceStatus === "Cleared" ? "bg-emerald-100 text-[#66BB6A]" : item.invoiceStatus === "Issued" ? "bg-blue-100 text-[#0D47A1]" : item.invoiceStatus === "Overdue" ? "bg-amber-100 text-[#F59E0B]" : "bg-red-100 text-[#EF4444]"}`}
                              >
                                {item.invoiceStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#64748B]">
                              {item.collectedBy}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() =>
                                    alert(`Viewing invoice ${item.invoiceId}`)
                                  }
                                  className="p-1.5 text-[#0D47A1] hover:bg-blue-50 rounded-lg transition"
                                  title="View Invoice"
                                >
                                  <CreditCard className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    alert(
                                      `Printing receipt for ${item.invoiceId}`,
                                    )
                                  }
                                  className="p-1.5 text-[#009688] hover:bg-teal-50 rounded-lg transition"
                                  title="Print Invoice"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    alert(
                                      `Downloading PDF for ${item.invoiceId}`,
                                    )
                                  }
                                  className="p-1.5 text-[#64748B] hover:bg-slate-100 rounded-lg transition"
                                  title="Download PDF"
                                >
                                  <Download className="w-4 h-4" />
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
                    Showing 1 to {filteredBillingRows.length} of{" "}
                    {filteredBillingRows.length} entries
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

              {/* FINANCIAL ACTIVITY TIMELINE */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3
                  className="text-base font-bold text-[#111827] mb-4"
                  style={{ fontFamily: PP }}
                >
                  Recent Billing Activity Logs
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E5E7EB]">
                  {ACCOUNTANT_FINANCIAL_TIMELINE.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-4 relative z-10"
                    >
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0D47A1] flex items-center justify-center text-[#0D47A1] shrink-0">
                        <DollarSign className="w-3.5 h-3.5" />
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
                    <span>Billing Summary</span>
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Live invoice billing overview
                  </p>
                </div>

                {/* Metrics Overview */}
                <div className="bg-[#F1F5F9] rounded-xl p-3 border border-[#E5E7EB] text-xs space-y-2">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">
                    Today's Billing
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Total Invoices:</span>
                    <span className="font-bold text-[#0D47A1]">48 Total</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Paid Invoices:</span>
                    <span className="font-bold text-[#66BB6A]">42 Paid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Pending Payments:</span>
                    <span className="font-bold text-[#F59E0B]">$3,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Partially Paid:</span>
                    <span className="font-bold text-[#0D47A1]">
                      2 Partial ($300)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Refunded Bills:</span>
                    <span className="font-bold text-[#EF4444]">$450</span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-2 flex justify-between">
                    <span className="text-[#64748B]">
                      Average Invoice Value:
                    </span>
                    <span className="font-semibold text-[#009688]">
                      $309.38
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
                        <span>Print Report</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>

                    {onOpenDailyRevenue && (
                      <button
                        onClick={onOpenDailyRevenue}
                        className="w-full text-left px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 transition flex items-center justify-between text-xs font-medium text-[#0D47A1]"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 text-[#0D47A1]" />
                          <span>Open Daily Revenue Report</span>
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
                    <span>Accountant Scope Verified</span>
                  </div>
                  <span>
                    Read-only invoice billing data for hospital financial
                    operations tracking.
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
              {filteredBillingRows.length} Billing Report Results
            </strong>
          </div>
          <div>
            Hospital Management System â€¢ Accountant Billing Report v1.0
          </div>
          <div>
            Last Refreshed:{" "}
            <strong className="text-[#111827]">2026-07-26 13:50</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ ACCOUNTANT DASHBOARD KPI DETAIL SCREEN (ACCOUNTANT RBAC VERSION) â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type AccountantKpiType =
  | "Today's Revenue"
  | "Today's Invoices"
  | "Paid Bills"
  | "Pending Payments"
  | "Outstanding Amount"
  | "Refunded Bills"
  | "Payment Collection Rate"
  | "Average Invoice Value";




const ACCOUNTANT_KPI_TREND_SERIES: Record<
  AccountantKpiType,
  { date: string; current: number; previous: number }[]
> = {
  "Today's Revenue": [
    { date: "Jul 20", current: 11200, previous: 10400 },
    { date: "Jul 21", current: 12500, previous: 11800 },
    { date: "Jul 22", current: 10800, previous: 9900 },
    { date: "Jul 23", current: 13800, previous: 12900 },
    { date: "Jul 24", current: 14200, previous: 13500 },
    { date: "Jul 25", current: 14500, previous: 13800 },
    { date: "Jul 26", current: 14850, previous: 13500 },
  ],
  "Today's Invoices": [
    { date: "Jul 20", current: 38, previous: 34 },
    { date: "Jul 21", current: 42, previous: 36 },
    { date: "Jul 22", current: 36, previous: 32 },
    { date: "Jul 23", current: 45, previous: 40 },
    { date: "Jul 24", current: 44, previous: 38 },
    { date: "Jul 25", current: 46, previous: 40 },
    { date: "Jul 26", current: 48, previous: 42 },
  ],
  "Paid Bills": [
    { date: "Jul 20", current: 32, previous: 28 },
    { date: "Jul 21", current: 36, previous: 30 },
    { date: "Jul 22", current: 30, previous: 26 },
    { date: "Jul 23", current: 40, previous: 34 },
    { date: "Jul 24", current: 39, previous: 33 },
    { date: "Jul 25", current: 40, previous: 35 },
    { date: "Jul 26", current: 42, previous: 36 },
  ],
  "Pending Payments": [
    { date: "Jul 20", current: 8, previous: 10 },
    { date: "Jul 21", current: 7, previous: 9 },
    { date: "Jul 22", current: 9, previous: 11 },
    { date: "Jul 23", current: 6, previous: 8 },
    { date: "Jul 24", current: 7, previous: 9 },
    { date: "Jul 25", current: 6, previous: 8 },
    { date: "Jul 26", current: 6, previous: 8 },
  ],
  "Outstanding Amount": [
    { date: "Jul 20", current: 3800, previous: 4200 },
    { date: "Jul 21", current: 3500, previous: 4000 },
    { date: "Jul 22", current: 4100, previous: 4500 },
    { date: "Jul 23", current: 3400, previous: 3800 },
    { date: "Jul 24", current: 3600, previous: 3900 },
    { date: "Jul 25", current: 3300, previous: 3700 },
    { date: "Jul 26", current: 3250, previous: 3650 },
  ],
  "Refunded Bills": [
    { date: "Jul 20", current: 300, previous: 200 },
    { date: "Jul 21", current: 200, previous: 150 },
    { date: "Jul 22", current: 400, previous: 250 },
    { date: "Jul 23", current: 250, previous: 180 },
    { date: "Jul 24", current: 350, previous: 220 },
    { date: "Jul 25", current: 300, previous: 200 },
    { date: "Jul 26", current: 450, previous: 300 },
  ],
  "Payment Collection Rate": [
    { date: "Jul 20", current: 89.2, previous: 85.0 },
    { date: "Jul 21", current: 90.5, previous: 86.2 },
    { date: "Jul 22", current: 88.0, previous: 84.5 },
    { date: "Jul 23", current: 93.1, previous: 89.0 },
    { date: "Jul 24", current: 92.0, previous: 88.4 },
    { date: "Jul 25", current: 91.5, previous: 87.8 },
    { date: "Jul 26", current: 92.8, previous: 88.5 },
  ],
  "Average Invoice Value": [
    { date: "Jul 20", current: 294.7, previous: 305.8 },
    { date: "Jul 21", current: 297.6, previous: 327.7 },
    { date: "Jul 22", current: 300.0, previous: 309.3 },
    { date: "Jul 23", current: 306.6, previous: 322.5 },
    { date: "Jul 24", current: 322.7, previous: 355.2 },
    { date: "Jul 25", current: 315.2, previous: 345.0 },
    { date: "Jul 26", current: 309.3, previous: 321.4 },
  ],
};

const ACCOUNTANT_KPI_DONUT_MAP: Record<
  AccountantKpiType,
  { name: string; value: number; color: string }[]
> = {
  "Today's Revenue": [
    { name: "Collected", value: 14100, color: "#66BB6A" },
    { name: "Outstanding", value: 750, color: "#F59E0B" },
    { name: "Refunded", value: 450, color: "#EF4444" },
  ],
  "Today's Invoices": [
    { name: "Paid", value: 42, color: "#66BB6A" },
    { name: "Pending", value: 4, color: "#F59E0B" },
    { name: "Partially Paid", value: 2, color: "#0D47A1" },
  ],
  "Paid Bills": [
    { name: "Card Paid", value: 20, color: "#0D47A1" },
    { name: "Cash Paid", value: 12, color: "#009688" },
    { name: "UPI Paid", value: 10, color: "#66BB6A" },
  ],
  "Pending Payments": [
    { name: "Overdue > 7 Days", value: 2, color: "#EF4444" },
    { name: "Due Today", value: 4, color: "#F59E0B" },
  ],
  "Outstanding Amount": [
    { name: "OPD Consultations", value: 2150, color: "#F59E0B" },
    { name: "Lab Services", value: 1100, color: "#0D47A1" },
  ],
  "Refunded Bills": [
    { name: "Service Adjustment", value: 300, color: "#EF4444" },
    { name: "Patient Cancellation", value: 150, color: "#F59E0B" },
  ],
  "Payment Collection Rate": [
    { name: "Collected Same-Day", value: 92.8, color: "#66BB6A" },
    { name: "Uncollected Share", value: 7.2, color: "#F59E0B" },
  ],
  "Average Invoice Value": [
    { name: "Consultation Fee", value: 150, color: "#0D47A1" },
    { name: "Procedures & Tests", value: 159.38, color: "#009688" },
  ],
};

const ACCOUNTANT_METHOD_PERFORMANCE_BAR = [
  { method: "Card", collectedPct: 37.7, revenue: 5600, transactions: 20 },
  { method: "Cash", collectedPct: 28.2, revenue: 4200, transactions: 14 },
  { method: "UPI", collectedPct: 22.8, revenue: 3400, transactions: 10 },
  {
    method: "Bank Transfer",
    collectedPct: 8.4,
    revenue: 1250,
    transactions: 3,
  },
  { method: "Other", collectedPct: 2.9, revenue: 400, transactions: 1 },
];

const ACCOUNTANT_BILLING_TABLE_DATA = [
  {
    invoiceId: "INV-80901",
    patientName: "Sarah Mitchell",
    mrn: "MRN-89201",
    invoiceDate: "2026-07-26",
    invoiceAmount: 450.0,
    amountPaid: 450.0,
    outstandingBalance: 0.0,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    invoiceStatus: "Cleared",
    collectedBy: "Robert Vance",
  },
  {
    invoiceId: "INV-80902",
    patientName: "James Thornton",
    mrn: "MRN-89202",
    invoiceDate: "2026-07-26",
    invoiceAmount: 1200.0,
    amountPaid: 1200.0,
    outstandingBalance: 0.0,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    invoiceStatus: "Cleared",
    collectedBy: "Robert Vance",
  },
  {
    invoiceId: "INV-80903",
    patientName: "Emma Reyes",
    mrn: "MRN-89203",
    invoiceDate: "2026-07-26",
    invoiceAmount: 650.0,
    amountPaid: 350.0,
    outstandingBalance: 300.0,
    paymentMethod: "Cash",
    paymentStatus: "Partially Paid",
    invoiceStatus: "Issued",
    collectedBy: "Elena Rostova",
  },
  {
    invoiceId: "INV-80904",
    patientName: "Aisha Kumar",
    mrn: "MRN-89204",
    invoiceDate: "2026-07-26",
    invoiceAmount: 890.0,
    amountPaid: 890.0,
    outstandingBalance: 0.0,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    invoiceStatus: "Cleared",
    collectedBy: "Robert Vance",
  },
  {
    invoiceId: "INV-80905",
    patientName: "Michael Chang",
    mrn: "MRN-89205",
    invoiceDate: "2026-07-26",
    invoiceAmount: 1500.0,
    amountPaid: 0.0,
    outstandingBalance: 1500.0,
    paymentMethod: "Pending",
    paymentStatus: "Pending",
    invoiceStatus: "Overdue",
    collectedBy: "Unassigned",
  },
  {
    invoiceId: "INV-80906",
    patientName: "David Miller",
    mrn: "MRN-89206",
    invoiceDate: "2026-07-26",
    invoiceAmount: 450.0,
    amountPaid: 0.0,
    outstandingBalance: 450.0,
    paymentMethod: "Refunded",
    paymentStatus: "Refunded",
    invoiceStatus: "Refunded",
    collectedBy: "Elena Rostova",
  },
];

const ACCOUNTANT_BILLING_TREND_SERIES = [
  { date: "Jul 20", revenue: 11200, collections: 10400 },
  { date: "Jul 21", revenue: 12500, collections: 11800 },
  { date: "Jul 22", revenue: 10800, collections: 9900 },
  { date: "Jul 23", revenue: 13800, collections: 12900 },
  { date: "Jul 24", revenue: 14200, collections: 13500 },
  { date: "Jul 25", revenue: 14500, collections: 13800 },
  { date: "Jul 26", revenue: 14850, collections: 13500 },
];

const ACCOUNTANT_PAYMENT_STATUS_DONUT = [
  { name: "Paid", value: 12400, color: "#66BB6A" },
  { name: "Pending", value: 2250, color: "#F59E0B" },
  { name: "Partially Paid", value: 1000, color: "#0D47A1" },
  { name: "Cancelled", value: 200, color: "#64748B" },
  { name: "Refunded", value: 450, color: "#EF4444" },
];

const ACCOUNTANT_PAYMENT_METHOD_BAR = [
  { method: "Card", amount: 5600 },
  { method: "Cash", amount: 4200 },
  { method: "UPI", amount: 3400 },
  { method: "Bank Transfer", amount: 1250 },
  { method: "Other", amount: 400 },
];

const ACCOUNTANT_FINANCIAL_TIMELINE = [
  {
    id: "FTL-501",
    action: "Invoice Generated",
    detail: "INV-80901 created for Sarah Mitchell ($450.00)",
    date: "Jul 26",
    time: "08:50 AM",
    status: "Generated",
  },
  {
    id: "FTL-502",
    action: "Payment Collected",
    detail: "Payment of $1,200.00 processed via UPI for James Thornton",
    date: "Jul 26",
    time: "09:25 AM",
    status: "Completed",
  },
  {
    id: "FTL-503",
    action: "Partial Payment Received",
    detail: "Deposit of $350.00 received for Emma Reyes (INV-80903)",
    date: "Jul 26",
    time: "10:00 AM",
    status: "Partial",
  },
  {
    id: "FTL-504",
    action: "Refund Processed",
    detail: "Refund of $450.00 issued to David Miller (INV-80906)",
    date: "Jul 26",
    time: "11:15 AM",
    status: "Refunded",
  },
  {
    id: "FTL-505",
    action: "Invoice Overdue Alert",
    detail: "INV-80905 for Michael Chang is past due ($1,500.00)",
    date: "Jul 26",
    time: "12:00 PM",
    status: "Overdue",
  },
];
