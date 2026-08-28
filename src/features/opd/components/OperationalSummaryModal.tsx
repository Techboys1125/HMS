import React from "react";
import { X } from "lucide-react";
import type { ConsultationRecord } from "../types/consultation";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export interface OperationalSummaryModalProps {
  show: boolean;
  onClose: () => void;
  consultations: ConsultationRecord[];
  tabCounts: Record<string, number>;
}

export const OperationalSummaryModal: React.FC<
  OperationalSummaryModalProps
> = ({ show, onClose, consultations, tabCounts }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3
            className="text-base font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Today's Operational Summary
          </h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs" style={{ fontFamily: RB }}>
          <div className="p-3 bg-blue-50 rounded-xl space-y-1">
            <div
              className="text-[10px] text-blue-600 font-bold uppercase"
              style={{ fontFamily: PP }}
            >
              Total OPD Consultations
            </div>
            <div
              className="text-xl font-bold text-[#0D47A1]"
              style={{ fontFamily: PP }}
            >
              {consultations.length} Consultations Today
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Completed
              </div>
              <div className="font-bold text-base text-green-700">
                {tabCounts.COMPLETED || 0}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Waiting Patients
              </div>
              <div className="font-bold text-base text-amber-700">
                {tabCounts.WAITING_FOR_DOCTOR_CALL || 0}
              </div>
            </div>
          </div>

          <div className="pt-2 text-slate-500 italic text-[11px]">
            Hospital Administrator operational view — live monitoring data
            refreshed continuously.
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
            style={{ fontFamily: PP }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
