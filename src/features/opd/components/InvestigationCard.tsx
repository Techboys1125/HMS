import React from "react";
import { Search } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface InvestigationCardProps {
  investigations?: string[];
  remarks?: string;
}

export const InvestigationCard: React.FC<InvestigationCardProps> = ({
  investigations = [],
  remarks,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Search size={15} className="text-[#0D47A1]" />
        </div>
        <div>
          <div
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wide"
            style={{ fontFamily: PP }}
          >
            Investigations
          </div>
          <div
            className="text-sm font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Recommended Labs & Diagnostics
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {investigations.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {investigations.map((i, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-blue-50 text-[#0D47A1] text-xs rounded-full font-medium border border-blue-100"
                style={{ fontFamily: RB }}
              >
                {i}
              </span>
            ))}
          </div>
        ) : (
          <p
            className="text-xs text-slate-400 italic"
            style={{ fontFamily: RB }}
          >
            No investigations recommended
          </p>
        )}

        {remarks && (
          <div className="pt-2 border-t border-slate-50">
            <span
              className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1"
              style={{ fontFamily: PP }}
            >
              Remarks
            </span>
            <p
              className="text-sm text-slate-600 leading-relaxed"
              style={{ fontFamily: RB }}
            >
              {remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigationCard;
