import React from "react";
import {
  Stethoscope,
  Clock,
  CheckCircle2,
  Activity,
  Users,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import type { ConsultationRecord, OauthRole } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface ConsultationKPICardsProps {
  role: OauthRole;
  consultations: ConsultationRecord[];
  tabCounts: Record<string, number>;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
}) => (
  <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: PP }}>
        {label}
      </span>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
    </div>
    <div className="mt-3">
      <div className="text-2xl font-bold text-[#111827]" style={{ fontFamily: PP }}>
        {value}
      </div>
      {trend && <div className="mt-1">{trend}</div>}
    </div>
  </div>
);

const countBy = (
  tabCounts: Record<string, number>,
  ...keys: string[]
): number => keys.reduce((sum, k) => sum + (tabCounts[k] || 0), 0);

export const ConsultationKPICards: React.FC<ConsultationKPICardsProps> = ({
  role,
  consultations,
  tabCounts,
}) => {
  const waitingTotal = countBy(
    tabCounts,
    "WAITING_FOR_VITALS",
    "WAITING_FOR_DOCTOR_CALL",
    "CALLED",
  );
  const waitingForDoctor = tabCounts["WAITING_FOR_DOCTOR_CALL"] || 0;
  const inConsultation = tabCounts["IN_CONSULTATION"] || 0;
  const completed = tabCounts["COMPLETED"] || 0;
  const followUps = tabCounts["FOLLOW_UP_SCHEDULED"] || 0;

  if (role === "admin") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Today's Consultations"
          value={consultations.length}
          icon={<Stethoscope size={18} />}
          iconBg="bg-blue-50"
          iconColor="text-[#0D47A1]"
          trend={
            <div
              className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium"
              style={{ fontFamily: RB }}
            >
              <Activity size={12} />
              <span>+15% vs yesterday</span>
            </div>
          }
        />
        <KpiCard
          label="Patients Waiting"
          value={waitingTotal}
          icon={<Clock size={18} />}
          iconBg="bg-amber-50"
          iconColor="text-[#F59E0B]"
          trend={
            <div
              className="flex items-center gap-1 text-[11px] text-amber-600 font-medium"
              style={{ fontFamily: RB }}
            >
              <Activity size={12} />
              <span>Avg wait: 14 mins</span>
            </div>
          }
        />
        <KpiCard
          label="In Consultation"
          value={inConsultation}
          icon={<Activity size={18} />}
          iconBg="bg-teal-50"
          iconColor="text-[#009688]"
          trend={
            <div
              className="flex items-center gap-1 text-[11px] text-[#009688] mt-1 font-medium"
              style={{ fontFamily: RB }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
              <span>1 Active Session</span>
            </div>
          }
        />
        <KpiCard
          label="Completed"
          value={completed}
          icon={<CheckCircle2 size={18} />}
          iconBg="bg-green-50"
          iconColor="text-[#66BB6A]"
          trend={
            <div
              className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium"
              style={{ fontFamily: RB }}
            >
              <ArrowUpRight size={12} />
              <span>94% completion rate</span>
            </div>
          }
        />
        <KpiCard
          label="Avg Duration"
          value="14 mins"
          icon={<Clock size={18} />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          trend={
            <div className="text-[11px] text-purple-600 mt-1 font-medium" style={{ fontFamily: RB }}>
              Target: &lt; 15 mins
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KpiCard
        label="Today's Consultations"
        value={consultations.length}
        icon={<Stethoscope size={18} />}
        iconBg="bg-blue-50"
        iconColor="text-[#0D47A1]"
        trend={
          <div
            className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium"
            style={{ fontFamily: RB }}
          >
            <Activity size={12} />
            <span>+12% vs yesterday</span>
          </div>
        }
      />
      <KpiCard
        label="Waiting Patients"
        value={waitingForDoctor}
        icon={<Clock size={18} />}
        iconBg="bg-amber-50"
        iconColor="text-[#F59E0B]"
        trend={
          <div
            className="flex items-center gap-1 text-[11px] text-amber-600 font-medium"
            style={{ fontFamily: RB }}
          >
            <Activity size={12} />
            <span>Avg wait: 14 mins</span>
          </div>
        }
      />
      <KpiCard
        label="In Consultation"
        value={inConsultation}
        icon={<Activity size={18} />}
        iconBg="bg-teal-50"
        iconColor="text-[#009688]"
        trend={
          <div
            className="flex items-center gap-1 text-[11px] text-[#009688] mt-1 font-medium"
            style={{ fontFamily: RB }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
            <span>Active Sessions</span>
          </div>
        }
      />
      <KpiCard
        label="Completed"
        value={completed}
        icon={<CheckCircle2 size={18} />}
        iconBg="bg-green-50"
        iconColor="text-[#66BB6A]"
        trend={
          <div
            className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium"
            style={{ fontFamily: RB }}
          >
            <Activity size={12} />
            <span>94% efficiency rate</span>
          </div>
        }
      />
      <KpiCard
        label="Follow-up Cases"
        value={followUps}
        icon={<Users size={18} />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        trend={
          <div
            className="flex items-center gap-1 text-[11px] text-purple-600 mt-1 font-medium"
            style={{ fontFamily: RB }}
          >
            <Calendar size={12} />
            <span>Scheduled this week</span>
          </div>
        }
      />
    </div>
  );
};

export default ConsultationKPICards;
