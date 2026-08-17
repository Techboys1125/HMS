import { X, Calendar } from "lucide-react";
import type { DoctorAppointment } from "../types/doctors.types";
import { PP } from "../constants/doctors.constants";
import { formatTime } from "../../../lib/time-utils";

export interface AppointmentDetailModalProps {
  isOpen: boolean;
  appointment: DoctorAppointment | null;
  onClose: () => void;
}

export function AppointmentDetailModal({
  isOpen,
  appointment,
  onClose,
}: AppointmentDetailModalProps) {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#0D47A1]" />
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Appointment Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-[#64748B]">Appointment ID</span>
            <span className="font-mono font-bold text-[#0D47A1]">
              {appointment.id}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-[#64748B]">Patient Name</span>
            <span className="font-bold text-[#111827]">
              {appointment.patientName} ({appointment.gender}/{appointment.age}
              Y)
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-[#64748B]">Date &amp; Time</span>
            <span className="font-medium text-[#111827]">
              {appointment.date} &bull; {formatTime(appointment.time)}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-[#64748B]">Visit Type</span>
            <span className="font-medium text-[#111827]">
              {appointment.type}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-[#64748B]">Status</span>
            <span className="font-semibold text-[#66BB6A]">
              {appointment.status}
            </span>
          </div>
          <div className="py-1">
            <span className="text-[#64748B] block text-[11px]">
              Chief Complaint
            </span>
            <p className="text-slate-700 font-medium mt-0.5">
              {appointment.complaint}
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
            style={{ fontFamily: PP }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
