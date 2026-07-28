import {
  Receipt,
  CreditCard,
  Download,
  BarChart2,
  Bell,
  DollarSign,
  Clock,
  Check,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  DKpi,
  Av,
  Chip,
  SH,
  ProgressBar,
  PP,
  RB,
} from "../components/DashboardShared";

const TRANSACTIONS = [
  {
    invoice: "INV-847",
    patient: "Sarah Mitchell",
    service: "OPD Consultation",
    amount: 488.0,
    status: "paid",
    date: "Today 09:20",
  },
  {
    invoice: "INV-848",
    patient: "James Thornton",
    service: "Consultation + Follow-up",
    amount: 228.0,
    status: "pending",
    date: "Today 09:45",
  },
  {
    invoice: "INV-849",
    patient: "Emma Reyes",
    service: "Prenatal Consultation",
    amount: 320.0,
    status: "paid",
    date: "Today 10:12",
  },
  {
    invoice: "INV-850",
    patient: "Robert Chen",
    service: "Cardiology Consultation",
    amount: 395.0,
    status: "pending",
    date: "Today 10:30",
  },
  {
    invoice: "INV-851",
    patient: "Marcus Brown",
    service: "BP Monitoring Consultation",
    amount: 175.0,
    status: "paid",
    date: "Today 11:00",
  },
  {
    invoice: "INV-852",
    patient: "Aisha Kumar",
    service: "Neurology Consultation",
    amount: 290.0,
    status: "paid",
    date: "Today 11:15",
  },
];

const MONTHLY_REV = [
  { month: "Aug", v: 18200 },
  { month: "Sep", v: 21500 },
  { month: "Oct", v: 19800 },
  { month: "Nov", v: 24100 },
  { month: "Dec", v: 22400 },
  { month: "Jan", v: 24850 },
];

const ACC_PAYMENT_METHODS = [
  { method: "Cash", amount: 8240, total: 27950, color: "#009688" },
  { method: "Credit / Debit", amount: 11650, total: 27950, color: "#0D47A1" },
  { method: "Corporate Pay", amount: 5840, total: 27950, color: "#4DB6AC" },
  { method: "UPI / Online", amount: 2220, total: 27950, color: "#66BB6A" },
];

const ACC_ACTIVITY = [
  {
    Icon: Check,
    msg: "Payment collected",
    detail: "INV-847 · Sarah Mitchell · $488",
    time: "09:20",
    color: "#66BB6A",
  },
  {
    Icon: Receipt,
    msg: "Invoice generated",
    detail: "INV-848 · James Thornton · $228",
    time: "09:45",
    color: "#0D47A1",
  },
  {
    Icon: Check,
    msg: "Payment collected",
    detail: "INV-849 · Emma Reyes · $320",
    time: "10:12",
    color: "#66BB6A",
  },
  {
    Icon: Clock,
    msg: "Invoice pending",
    detail: "INV-850 · Robert Chen · $395",
    time: "10:30",
    color: "#F59E0B",
  },
  {
    Icon: Download,
    msg: "Refund processed",
    detail: "INV-832 · Nina Patel · $45",
    time: "10:55",
    color: "#EF4444",
  },
  {
    Icon: Receipt,
    msg: "Invoice generated",
    detail: "INV-853 · Aisha Kumar · $290",
    time: "11:15",
    color: "#0D47A1",
  },
];

const ACC_BILLING_SUMMARY = [
  { label: "OPD Consultations", count: 28, amount: 12640, color: "#0D47A1" },
  { label: "Follow-up Visits", count: 14, amount: 5320, color: "#009688" },
  { label: "Specialist Visits", count: 9, amount: 4860, color: "#4DB6AC" },
  { label: "Check-up Packages", count: 6, amount: 3240, color: "#66BB6A" },
  { label: "Billing Adjustments", count: 3, amount: 890, color: "#F59E0B" },
];

const ACC_QUICK_ACTIONS = [
  { label: "Generate Invoice", Icon: Receipt, color: "#0D47A1" },
  { label: "Collect Payment", Icon: CreditCard, color: "#009688" },
  { label: "Process Refund", Icon: Download, color: "#EF4444" },
  { label: "Financial Reports", Icon: BarChart2, color: "#64748B" },
];

export function AccountantDashboard() {
  const totalCollected = ACC_PAYMENT_METHODS.reduce((s, m) => s + m.amount, 0);
  const billTotal = ACC_BILLING_SUMMARY.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1"
          style={{ fontFamily: PP }}
        >
          Quick Actions
        </span>
        {ACC_QUICK_ACTIONS.map(({ label, Icon, color }) => (
          <button
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}
          >
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Receipt size={13} /> New Invoice
          </button>
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi
          title="Revenue Today"
          value="$27.9K"
          sub="Gross collections"
          trend="+12% vs yesterday"
          up={true}
          data={[
            { v: 18 },
            { v: 21 },
            { v: 19 },
            { v: 24 },
            { v: 22 },
            { v: 26 },
            { v: 27.9 },
          ]}
          color="#0D47A1"
          gid="ac1"
          Icon={DollarSign}
        />
        <DKpi
          title="Pending Payments"
          value="$8.4K"
          sub="Awaiting settlement"
          trend="18 invoices pending"
          up={false}
          data={[
            { v: 11 },
            { v: 9 },
            { v: 12 },
            { v: 8 },
            { v: 10 },
            { v: 9 },
            { v: 8.4 },
          ]}
          color="#F59E0B"
          gid="ac2"
          Icon={Clock}
        />
        <DKpi
          title="Collected Today"
          value="$16.4K"
          sub="Payments received"
          trend="+8% from morning"
          up={true}
          data={[
            { v: 8 },
            { v: 10 },
            { v: 11 },
            { v: 13 },
            { v: 14 },
            { v: 15 },
            { v: 16.4 },
          ]}
          color="#66BB6A"
          gid="ac3"
          Icon={Check}
        />
        <DKpi
          title="Refund Requests"
          value="3"
          sub="Pending review"
          trend="1 approved today"
          up={false}
          data={[
            { v: 1 },
            { v: 2 },
            { v: 1 },
            { v: 3 },
            { v: 2 },
            { v: 3 },
            { v: 3 },
          ]}
          color="#EF4444"
          gid="ac4"
          Icon={Download}
        />
      </div>

      {/* ── Main Workspace ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Invoice List (2/3) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Invoice List
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                {TRANSACTIONS.length} invoices today ·{" "}
                {TRANSACTIONS.filter((t) => t.status === "paid").length} paid
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
                style={{ fontFamily: RB }}
              >
                <Download size={11} /> Export
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-slate-50/60">
                {[
                  "Invoice",
                  "Patient",
                  "Service",
                  "Amount",
                  "Status",
                  "Date",
                  "",
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
              {TRANSACTIONS.map((t) => (
                <tr
                  key={t.invoice}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-semibold text-[#0D47A1]">
                      {t.invoice}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Av name={t.patient} size="sm" />
                      <span
                        className="text-sm font-medium text-[#111827] truncate max-w-[110px]"
                        style={{ fontFamily: RB }}
                      >
                        {t.patient}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs text-[#64748B] truncate max-w-[140px] block"
                      style={{ fontFamily: RB }}
                    >
                      {t.service}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm font-bold text-[#111827]">
                      ${t.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Chip
                      label={t.status === "paid" ? "Paid" : "Pending"}
                      variant={t.status === "paid" ? "success" : "warning"}
                    />
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {t.date}
                  </td>
                  <td className="px-5 py-3.5">
                    {t.status === "pending" ? (
                      <button
                        className="text-xs font-semibold text-[#009688] hover:underline"
                        style={{ fontFamily: PP }}
                      >
                        Collect
                      </button>
                    ) : (
                      <button
                        className="text-xs font-medium text-[#64748B] hover:underline"
                        style={{ fontFamily: RB }}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              Showing {TRANSACTIONS.length} of 47 invoices today
            </span>
            <button
              className="text-xs text-[#0D47A1] font-medium hover:underline"
              style={{ fontFamily: RB }}
            >
              View all invoices →
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Payment Collection */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Payment Collection" sub="Today's breakdown by method" />
            <div className="text-center mb-5">
              <div
                className="text-3xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                ${(totalCollected / 1000).toFixed(1)}K
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                Total collected today
              </div>
            </div>
            <div className="space-y-3">
              {ACC_PAYMENT_METHODS.map((m) => (
                <div key={m.method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: m.color }}
                      />
                      <span
                        className="text-xs font-medium text-[#111827]"
                        style={{ fontFamily: RB }}
                      >
                        {m.method}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-[#111827] font-semibold">
                        ${(m.amount / 1000).toFixed(1)}K
                      </span>
                      <span
                        className="text-[10px] text-[#64748B]"
                        style={{ fontFamily: RB }}
                      >
                        {Math.round((m.amount / m.total) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((m.amount / m.total) * 100)}%`,
                        background: m.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
              style={{ fontFamily: PP }}
            >
              <CreditCard size={13} /> Collect Payment
            </button>
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Billing Summary" sub="By service category" />
            <div className="space-y-0">
              {ACC_BILLING_SUMMARY.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: b.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-medium text-[#111827] truncate"
                      style={{ fontFamily: RB }}
                    >
                      {b.label}
                    </div>
                    <div
                      className="text-[10px] text-[#64748B]"
                      style={{ fontFamily: RB }}
                    >
                      {b.count} transactions
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#111827]">
                    ${(b.amount / 1000).toFixed(1)}K
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                Total
              </span>
              <span
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                ${(billTotal / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Monthly Revenue" sub="6-month trend" />
          <ResponsiveContainer width="100%" height={130}>
            <BarChart
              data={MONTHLY_REV}
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#94A3B8", fontFamily: RB }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                formatter={(v: unknown) => [
                  `$${(Number(v) / 1000).toFixed(1)}K`,
                  "Revenue",
                ]}
                contentStyle={{
                  fontSize: 11,
                  fontFamily: RB,
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                {MONTHLY_REV.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === MONTHLY_REV.length - 1 ? "#0D47A1" : "#E2E8F0"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                This month
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-base font-bold text-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  $24.9K
                </span>
                <span
                  className="flex items-center gap-0.5 text-xs text-[#66BB6A] font-medium"
                  style={{ fontFamily: RB }}
                >
                  <TrendingUp size={11} /> +9%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Collected",
                  value: "$16.4K",
                  color: "#66BB6A",
                  bg: "bg-green-50",
                },
                {
                  label: "Pending",
                  value: "$8.5K",
                  color: "#F59E0B",
                  bg: "bg-amber-50",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`${m.bg} rounded-xl p-3 border border-gray-100`}
                >
                  <div
                    className="text-[10px] mb-0.5"
                    style={{ fontFamily: RB, color: m.color }}
                  >
                    {m.label}
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ fontFamily: PP, color: m.color }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH title="Recent Transactions" sub="Today's payment activity" />
          <div>
            {ACC_ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-3.5 last:pb-0 relative"
              >
                {i < ACC_ACTIVITY.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-100" />
                )}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 z-10"
                  style={{ background: a.color + "15" }}
                >
                  <a.Icon size={12} style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div
                    className="text-xs font-medium text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {a.msg}
                  </div>
                  <div
                    className="text-[10px] text-[#64748B] truncate mt-0.5"
                    style={{ fontFamily: RB }}
                  >
                    {a.detail}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0 pt-0.5">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Summary */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH
            title="Payment Status"
            sub="Today's collection overview"
            action={
              <button
                className="text-xs text-[#0D47A1] font-medium hover:underline"
                style={{ fontFamily: RB }}
              >
                View All
              </button>
            }
          />
          <div className="space-y-3 mb-4">
            {[
              {
                label: "Collected",
                value: 16430,
                total: 27950,
                color: "#66BB6A",
                bg: "bg-green-50",
              },
              {
                label: "Pending",
                value: 8420,
                total: 27950,
                color: "#F59E0B",
                bg: "bg-amber-50",
              },
              {
                label: "Refunded",
                value: 320,
                total: 27950,
                color: "#EF4444",
                bg: "bg-red-50",
              },
            ].map((p) => (
              <ProgressBar
                key={p.label}
                label={p.label}
                value={p.value}
                total={p.total}
                color={p.color}
                sub={`$${(p.value / 1000).toFixed(1)}K`}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            {[
              { label: "Invoices", value: "47", color: "#0D47A1" },
              { label: "Paid", value: "29", color: "#66BB6A" },
              { label: "Pending", value: "18", color: "#F59E0B" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center py-2 rounded-xl bg-slate-50"
              >
                <div
                  className="text-sm font-bold"
                  style={{ fontFamily: PP, color: s.color }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[10px] text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-3 w-full py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-blue-800 transition-colors"
            style={{ fontFamily: PP }}
          >
            Generate Financial Report
          </button>
        </div>
      </div>
    </div>
  );
}
