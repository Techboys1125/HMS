import { KeyRound, AlertTriangle, X } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";

export interface ResetPasswordDialogProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
  onConfirm: () => void;
  isResetting?: boolean;
}

export function ResetPasswordDialog({
  isOpen,
  doctor,
  onClose,
  onConfirm,
  isResetting,
}: ResetPasswordDialogProps) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden transition-transform duration-200"
        style={{ fontFamily: RB }}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3
            className="font-bold text-sm flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <KeyRound size={16} className="text-amber-500" /> Administrative
            Password Reset
          </h3>
          <button aria-label="Close"
            onClick={onClose}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-500 leading-relaxed">
            You are about to trigger a password reset for{" "}
            <strong className="text-slate-900">
              {doctor.name} ({doctor.empId})
            </strong>
            . This will revoke their current password immediately.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 text-amber-800">
            <AlertTriangle
              size={18}
              className="shrink-0 text-amber-600 mt-0.5"
            />
            <p className="leading-relaxed">
              Upon submission, the doctor's login access will be set to Pending
              Password Setup. A password reset link will be sent to the email:{" "}
              <strong>{doctor.email}</strong>.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#E5E7EB]">
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
              disabled={isResetting}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              {isResetting && (
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {isResetting ? "Resetting..." : "Confirm Reset"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
