import { Stethoscope, CheckCircle2, UserX, Building2 } from "lucide-react";
import { PP } from "../constants/doctors.constants";

export interface KpiCardsProps {
  totalDoctorsCount: number;
  availableTodayCount: number;
  onLeaveCount: number;
  departmentsCoveredCount: number;
  isLoading: boolean;
}

export function KpiCards({
  totalDoctorsCount,
  availableTodayCount,
  onLeaveCount,
  departmentsCoveredCount,
  isLoading,
}: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm animate-pulse flex items-center justify-between"
          >
            <div className="space-y-2 flex-1 pr-4">
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-6 bg-slate-300 rounded w-12" />
              <div className="h-2.5 bg-slate-200 rounded w-32" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
        <div>
          <div className="text-xs text-[#64748B] font-medium">
            Total Doctors
          </div>
          <div
            className="text-2xl font-bold text-[#111827] mt-0.5"
            style={{ fontFamily: PP }}
          >
            {totalDoctorsCount}
          </div>
          <div className="text-[11px] text-[#0D47A1] font-medium mt-1 flex items-center gap-1">
            <span>Across {departmentsCoveredCount} clinical departments</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
          <Stethoscope size={20} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-teal-200 transition-colors">
        <div>
          <div className="text-xs text-[#64748B] font-medium">
            Available Today
          </div>
          <div
            className="text-2xl font-bold text-[#111827] mt-0.5"
            style={{ fontFamily: PP }}
          >
            {availableTodayCount}
          </div>
          <div className="text-[11px] text-[#009688] font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009688]" />
            <span>In OPD & Clinical consultations</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
          <CheckCircle2 size={20} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-amber-200 transition-colors">
        <div>
          <div className="text-xs text-[#64748B] font-medium">On Leave</div>
          <div
            className="text-2xl font-bold text-[#111827] mt-0.5"
            style={{ fontFamily: PP }}
          >
            {onLeaveCount}
          </div>
          <div className="text-[11px] text-[#F59E0B] font-medium mt-1 flex items-center gap-1">
            <span>Approved leave or scheduled away</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
          <UserX size={20} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
        <div>
          <div className="text-xs text-[#64748B] font-medium">
            Departments Covered
          </div>
          <div
            className="text-2xl font-bold text-[#111827] mt-0.5"
            style={{ fontFamily: PP }}
          >
            {departmentsCoveredCount}
          </div>
          <div className="text-[11px] text-[#0D47A1] font-medium mt-1 flex items-center gap-1">
            <span>Active OPD & Specialty Units</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
          <Building2 size={20} />
        </div>
      </div>
    </div>
  );
}
