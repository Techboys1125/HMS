import React from "react";
import { AlertTriangle } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";

export interface DeactivateDoctorDialogProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeactivateDoctorDialog({
  isOpen,
  doctor,
  onClose,
  onConfirm,
}: DeactivateDoctorDialogProps) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-4 animate-in zoom-in-95 duration-200"
        style={{ fontFamily: RB }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center shrink-0 border border-red-200">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Deactivate Doctor
            </h3>
            <p className="text-xs text-[#64748B]">
              {doctor.name} ({doctor.id})
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to deactivate{" "}
          <span className="font-bold text-[#111827]">{doctor.name}</span>?
          <br />
          <br />
          The doctor will no longer receive new OPD appointments, but historical
          medical records and past consultation histories will remain available.
        </p>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
