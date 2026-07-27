import { X, AlertTriangle } from "lucide-react";
import type { Patient as BackendPatient } from "../types/patient.types";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

/**
 * Shown when potential duplicate patients are found during registration.
 * Design matches the original DuplicateWarningDialog usage contract.
 */
export function DuplicateWarningDialog({
  candidates,
  onSelectExisting,
  onCancel,
  onRequestOverride,
  canOverride,
}: {
  candidates: BackendPatient[];
  onSelectExisting: (mrn: string) => void;
  onCancel: () => void;
  onRequestOverride: () => void;
  canOverride: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3
              className="text-sm font-bold text-amber-900"
              style={{ fontFamily: PP }}
            >
              Possible Duplicate Patients
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-amber-600/70 hover:text-amber-900 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3 max-h-64 overflow-y-auto" style={{ fontFamily: RB }}>
          <p className="text-xs text-slate-600">
            We found {candidates.length} existing record
            {candidates.length !== 1 ? "s" : ""} that may match this patient.
            Select an existing patient or request an override to create a new
            one.
          </p>
          {candidates.map((c) => (
            <button
              key={c.mrn}
              type="button"
              onClick={() => onSelectExisting(c.mrn)}
              className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-[#0D47A1] hover:bg-blue-50/50 transition-colors"
            >
              <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>
                {c.patientName || c.name}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                MRN: {c.mrn} · {c.phone}
              </div>
            </button>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2 bg-slate-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            style={{ fontFamily: PP }}
          >
            Cancel
          </button>
          {canOverride && (
            <button
              type="button"
              onClick={onRequestOverride}
              className="px-3.5 py-2 text-xs font-bold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a]"
              style={{ fontFamily: PP }}
            >
              Create Anyway (Override)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}