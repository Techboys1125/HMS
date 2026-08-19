import React from "react";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "../../../common/components/recharts-lazy";


export const PP = "Poppins, system-ui, sans-serif";
export const RB = "Roboto, system-ui, sans-serif";

// ─── Mini Shared Components ────────────────────────────────────────────────
export function DKpi({
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
            className="text-2xl font-bold text-[#111827] leading-none"
            style={{ fontFamily: PP }}
          >
            {value}
          </div>
          <div
            className="text-xs text-slate-400 mt-1"
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

export function Av({
  name,
  size = "sm",
}: {
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  const safeName = (name || "??").trim() || "??";
  const initials = safeName
    .split(" ")
    .filter(Boolean)
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
  const bg = palette[(safeName?.charCodeAt(0) ?? "?".charCodeAt(0)) % palette.length];
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

export type ChipVariant =
  "success" | "warning" | "error" | "info" | "teal" | "default";
export function Chip({
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

export function SH({
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

export function AlertRow({
  level,
  msg,
  time,
  sub,
}: {
  level: "critical" | "warning" | "info";
  msg: string;
  time: string;
  sub?: string;
}) {
  const cfg = {
    critical: {
      bg: "bg-red-50 border-red-100",
      icon: "text-[#EF4444]",
      text: "text-red-800",
      sub: "text-red-600",
    },
    warning: {
      bg: "bg-amber-50 border-amber-100",
      icon: "text-[#F59E0B]",
      text: "text-amber-800",
      sub: "text-amber-600",
    },
    info: {
      bg: "bg-blue-50 border-blue-100",
      icon: "text-[#0D47A1]",
      text: "text-blue-800",
      sub: "text-blue-600",
    },
  }[level];
  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${cfg.bg}`}>
      <AlertTriangle size={13} className={`${cfg.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-medium ${cfg.text} leading-snug`}
          style={{ fontFamily: RB }}
        >
          {msg}
        </div>
        {sub && (
          <div
            className={`text-[10px] mt-0.5 ${cfg.sub}`}
            style={{ fontFamily: RB }}
          >
            {sub}
          </div>
        )}
      </div>
      <span
        className="text-[10px] text-slate-400 shrink-0"
        style={{ fontFamily: RB }}
      >
        {time}
      </span>
    </div>
  );
}

export function ProgressBar({
  label,
  value,
  total,
  color,
  sub,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  sub?: string;
}) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: color }}
          />
          <span
            className="text-xs font-medium text-[#111827]"
            style={{ fontFamily: RB }}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {sub && (
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>
              {sub}
            </span>
          )}
          <span className="font-mono text-xs font-semibold text-[#64748B]">
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}