import { X, Stethoscope, Eye } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP } from "../constants/doctors.constants";
import UserAvatar from "../../../common/components/UserAvatar";

function getAvailabilityBadgeStyle(avail: string) {
  switch (avail) {
    case "Available Today":
      return {
        bg: "bg-[#E6F4F1] text-[#009688] border-teal-200",
        dot: "bg-[#009688]",
      };
    case "On Duty":
      return {
        bg: "bg-blue-50 text-[#0D47A1] border-blue-200",
        dot: "bg-[#0D47A1]",
      };
    case "On Call":
      return {
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        dot: "bg-purple-600",
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
}

export interface QuickDetailsDrawerProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
  onViewFullProfile: (doctor: DoctorRecord) => void;
}

export function QuickDetailsDrawer({
  isOpen,
  doctor,
  onClose,
  onViewFullProfile,
}: QuickDetailsDrawerProps) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto transition-opacity slide-in-from-right duration-300">
        <div>
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Stethoscope size={18} className="text-[#0D47A1]" />
              <h2
                className="text-sm font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Quick Doctor Details
              </h2>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB]">
              <UserAvatar
                name={doctor.name}
                size="md"
                src={doctor.photoUrl || doctor.photo || undefined}
              />
              <div className="space-y-1 overflow-hidden">
                <h3
                  className="text-base font-bold text-[#111827] truncate"
                  style={{ fontFamily: PP }}
                >
                  {doctor.name}
                </h3>
                <p className="text-xs text-[#0D47A1] font-bold">
                  {doctor.specialty}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {doctor.department}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Doctor ID</span>
                <span className="font-mono font-bold text-[#0D47A1]">
                  {doctor.id}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Employee ID</span>
                <span className="font-mono font-semibold text-[#111827]">
                  {doctor.empId}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Registration Number</span>
                <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {doctor.regNumber}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Department</span>
                <span className="font-bold text-[#111827]">
                  {doctor.department}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Specialty</span>
                <span className="font-semibold text-[#0D47A1]">
                  {doctor.specialty}
                </span>
              </div>

              <div className="py-1.5 border-b border-gray-100 space-y-1">
                <span className="text-[#64748B] block">Qualification</span>
                <span className="font-medium text-[#111827] block">
                  {doctor.qualification}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Experience</span>
                <span className="font-bold text-[#111827]">
                  {doctor.experienceYrs} Years
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Consultation Fee</span>
                <span
                  className="font-bold text-[#0D47A1] text-sm"
                  style={{ fontFamily: PP }}
                >
                  ₹{doctor.consultationFee}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Today's Availability</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] border font-medium ${getAvailabilityBadgeStyle(doctor.availability).bg}`}
                >
                  {doctor.availability}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">OPD Cabinet Room</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {doctor.opdRoom}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#64748B]">Shift Timings</span>
                <span className="font-medium text-[#111827]">
                  {doctor.shiftTimings}
                </span>
              </div>
            </div>

            {doctor.bio && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[11px] text-[#64748B] font-bold block mb-1">
                  Clinical Overview
                </span>
                <p className="text-slate-600 leading-relaxed">{doctor.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onViewFullProfile(doctor)}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            <Eye size={14} /> View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
