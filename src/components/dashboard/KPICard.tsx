import type React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "../../common/components/Sparkline";

export function KPICard({
  title,
  value,
  sub,
  trend,
  trendUp,
  data,
  color,
  gradId,
  icon: Icon,
}: {
  title: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean;
  data: { v: number }[];
  color: string;
  gradId: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm shadow-slate-50">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">{title}</div>
          <div className="text-2xl font-bold text-[#111827] leading-none">
            {value}
          </div>
          <div className="text-xs text-slate-400 mt-1">{sub}</div>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + "18" }}
        >
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <Sparkline data={data} color={color} gradId={gradId} />
      <div
        className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}
      >
        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
  );
}
