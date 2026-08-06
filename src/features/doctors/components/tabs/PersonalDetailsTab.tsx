import { Calendar, User, Award } from "lucide-react";
import type {
  DoctorRecord,
  DoctorAppointment,
  DoctorPatient,
} from "../../types/doctors.types";
import { PP } from "../../constants/doctors.constants";

export interface PersonalDetailsTabProps {
  doctor: DoctorRecord;
  todayAppointments: DoctorAppointment[];
  patients: DoctorPatient[];
  completedToday: number;
  scheduledToday: number;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST";
  canEdit: boolean;
  onOpenEdit?: () => void;
}

export function PersonalDetailsTab({
  doctor,
  todayAppointments,
  patients,
  completedToday,
  scheduledToday,
  role,
  canEdit,
  onOpenEdit,
}: PersonalDetailsTabProps) {
  const isDoctor = role === "DOCTOR";
  const isReceptionist = role === "RECEPTIONIST";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {!isDoctor && !isReceptionist && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] font-medium block">
                Today's Appointments
              </span>
              <span
                className="text-2xl font-bold text-[#111827] mt-0.5 block"
                style={{ fontFamily: PP }}
              >
                {todayAppointments.length}
              </span>
              <span className="text-[11px] text-[#0D47A1] font-medium mt-1 block">
                {completedToday} Completed &bull; {scheduledToday} Scheduled
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0D47A1]">
              <Calendar size={20} />
            </div>
          </div>
        )}

        {!isDoctor && !isReceptionist && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] font-medium block">
                Total Patients
              </span>
              <span
                className="text-2xl font-bold text-[#111827] mt-0.5 block"
                style={{ fontFamily: PP }}
              >
                {patients.length}
              </span>
              <span className="text-[11px] text-[#009688] font-medium mt-1 block">
                Unique patients from appointments
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#009688]">
              <User size={20} />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] font-medium block">
              Experience
            </span>
            <span
              className="text-2xl font-bold text-[#111827] mt-0.5 block"
              style={{ fontFamily: PP }}
            >
              {doctor.experienceYrs || 0} Yrs
            </span>
            <span className="text-[11px] text-[#F59E0B] font-medium mt-1 block">
              {doctor.specialty || "Specialist"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F59E0B]">
            <Award size={20} />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3
              className="text-sm font-bold text-[#111827] flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <User size={16} className="text-[#0D47A1]" /> Basic Information
            </h3>
            {canEdit && onOpenEdit && (
              <button
                type="button"
                onClick={onOpenEdit}
                className="px-3 py-1 rounded-lg bg-blue-50 text-[#0D47A1] hover:bg-blue-100 text-xs font-bold transition-colors"
                style={{ fontFamily: PP }}
              >
                Edit Information
              </button>
            )}
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-[#64748B]">Full Name</span>
              <span className="font-bold text-[#111827]">{doctor.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-[#64748B]">Gender</span>
              <span className="font-medium text-[#111827]">
                {doctor.gender}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-[#64748B]">Email Address</span>
              <span className="font-semibold text-[#0D47A1]">
                {doctor.email || "—"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-[#64748B]">Contact Phone</span>
              <span className="font-medium text-[#111827]">
                {doctor.phone || "—"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-[#64748B]">OPD Cabinet Room</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {doctor.opdRoom || "Main OPD"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-[#64748B]">Facility Location</span>
              <span className="font-semibold text-[#111827]">
                City General Main Campus
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">Joined HMS</span>
              <span className="font-medium text-[#111827]">
                {doctor.joinedDate || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
