import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Edit,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Award,
  Building2,
  CalendarRange,
  Clock,
  Calendar,
} from "lucide-react";
import type { DoctorRecord, DoctorAvailability } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";
import UserAvatar from "../../../common/components/UserAvatar";

function DollarSignIcon() {
  return <span className="text-xs font-bold">$</span>;
}

export interface DoctorProfileHeaderProps {
  doctor: DoctorRecord;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST";
  isOwnRecord: boolean;
  isLoading: boolean;
  visibleTabs: Array<{ id: string; label: string }>;
  onBack: () => void;
  onRefresh: () => void;
  onOpenEdit: () => void;
  onOpenActivate: () => void;
  onOpenDeactivate: () => void;
  onSelectTab: (tabId: string) => void;
}

export function DoctorProfileHeader({
  doctor,
  role,
  isLoading,
  visibleTabs,
  onBack,
  onRefresh,
  onOpenEdit,
  onOpenActivate,
  onOpenDeactivate,
  onSelectTab,
}: DoctorProfileHeaderProps) {
  const isAdmin = role === "ADMIN";
  const isDoctor = role === "DOCTOR";

  const getAvailStyle = (avail: DoctorAvailability) => {
    switch (avail) {
      case "Available Today":
        return {
          bg: "bg-teal-50 text-[#009688] border-teal-200",
          dot: "bg-[#009688]",
        };
      case "On Duty":
        return {
          bg: "bg-blue-50 text-[#0D47A1] border-blue-200",
          dot: "bg-[#0D47A1]",
        };
      case "On Leave":
        return {
          bg: "bg-amber-50 text-[#F59E0B] border-amber-200",
          dot: "bg-[#F59E0B]",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  const availStyle = getAvailStyle(doctor.availability);

  return (
    <div className="space-y-4" style={{ fontFamily: RB }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Doctor Profile
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] pl-8">
            <span>Doctors</span>
            <ChevronRight size={13} className="text-slate-300" />
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Doctor Management
            </button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">{doctor.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw
              size={13}
              className={isLoading ? "animate-spin text-[#0D47A1]" : ""}
            />
            <span>{isLoading ? "Refreshing..." : "Refresh Profile"}</span>
          </button>

          {(isAdmin || isDoctor) && (
            <button
              onClick={onOpenEdit}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
              style={{ fontFamily: PP }}
            >
              <Edit size={14} className="text-[#0D47A1]" />{" "}
              {isAdmin ? "Edit Doctor" : "Edit Profile"}
            </button>
          )}

          {isAdmin && doctor.status === "Inactive" && (
            <button
              onClick={onOpenActivate}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-teal-200 bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors flex items-center gap-1.5 shadow-sm"
              style={{ fontFamily: PP }}
            >
              <CheckCircle2 size={14} /> Activate Doctor
            </button>
          )}

          {isAdmin && doctor.status !== "Inactive" && (
            <button
              onClick={onOpenDeactivate}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-red-200 bg-red-50 text-[#EF4444] hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-sm"
              style={{ fontFamily: PP }}
            >
              <AlertTriangle size={14} /> Deactivate Doctor
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm animate-pulse flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-200 rounded w-64" />
            <div className="h-3 bg-slate-100 rounded w-80" />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <UserAvatar
              name={doctor.name}
              size="lg"
              src={doctor.photoUrl || doctor.photo || undefined}
            />

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h2
                  className="text-xl font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {doctor.name}
                </h2>
                <span className="text-xs font-mono font-bold text-[#0D47A1] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {doctor.id}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  EMP: {doctor.empId || "—"}
                </span>
                <span className="text-xs font-mono font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100 flex items-center gap-1">
                  <FileCheck size={13} /> {doctor.regNumber || "—"}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    doctor.status === "Active"
                      ? "bg-emerald-50 text-[#66BB6A] border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {doctor.status}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${availStyle.bg}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${availStyle.dot}`}
                  />
                  {doctor.availability}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                <span className="font-semibold text-[#111827]">
                  {doctor.qualification || "—"}
                </span>
                <span>&bull;</span>
                <span className="font-bold text-[#0D47A1]">
                  {doctor.specialty || "—"}
                </span>
                <span>({doctor.department || "General Medicine"})</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#64748B] pt-0.5">
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-[#F59E0B]" />{" "}
                  {doctor.designation ||
                    `${doctor.experienceYrs || 0} Years Experience`}
                </span>
                <span className="flex items-center gap-1 font-bold text-[#0D47A1]">
                  <DollarSignIcon /> ${doctor.consultationFee || 0} Consultation
                  Fee
                </span>
                <span className="flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  <Building2 size={13} /> {doctor.opdRoom || "Main OPD"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            {visibleTabs.some((t) => t.id === "availability") && (
              <button
                onClick={() => onSelectTab("availability")}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-slate-700 hover:text-[#0D47A1] text-xs font-bold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <CalendarRange size={14} /> Availability
              </button>
            )}
            {visibleTabs.some((t) => t.id === "schedule") && (
              <button
                onClick={() => onSelectTab("schedule")}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E5E7EB] text-slate-700 hover:text-[#0D47A1] text-xs font-bold transition-colors flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Clock size={14} /> Schedule
              </button>
            )}
            {visibleTabs.some((t) => t.id === "appointments") && (
              <button
                onClick={() => onSelectTab("appointments")}
                className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Calendar size={14} /> Appointments
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
