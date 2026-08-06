import React from "react";
import { Pill } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export const PrescriptionEmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Pill size={22} />
      </div>
      <h4
        className="text-sm font-bold text-[#111827]"
        style={{ fontFamily: PP }}
      >
        No Prescriptions Found
      </h4>
      <p
        className="text-xs text-slate-500 max-w-xs mt-1"
        style={{ fontFamily: RB }}
      >
        No prescription records match your current filter criteria or search query.
      </p>
      <button
        onClick={onReset}
        className="mt-3 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
        style={{ fontFamily: PP }}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default PrescriptionEmptyState;
