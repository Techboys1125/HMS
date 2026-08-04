import { CheckCircle2 } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";

export interface ActivateDoctorDialogProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
  onConfirm: () => void;
  isActivating?: boolean;
}

export function ActivateDoctorDialog({
  isOpen,
  doctor,
  onClose,
  onConfirm,
  isActivating,
}: ActivateDoctorDialogProps) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] p-6 space-y-4 animate-in zoom-in-95 duration-200"
        style={{ fontFamily: RB }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#009688] flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h3
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Activate Doctor
            </h3>
            <p className="text-xs text-[#64748B]">
              {doctor.name} ({doctor.id})
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to reactivate{" "}
          <span className="font-bold text-[#111827]">{doctor.name}</span>?
          <br />
          <br />
          The doctor will be marked as <span className="font-bold">ACTIVE</span>{" "}
          and will be able to receive new OPD appointments and appear in the
          patient-facing doctor directory again.
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
            disabled={isActivating}
            className="px-4 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            {isActivating && (
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isActivating ? "Activating..." : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
