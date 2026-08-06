import {
  CheckSquare,
  Clock,
  Receipt,
  TrendingDown,
  TrendingUp,
  Download,
  DollarSign,
  CreditCard,
  BarChart2,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const PP = "Poppins, system-ui, sans-serif";
const RB = "Roboto, system-ui, sans-serif";

// ─── Mini Shared Components ────────────────────────────────────────────────
function DKpi({
  title,
  value,
  sub,
  trend,
  up,
  data,
  color,
  gid,
  Icon,
}: {
  title: string;
  value: string;
  sub: string;
  trend: string;
  up: boolean;
  data: { v: number }[];
  color: string;
  gid: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-xs font-medium text-[#64748B] mb-1"
            style={{ fontFamily: RB }}
          >
            {title}
          </div>
          <div
            className={`${value.length > 12 ? "text-base" : value.length > 8 ? "text-lg" : "text-xl"} font-bold text-[#111827] leading-tight truncate`}
            style={{ fontFamily: PP }}
          >
            {value}
          </div>
          <div
            className="text-xs text-slate-400 mt-1 truncate"
            style={{ fontFamily: RB }}
          >
            {sub}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + "18" }}
        >
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart
          data={data}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gid})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div
        className={`flex items-center gap-1 text-xs font-medium ${up ? "text-[#66BB6A]" : "text-[#EF4444]"}`}
        style={{ fontFamily: RB }}
      >
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
  );
}

function Av({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const palette = [
    "bg-[#0D47A1]",
    "bg-[#009688]",
    "bg-violet-600",
    "bg-rose-500",
    "bg-amber-600",
  ];
  const bg = palette[name.charCodeAt(0) % palette.length];
  const sz = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  }[size];
  return (
    <div
      className={`${sz} ${bg} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ fontFamily: PP }}
    >
      {initials}
    </div>
  );
}

type ChipVariant =
  "success" | "warning" | "error" | "info" | "teal" | "default";
function Chip({
  label,
  variant = "default",
}: {
  label: string;
  variant?: ChipVariant;
}) {
  const map: Record<ChipVariant, string> = {
    success: "bg-green-50 text-[#66BB6A]",
    warning: "bg-amber-50 text-[#F59E0B]",
    error: "bg-red-50 text-[#EF4444]",
    info: "bg-blue-50 text-[#0D47A1]",
    teal: "bg-teal-50 text-[#009688]",
    default: "bg-slate-50 text-[#64748B]",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[variant]}`}
      style={{ fontFamily: RB }}
    >
      {label}
    </span>
  );
}

function SH({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <div
          className="text-sm font-semibold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          {title}
        </div>
        {sub && (
          <div
            className="text-xs text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
// Section 01: Revenue Collection Trend (Large Line Chart)
const ACC_REVENUE_TREND = [
  { hour: "08 AM", revenue: 1250, invoices: 4 },
  { hour: "09 AM", revenue: 3400, invoices: 9 },
  { hour: "10 AM", revenue: 6200, invoices: 15 },
  { hour: "11 AM", revenue: 9800, invoices: 22 },
  { hour: "12 PM", revenue: 14500, invoices: 31 },
  { hour: "01 PM", revenue: 17200, invoices: 36 },
  { hour: "02 PM", revenue: 20800, invoices: 42 },
  { hour: "03 PM", revenue: 23500, invoices: 48 },
  { hour: "04 PM", revenue: 26100, invoices: 53 },
  { hour: "05 PM", revenue: 28450, invoices: 58 },
];

// Section 02: Payment Method Distribution (Donut Chart)
const ACC_PAYMENT_METHODS_DIST = [
  { name: "Cash", value: 8400, color: "#009688" },
  { name: "Card", value: 11650, color: "#0D47A1" },
  { name: "UPI", value: 5800, color: "#4DB6AC" },
  { name: "Bank Transfer", value: 2200, color: "#66BB6A" },
  { name: "Other", value: 400, color: "#F59E0B" },
];

// Section 03: Today's Billing Transactions Table
const ACC_BILLING_TRANSACTIONS = [
  {
    invoice: "INV-847",
    patient: "Sarah Mitchell",
    type: "Consultation Fee",
    amount: 488.0,
    method: "Card",
    status: "Paid",
    time: "09:20 AM",
  },
  {
    invoice: "INV-848",
    patient: "James Thornton",
    type: "Registration Fee",
    amount: 228.0,
    method: "Cash",
    status: "Pending",
    time: "09:45 AM",
  },
  {
    invoice: "INV-849",
    patient: "Emma Reyes",
    type: "Follow-up Consultation",
    amount: 320.0,
    method: "UPI",
    status: "Paid",
    time: "10:12 AM",
  },
  {
    invoice: "INV-850",
    patient: "Robert Chen",
    type: "Consultation Fee",
    amount: 395.0,
    method: "Card",
    status: "Partial",
    time: "10:30 AM",
  },
  {
    invoice: "INV-851",
    patient: "Marcus Brown",
    type: "Other Charges",
    amount: 175.0,
    method: "Cash",
    status: "Paid",
    time: "11:00 AM",
  },
  {
    invoice: "INV-852",
    patient: "Aisha Kumar",
    type: "Consultation Fee",
    amount: 290.0,
    method: "Bank Transfer",
    status: "Paid",
    time: "11:15 AM",
  },
  {
    invoice: "INV-853",
    patient: "David Walsh",
    type: "Registration Fee",
    amount: 150.0,
    method: "None",
    status: "Cancelled",
    time: "11:40 AM",
  },
];

// Section 05: Revenue by Billing Category (Horizontal Bar Chart)
const ACC_REVENUE_CATEGORIES = [
  { category: "Consultation Fee", amount: 14850 },
  { category: "Registration Fee", amount: 6240 },
  { category: "Follow-up Consultation", amount: 5120 },
  { category: "Other Charges", amount: 2240 },
];

// Section 06: Invoice Status Distribution (Pie / Bar Chart)
const ACC_INVOICE_STATUS_DIST = [
  { name: "Paid", count: 42, color: "#66BB6A" },
  { name: "Pending", count: 12, color: "#F59E0B" },
  { name: "Partial", count: 3, color: "#0D47A1" },
  { name: "Cancelled", count: 1, color: "#EF4444" },
];

// Section 09: Today's Financial Summary (Statistics Table)
const ACC_FINANCIAL_SUMMARY_METRICS = [
  {
    metric: "Invoices Generated",
    today: "58",
    yesterday: "52",
    status: "Optimal (+11.5%)",
  },
  {
    metric: "Payments Received",
    today: "45",
    yesterday: "41",
    status: "Ahead (+9.7%)",
  },
  {
    metric: "Pending Bills",
    today: "12",
    yesterday: "15",
    status: "Reduced (-20.0%)",
  },
  {
    metric: "Collected Revenue",
    today: "$28,450.00",
    yesterday: "$25,120.00",
    status: "High (+13.2%)",
  },
  {
    metric: "Refund Requests",
    today: "3",
    yesterday: "2",
    status: "Under Review",
  },
  { metric: "Cancelled Bills", today: "1", yesterday: "2", status: "Low" },
];

const ACC_TRANSACTION_STATUS_CHIP: Record<
  string,
  "success" | "warning" | "info" | "error" | "teal" | "default"
> = {
  Paid: "success",
  Pending: "warning",
  Partial: "info",
  Cancelled: "error",
};

// Quick Actions strictly aligned with requirements
const ACC_QUICK_ACTIONS = [
  {
    label: "Create Invoice",
    Icon: Receipt,
    color: "#0D47A1",
    action: "create",
  },
  {
    label: "Receive Payment",
    Icon: CreditCard,
    color: "#009688",
    action: "collect",
  },
  {
    label: "Billing Report",
    Icon: BarChart2,
    color: "#4DB6AC",
    action: "report",
  },
  { label: "Search Invoice", Icon: Search, color: "#64748B", action: "search" },
  {
    label: "View Pending Bills",
    Icon: Clock,
    color: "#F59E0B",
    action: "pending",
  },
  {
    label: "Daily Revenue",
    Icon: DollarSign,
    color: "#66BB6A",
    action: "revenue",
  },
];
export function AccountantDashboard({
  onCreateInvoiceClick,
  onCollectPaymentClick,
  onNavigateNav,
}: {
  onCreateInvoiceClick?: () => void;
  onCollectPaymentClick?: (invoiceNo?: string) => void;
  onNavigateNav?: (nav: string) => void;
}) {
  const totalInvoices = ACC_INVOICE_STATUS_DIST.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );
  const totalPaymentValue = ACC_PAYMENT_METHODS_DIST.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: "#F1F5F9" }}
    >
      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1"
          style={{ fontFamily: PP }}
        >
          Financial Quick Actions
        </span>
        {ACC_QUICK_ACTIONS.map(({ label, Icon, color, action }) => (
          <button
            key={label}
            onClick={() => {
              if (action === "create" && onCreateInvoiceClick)
                onCreateInvoiceClick();
              else if (action === "collect" && onCollectPaymentClick)
                onCollectPaymentClick();
              else if (action === "create" && onNavigateNav)
                onNavigateNav("billing");
              else if (action === "collect" && onNavigateNav)
                onNavigateNav("billing");
              else if (action === "pending" && onNavigateNav)
                onNavigateNav("billing");
              else if (action === "report" && onNavigateNav)
                onNavigateNav("reports");
              else if (action === "revenue" && onNavigateNav)
                onNavigateNav("reports");
              else if (action === "search" && onNavigateNav)
                onNavigateNav("billing");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Row — 5 Financial Operations KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <DKpi
          title="Today's Revenue"
          value="$28,450"
          sub="Total Amount Collected Today"
          trend="+13.2% vs Yesterday"
          up={true}
          data={[
            { v: 18000 },
            { v: 21000 },
            { v: 24000 },
            { v: 22000 },
            { v: 25120 },
            { v: 28450 },
          ]}
          color="#0D47A1"
          gid="acc1"
          Icon={DollarSign}
        />
        <DKpi
          title="Invoices Generated"
          value="58"
          sub="Today's Billing Count"
          trend="+11.5% Billing Volume"
          up={true}
          data={[
            { v: 40 },
            { v: 45 },
            { v: 48 },
            { v: 52 },
            { v: 50 },
            { v: 58 },
          ]}
          color="#009688"
          gid="acc2"
          Icon={Receipt}
        />
        <DKpi
          title="Pending Payments"
          value="$8,450"
          sub="12 Outstanding Bills"
          trend="Avg Due: $704.16"
          up={false}
          data={[
            { v: 11000 },
            { v: 9800 },
            { v: 10500 },
            { v: 9200 },
            { v: 9000 },
            { v: 8450 },
          ]}
          color="#F59E0B"
          gid="acc3"
          Icon={Clock}
        />
        <DKpi
          title="Payments Received"
          value="45"
          sub="Completed Payments Today"
          trend="77.5% Collection Rate"
          up={true}
          data={[
            { v: 30 },
            { v: 35 },
            { v: 38 },
            { v: 41 },
            { v: 42 },
            { v: 45 },
          ]}
          color="#66BB6A"
          gid="acc4"
          Icon={CheckSquare}
        />
        <DKpi
          title="Refund Requests"
          value="3"
          sub="Pending Refund Requests"
          trend="1 Approved Today"
          up={false}
          data={[{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }, { v: 2 }, { v: 3 }]}
          color="#EF4444"
          gid="acc5"
          Icon={Download}
        />
      </div>

      {/* ── Main Financial Operations Grid 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 01: Revenue Collection Trend (Large Line Chart) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Revenue Collection Throughout the Day
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                Monitors hourly revenue collection flow (08 AM - 05 PM)
              </div>
            </div>
            <span
              className="text-[10px] font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: RB }}
            >
              Today: $28,450.00
            </span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={ACC_REVENUE_TREND}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="accRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "#64748B", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: unknown) => `$${Number(val) / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(val: unknown, name: unknown) => [
                  name === "revenue"
                    ? `$${Number(val).toLocaleString()}.00`
                    : `${val} Invoices`,
                  name === "revenue"
                    ? "Revenue Collected"
                    : "Invoices Generated",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0D47A1"
                strokeWidth={2.5}
                fill="url(#accRevGrad)"
                dot={{ r: 3, fill: "#0D47A1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            <span>Peak Collection Hour: 11 AM - 12 PM ($4,700 Collected)</span>
            <span className="font-semibold text-[#111827]">
              58 Invoices Processed
            </span>
          </div>
        </div>

        {/* Section 02: Payment Method Distribution (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Payments by Method"
            sub="Understand Payment Method Distribution"
          />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={ACC_PAYMENT_METHODS_DIST}
              layout="vertical"
              margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [
                  `$${Number(v).toLocaleString()}.00`,
                  "Amount Collected",
                ]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={13}>
                {ACC_PAYMENT_METHODS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-1.5 mt-2 pt-3 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {ACC_PAYMENT_METHODS_DIST.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: m.color }}
                  />
                  <span className="text-[#64748B] text-[11px]">{m.name}</span>
                </div>
                <span className="font-bold text-[#111827]">
                  ${(m.value / 1000).toFixed(1)}k
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-[11px] text-center text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            Total Collected: ${totalPaymentValue.toLocaleString()}.00
          </div>
        </div>
      </div>

      {/* ── Section 03: Today's Billing Transactions Table ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Today's Billing Transactions
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Real-time invoice management and billing activity tracking
            </div>
          </div>
          <span
            className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-lg"
            style={{ fontFamily: RB }}
          >
            58 Invoices Today
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/50">
                {[
                  "Invoice No",
                  "Patient Name",
                  "Bill Type",
                  "Amount",
                  "Payment Method",
                  "Status",
                  "Generated Time",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ACC_BILLING_TRANSACTIONS.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                    {t.invoice}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Av name={t.patient} size="sm" />
                      <span
                        className="text-xs font-medium text-[#111827]"
                        style={{ fontFamily: RB }}
                      >
                        {t.patient}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {t.type}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#111827]">
                    ${t.amount.toFixed(2)}
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {t.method}
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={t.status}
                      variant={
                        ACC_TRANSACTION_STATUS_CHIP[t.status] || "default"
                      }
                    />
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">
                    {t.time}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {t.status === "Pending" || t.status === "Partial" ? (
                        <button
                          onClick={() => onCollectPaymentClick?.(t.invoice)}
                          className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                          style={{ fontFamily: PP }}
                        >
                          Collect
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Logged
                        </span>
                      )}
                      <button
                        onClick={() => onCreateInvoiceClick?.()}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-[#0D47A1] text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 04, 05 & 06: Pending Summary, Revenue Categories & Invoice Status ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Section 04: Pending Payment Summary (Reusable Summary Card) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Pending Payment Summary"
            sub="Outstanding Collections Overview"
          />
          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-100 bg-amber-50/50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Pending Bills Count
              </span>
              <span
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                12 Bills
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-red-100 bg-red-50/50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Pending Outstanding Amount
              </span>
              <span
                className="text-sm font-bold text-[#EF4444]"
                style={{ fontFamily: PP }}
              >
                $8,450.00
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Overdue Bills (&gt;3 Days)
              </span>
              <span
                className="text-sm font-bold text-[#F59E0B]"
                style={{ fontFamily: PP }}
              >
                4 Bills
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-slate-50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Average Due Amount
              </span>
              <span
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                $704.16
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-teal-100 bg-teal-50/50">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Today's Collections Progress
              </span>
              <span
                className="text-sm font-bold text-[#009688]"
                style={{ fontFamily: PP }}
              >
                $28,450.00
              </span>
            </div>
          </div>
          <div
            className="mt-3 pt-2 text-xs text-[#64748B] text-center"
            style={{ fontFamily: RB }}
          >
            Critical operational metrics for revenue recovery
          </div>
        </div>

        {/* Section 05: Revenue by Billing Category (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Revenue by Billing Type"
            sub="Revenue Breakdown by Category"
          />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={ACC_REVENUE_CATEGORIES}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 25, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: unknown) => `$${Number(v) / 1000}k`}
              />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 10, fill: "#111827", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [
                  `$${Number(v).toLocaleString()}.00`,
                  "Collected Amount",
                ]}
              />
              <Bar
                dataKey="amount"
                fill="#0D47A1"
                radius={[0, 4, 4, 0]}
                barSize={13}
              />
            </BarChart>
          </ResponsiveContainer>
          <div
            className="mt-2 pt-2 border-t border-gray-50 text-xs text-[#64748B] flex items-center justify-between"
            style={{ fontFamily: RB }}
          >
            <span>Top Source: Consultation Fee</span>
            <span className="font-semibold text-[#0D47A1]">$28,450 Total</span>
          </div>
        </div>

        {/* Section 06: Invoice Status Distribution (Pie / Bar Chart) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <SH
            title="Invoice Status Distribution"
            sub="Quick Overview of Billing Completion"
          />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={ACC_INVOICE_STATUS_DIST}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748B", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [`${v} Invoices`, "Count"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                {ACC_INVOICE_STATUS_DIST.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div
            className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-gray-50 text-xs"
            style={{ fontFamily: RB }}
          >
            {ACC_INVOICE_STATUS_DIST.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-[#64748B] text-[11px]">{r.name}:</span>
                <span className="font-bold text-[#111827]">{r.count}</span>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-xs font-semibold text-center text-[#0D47A1]"
            style={{ fontFamily: PP }}
          >
            Total Invoices Today: {totalInvoices}
          </div>
        </div>
      </div>

      {/* ── Section 09: Today's Financial Summary ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Today's Financial Summary
            </div>
            <div
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Financial operational statistics and daily collection performance
            </div>
          </div>
          <button
            className="text-xs text-[#0D47A1] font-semibold hover:underline"
            style={{ fontFamily: RB }}
          >
            Export Financial Summary →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-slate-50/50">
              {["Metric", "Today", "Yesterday", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ACC_FINANCIAL_SUMMARY_METRICS.map((m) => (
              <tr
                key={m.metric}
                className="hover:bg-slate-50 transition-colors"
              >
                <td
                  className="px-5 py-3 text-xs font-medium text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {m.metric}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-bold text-[#0D47A1]">
                  {m.today}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[#64748B]">
                  {m.yesterday}
                </td>
                <td className="px-5 py-3">
                  <Chip
                    label={m.status}
                    variant={
                      m.status.includes("Ahead") ||
                      m.status.includes("Optimal") ||
                      m.status.includes("High")
                        ? "success"
                        : m.status.includes("Low")
                          ? "info"
                          : "warning"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
