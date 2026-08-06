import React from "react";
import { Info } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface AdviceCardProps {
  advice?: string;
  lifestyleRecommendations?: string;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({
  advice,
  lifestyleRecommendations,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
          <Info size={15} className="text-[#009688]" />
        </div>
        <div>
          <div
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wide"
            style={{ fontFamily: PP }}
          >
            Clinical Advice
          </div>
          <div
            className="text-sm font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Doctor's Guidance
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {advice && (
          <div>
            <span
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"
              style={{ fontFamily: PP }}
            >
              General Advice
            </span>
            <p
              className="text-slate-600 leading-relaxed"
              style={{ fontFamily: RB }}
            >
              {advice}
            </p>
          </div>
        )}
        {lifestyleRecommendations && (
          <div>
            <span
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"
              style={{ fontFamily: PP }}
            >
              Lifestyle & Diet
            </span>
            <p
              className="text-slate-600 leading-relaxed"
              style={{ fontFamily: RB }}
            >
              {lifestyleRecommendations}
            </p>
          </div>
        )}
        {!advice && !lifestyleRecommendations && (
          <p className="text-xs text-slate-400 italic col-span-2">
            No specific advice or recommendations recorded
          </p>
        )}
      </div>
    </div>
  );
};

export default AdviceCard;
