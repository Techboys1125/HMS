import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import {
  Wallet,
  FileText,
  CheckCircle2,
  Clock,
  CreditCard,
  Ban,
  AlertCircle,
} from "lucide-react";
import { PP, RB } from "../constants/billing.constants";
import type {
  InvoiceRecord,
  BillingDashboardSummary,
} from "../types/billing.types";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: string;
  isUp?: boolean;
  color: string;
  Icon: React.ElementType;
  bgTint: string;
  dataTrend: { v: number }[];
}

export function BillingKpiCard({
  title,
  value,
  trend,
  isUp,
  color,
  Icon,
  bgTint,
  dataTrend,
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold text-[#64748B]"
            style={{ fontFamily: RB }}
          >
            {title}
          </span>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: bgTint }}
          >
            <Icon size={16} style={{ color }} />
          </div>
        </div>
        <div
          className="text-xl xl:text-2xl font-bold text-[#111827] tracking-tight"
          style={{ fontFamily: PP }}
        >
          {value}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
        {trend ? (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              isUp ? "text-[#66BB6A]" : "text-[#EF4444]"
            }`}
            style={{ fontFamily: RB }}
          >
            {isUp ? "↑" : "↓"} {trend} vs last week
          </span>
        ) : (
          <span
            className="text-[11px] text-slate-400"
            style={{ fontFamily: RB }}
          >
            Live OPD sync
          </span>
        )}
        <div className="w-14 h-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dataTrend}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id={`grad-${title.replace(/\s+/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#grad-${title.replace(/\s+/g, "")})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function BillingKPICards({
  dashboardData,
  invoices,
  isLoading,
}: {
  dashboardData?: BillingDashboardSummary;
  invoices: InvoiceRecord[];
  isLoading?: boolean;
}) {
  // Use dashboard data from API if available, otherwise compute from invoices
  const totalRevenue =
    dashboardData?.todayRevenue ??
    invoices
      .filter((i) => i.paymentStatus !== "Cancelled")
      .reduce((sum, i) => sum + i.paidAmount, 0);

  const totalOutstanding =
    dashboardData?.outstanding ??
    invoices
      .filter(
        (i) =>
          i.paymentStatus !== "Cancelled" && i.paymentStatus !== "Refunded",
      )
      .reduce((sum, i) => sum + i.balance, 0);

  const countGenerated =
    dashboardData?.readyForBilling ?? dashboardData?.draft ?? invoices.length;
  const countPaid = dashboardData?.partiallyPaid
    ? invoices.filter((i) => i.paymentStatus === "Paid").length
    : invoices.filter((i) => i.paymentStatus === "Paid").length;
  const countPending =
    dashboardData?.unpaid ??
    invoices.filter((i) => i.paymentStatus === "Pending").length;
  const countPartial =
    dashboardData?.partiallyPaid ??
    invoices.filter((i) => i.paymentStatus === "Partially Paid").length;
  const countRefunded = invoices.filter(
    (i) => i.paymentStatus === "Refunded",
  ).length;

  const isReady = !isLoading;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-3 md:gap-4">
      {/* Card 1: Today's Revenue */}
      <BillingKpiCard
        title="Today's Revenue"
        value={isReady ? `₹${totalRevenue.toLocaleString()}` : "—"}
        trend={dashboardData ? "Live" : "+12%"}
        isUp={true}
        color="#0D47A1"
        Icon={Wallet}
        bgTint="rgba(13, 71, 161, 0.08)"
        dataTrend={[
          { v: 45 },
          { v: 60 },
          { v: 55 },
          { v: 75 },
          { v: totalRevenue > 0 ? totalRevenue / 1000 : 84.75 },
        ]}
      />
      {/* Card 2: Invoices Generated */}
      <BillingKpiCard
        title="Invoices Generated"
        value={isReady ? String(countGenerated) : "—"}
        trend={dashboardData ? "Live" : "+5%"}
        isUp={true}
        color="#4DB6AC"
        Icon={FileText}
        bgTint="rgba(77, 182, 172, 0.12)"
        dataTrend={[
          { v: 90 },
          { v: 105 },
          { v: 110 },
          { v: 120 },
          { v: countGenerated },
        ]}
      />
      {/* Card 3: Paid Bills */}
      <BillingKpiCard
        title="Paid Bills"
        value={isReady ? String(countPaid) : "—"}
        trend={dashboardData ? "Live" : "+8%"}
        isUp={true}
        color="#66BB6A"
        Icon={CheckCircle2}
        bgTint="rgba(102, 187, 106, 0.12)"
        dataTrend={[
          { v: 70 },
          { v: 80 },
          { v: 85 },
          { v: 90 },
          { v: countPaid },
        ]}
      />
      {/* Card 4: Pending Payments */}
      <BillingKpiCard
        title="Pending Payments"
        value={isReady ? String(countPending) : "—"}
        trend={dashboardData ? "Live" : "-2%"}
        isUp={false}
        color="#F59E0B"
        Icon={Clock}
        bgTint="rgba(245, 158, 11, 0.12)"
        dataTrend={[
          { v: 28 },
          { v: 25 },
          { v: 24 },
          { v: 22 },
          { v: countPending },
        ]}
      />
      {/* Card 5: Partially Paid */}
      <BillingKpiCard
        title="Partially Paid"
        value={isReady ? String(countPartial) : "—"}
        color="#0D47A1"
        Icon={CreditCard}
        bgTint="rgba(13, 71, 161, 0.08)"
        dataTrend={[
          { v: 5 },
          { v: 6 },
          { v: 7 },
          { v: 9 },
          { v: countPartial },
        ]}
      />
      {/* Card 6: Refunded Bills */}
      <BillingKpiCard
        title="Refunded Bills"
        value={isReady ? String(countRefunded) : "—"}
        color="#EF4444"
        Icon={Ban}
        bgTint="rgba(239, 68, 68, 0.12)"
        dataTrend={[
          { v: 1 },
          { v: 2 },
          { v: 1 },
          { v: 4 },
          { v: countRefunded },
        ]}
      />
      {/* Card 7: Outstanding Amount */}
      <BillingKpiCard
        title="Outstanding Amount"
        value={isReady ? `₹${totalOutstanding.toLocaleString()}` : "—"}
        trend={dashboardData ? "Live" : "-4%"}
        isUp={true}
        color="#8B5CF6"
        Icon={AlertCircle}
        bgTint="rgba(139, 92, 246, 0.12)"
        dataTrend={[
          { v: 24000 },
          { v: 22000 },
          { v: 21000 },
          { v: 19500 },
          { v: totalOutstanding },
        ]}
      />
    </div>
  );
}

export default BillingKPICards;
