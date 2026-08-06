import React from "react";
import { Calendar } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface FollowupCardProps {
  required: string | boolean;
  nextVisitDate?: string;
  notes?: string;
}

export const FollowupCard: React.FC<FollowupCardProps> = ({
  required,
  nextVisitDate,
  notes,
}) => {
  const isRequired =
    typeof required === "string" ? required.toLowerCase() === "yes" : required;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Calendar size={15} className="text-[#F59E0B]" />
        </div>
        <div>
          <div
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wide"
            style={{ fontFamily: PP }}
          >
            Follow-Up
          </div>
          <div
            className="text-sm font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Next Scheduled Visit
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span
            className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5"
            style={{ fontFamily: PP }}
          >
            Required
          </span>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              isRequired
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
            style={{ fontFamily: PP }}
          >
            {isRequired ? "Yes" : "No"}
          </span>
        </div>
        {isRequired && nextVisitDate && (
          <div>
            <span
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5"
              style={{ fontFamily: PP }}
            >
              Next Visit Date
            </span>
            <span
              className="text-slate-700 font-bold"
              style={{ fontFamily: RB }}
            >
              {nextVisitDate}
            </span>
          </div>
        )}
        {isRequired && notes && (
          <div className="md:col-span-3 pt-2 border-t border-slate-50">
            <span
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5"
              style={{ fontFamily: PP }}
            >
              Instructions
            </span>
            <p
              className="text-slate-600 leading-relaxed"
              style={{ fontFamily: RB }}
            >
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowupCard;
