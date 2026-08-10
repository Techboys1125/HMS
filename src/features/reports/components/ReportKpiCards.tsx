import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PP, RB } from "../constants/reports.constants";

export interface KpiCardData {
  title: string;
  value: string;
  sub?: string;
  trend?: string;
  isPositive?: boolean;
  color?: string;
  icon?: React.ElementType;
}

interface ReportKpiCardsProps {
  kpis: KpiCardData[];
  onKpiClick?: (index: number) => void;
}

export function ReportKpiCards({ kpis, onKpiClick }: ReportKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            onClick={() => onKpiClick?.(idx)}
            className={`bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm ${onKpiClick ? "cursor-pointer hover:shadow-md hover:border-[#0D47A1]/30 transition-all" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-1" style={{ fontFamily: RB }}>
                  {kpi.title}
                </div>
                <div
                  className={`font-bold text-[#111827] leading-tight ${kpi.value.length > 12 ? "text-base" : kpi.value.length > 8 ? "text-lg" : "text-xl"}`}
                  style={{ fontFamily: PP }}
                >
                  {kpi.value}
                </div>
                {kpi.sub && (
                  <div className="text-xs text-slate-400 mt-1" style={{ fontFamily: RB }}>
                    {kpi.sub}
                  </div>
                )}
              </div>
              {Icon && (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: (kpi.color || "#0D47A1") + "18" }}
                >
                  <Icon size={16} style={{ color: kpi.color || "#0D47A1" }} />
                </div>
              )}
            </div>
            {kpi.trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium mt-2 ${kpi.isPositive !== false ? "text-[#66BB6A]" : "text-[#EF4444]"}`}
                style={{ fontFamily: RB }}
              >
                {kpi.isPositive !== false ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trend}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
