import React from "react";
import {
  Pill,
  Activity,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import type { UnifiedPrescription } from "../types/prescription.types";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface PrescriptionSummaryCardProps {
  role: "patient" | "doctor" | "admin";
  prescriptions: UnifiedPrescription[];
}

export const PrescriptionSummaryCard: React.FC<
  PrescriptionSummaryCardProps
> = ({ role, prescriptions }) => {
  if (role === "patient") {
    const totalPrescriptionsCount = prescriptions.length;
    const recentPrescriptionsCount = prescriptions.filter(
      (r) => r.status === "Issued",
    ).length;
    const upcomingFollowupsCount = prescriptions.filter(
      (r) =>
        r.followupDate && new Date(r.followupDate) >= new Date("2026-07-24"),
    ).length;
    const downloadedCount = 3; // Mock metric from original

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div
              className="text-xs text-[#64748B] font-medium"
              style={{ fontFamily: RB }}
            >
              Total Prescriptions
            </div>
            <div
              className="text-2xl font-bold text-[#111827] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {totalPrescriptionsCount}
            </div>
            <div
              className="text-[11px] text-[#0D47A1] font-medium mt-1"
              style={{ fontFamily: RB }}
            >
              Lifetime issued prescriptions
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
            <Pill size={20} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div
              className="text-xs text-[#64748B] font-medium"
              style={{ fontFamily: RB }}
            >
              Active Prescriptions
            </div>
            <div
              className="text-2xl font-bold text-[#009688] mt-0.5"
              style={{ fontFamily: PP }}
            >
              {recentPrescriptionsCount}
            </div>
            <div
              className="text-[11px] text-[#009688] font-medium mt-1"
              style={{ fontFamily: RB }}
            >
              Currently active medications
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
            <Activity size={20} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div
              className="text-xs text-[#64748B] font-medium"
              style={{ fontFamily: RB }}
            >
              Upcoming Follow-ups
            </div>
            <div
              className="text-2xl font-bold text-amber-600 mt-0.5"
              style={{ fontFamily: PP }}
            >
              {upcomingFollowupsCount}
            </div>
            <div
              className="text-[11px] text-amber-600 font-medium mt-1"
              style={{ fontFamily: RB }}
            >
              Scheduled doctor reviews
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Calendar size={20} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <div
              className="text-xs text-[#64748B] font-medium"
              style={{ fontFamily: RB }}
            >
              Downloaded PDF Reports
            </div>
            <div
              className="text-2xl font-bold text-slate-700 mt-0.5"
              style={{ fontFamily: PP }}
            >
              {downloadedCount}
            </div>
            <div
              className="text-[11px] text-slate-500 font-medium mt-1"
              style={{ fontFamily: RB }}
            >
              Exported document copies
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Download size={20} />
          </div>
        </div>
      </div>
    );
  }

  // Doctor or Admin KPIs
  const cards = [
    {
      title: "Today's Prescriptions",
      count: "14",
      trend: "+12% vs yesterday",
      Icon: Pill,
      color: "#0D47A1",
    },
    {
      title: "Issued Prescriptions",
      count: "184",
      trend: "92% completed",
      Icon: CheckCircle2,
      color: "#009688",
    },
    {
      title: "Follow-up Cases",
      count: "42",
      trend: "+4 scheduled this wk",
      Icon: Clock,
      color: "#F59E0B",
    },
    {
      title: "Recently Printed",
      count: "28",
      trend: "100% digital sync",
      Icon: Download,
      color: "#66BB6A",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((kpi) => (
        <div
          key={kpi.title}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm flex items-center justify-between"
        >
          <div>
            <div
              className="text-xs font-semibold text-slate-500 mb-1"
              style={{ fontFamily: PP }}
            >
              {kpi.title}
            </div>
            <div
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {kpi.count}
            </div>
            <div
              className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1"
              style={{ fontFamily: RB }}
            >
              <TrendingUp size={12} /> {kpi.trend}
            </div>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `${kpi.color}15` }}
          >
            <kpi.Icon size={20} style={{ color: kpi.color }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionSummaryCard;
