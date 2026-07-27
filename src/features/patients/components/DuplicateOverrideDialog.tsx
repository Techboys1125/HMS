import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

/**
 * Confirmation dialog requiring a reason when overriding duplicate detection.
 */
export function DuplicateOverrideDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-[#0D47A1] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-blue-100" />
            <h3 className="text-sm font-bold" style={{ fontFamily: PP }}>
              Override Duplicate Check
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-white/80 hover:text-white rounded-lg"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3" style={{ fontFamily: RB }}>
          <p className="text-xs text-slate-600">
            Please provide a reason for creating this patient despite possible
            duplicates. This will be logged for audit.
          </p>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Different person with same name / verified identity"
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] resize-none"
          />
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
          <button
            type="button"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason.trim())}
            className="px-3.5 py-2 text-xs font-bold bg-[#0D47A1] text-white rounded-xl hover:bg-[#0c3d8a] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: PP }}
          >
            Confirm Override
          </button>
        </div>
      </div>
    </div>
  );
}