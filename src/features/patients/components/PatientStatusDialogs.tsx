import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { Patient } from "../types/patient.types";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface DeactivatePatientDialogProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeactivating?: boolean;
}

export function DeactivatePatientDialog({
  isOpen,
  patient,
  onClose,
  onConfirm,
  isDeactivating,
}: DeactivatePatientDialogProps) {
  if (!isOpen || !patient) return null;
  const name = patient.patientName || patient.fullName || patient.name || "Patient";
  const mrn = patient.mrn || String(patient.id);

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
              Deactivate Patient
            </h3>
            <p className="text-xs text-[#64748B]">
              {name} ({mrn})
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to set status to <span className="font-bold text-red-600">INACTIVE</span> for{" "}
          <span className="font-bold text-[#111827]">{name}</span>?
          <br />
          <br />
          Inactive patient accounts cannot book new appointments until reactivated by administrative staff.
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
            disabled={isDeactivating}
            className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{ fontFamily: PP }}
          >
            {isDeactivating && (
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isDeactivating ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export interface ActivatePatientDialogProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onConfirm: () => void;
  isActivating?: boolean;
}

export function ActivatePatientDialog({
  isOpen,
  patient,
  onClose,
  onConfirm,
  isActivating,
}: ActivatePatientDialogProps) {
  if (!isOpen || !patient) return null;
  const name = patient.patientName || patient.fullName || patient.name || "Patient";
  const mrn = patient.mrn || String(patient.id);

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
              Activate Patient
            </h3>
            <p className="text-xs text-[#64748B]">
              {name} ({mrn})
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to reactivate{" "}
          <span className="font-bold text-[#111827]">{name}</span>?
          <br />
          <br />
          The patient account will be marked as <span className="font-bold text-emerald-600">ACTIVE</span> and restored to full access.
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
            {isActivating ? "Activate..." : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
