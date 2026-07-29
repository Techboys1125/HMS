import React from "react";
import { X, Calendar } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP } from "../constants/doctors.constants";

export interface ScheduleModalProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
}

export function ScheduleModal({
  isOpen,
  doctor,
  onClose,
}: ScheduleModalProps) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold text-sm flex items-center justify-center border border-purple-100">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                OPD Schedule & Working Hours
              </h3>
              <p className="text-xs text-[#64748B]">
                {doctor.name} &bull; {doctor.opdRoom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
            <div>
              <span className="text-purple-700 font-bold text-xs block">
                Regular OPD Shift
              </span>
              <span className="text-slate-600 text-xs">{doctor.shiftTimings}</span>
            </div>
            <div className="text-right">
              <span className="text-[#64748B] text-[11px] block">Assigned Room</span>
              <span className="font-bold text-[#111827]">{doctor.opdRoom}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#111827] block text-xs" style={{ fontFamily: PP }}>
              Weekly OPD Availability Slots
            </span>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                const isWorking = doctor.workingDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`p-3 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 ${
                      isWorking
                        ? "bg-blue-50 border-blue-200 text-[#0D47A1]"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="font-bold text-[11px] uppercase" style={{ fontFamily: PP }}>
                      {day}
                    </span>
                    {isWorking ? (
                      <span className="text-[10px] bg-[#0D47A1] text-white px-1.5 py-0.5 rounded font-semibold">
                        ON
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">OFF</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-[#111827] block text-[11px]">
              Appointment Slot Policy
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Doctor accepts up to 20 walk-in and pre-booked OPD consultations per
              shift slot. Consultation duration is estimated at 15 minutes per patient.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors"
            style={{ fontFamily: PP }}
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
