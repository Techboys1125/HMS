import React from "react";
import { Calendar } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface FollowupFormProps {
  required: boolean;
  nextVisitDate: string;
  notes: string;
  onChange: (field: string, val: string | boolean) => void;
}

export const FollowupForm: React.FC<FollowupFormProps> = ({
  required,
  nextVisitDate,
  notes,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Calendar size={16} className="text-[#F59E0B]" />
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Follow-Up Scheduling
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="flex items-center gap-2.5 p-3 border border-[#E5E7EB] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none bg-slate-50/50">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => onChange("followupRequired", e.target.checked)}
            className="rounded border-[#E5E7EB] text-[#0D47A1] focus:ring-[#0D47A1]/20 w-4 h-4"
          />
          <span
            className="text-xs font-semibold text-slate-700"
            style={{ fontFamily: PP }}
          >
            Follow-Up Required
          </span>
        </label>

        {required && (
          <div className="w-full sm:w-auto">
            <input aria-label="Input field"
              type="date"
              value={nextVisitDate}
              onChange={(e) => onChange("nextVisitDate", e.target.value)}
              className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              style={{ fontFamily: RB }}
            />
          </div>
        )}
      </div>

      {required && (
        <div>
          <span
            className="block text-[11px] font-semibold text-[#64748B] mb-1"
            style={{ fontFamily: PP }}
          >
            Follow-Up Notes & Instructions
          </span>
          <textarea aria-label="Text area"
            value={notes}
            onChange={(e) => onChange("followupNotes", e.target.value)}
            placeholder="e.g. Review ECG & blood reports. Adjust anti-hypertensive dosage if required."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors resize-none"
            style={{ fontFamily: RB }}
          />
        </div>
      )}
    </div>
  );
};

export default FollowupForm;
