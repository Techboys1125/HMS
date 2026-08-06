import React from "react";
import { AlertCircle } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface ChiefComplaintCardProps {
  complaint: string;
  duration?: string;
  historyOfPresentIllness?: string;
}

export const ChiefComplaintCard: React.FC<ChiefComplaintCardProps> = ({
  complaint,
  duration,
  historyOfPresentIllness,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <AlertCircle size={15} className="text-[#EF4444]" />
        </div>
        <div>
          <div
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wide"
            style={{ fontFamily: PP }}
          >
            Chief Complaint
          </div>
          <div
            className="text-sm font-semibold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            {complaint || "No complaint recorded"}
          </div>
        </div>
      </div>

      {duration && (
        <div className="text-xs text-slate-500">
          <span className="font-semibold" style={{ fontFamily: PP }}>
            Duration:
          </span>{" "}
          {duration}
        </div>
      )}

      {historyOfPresentIllness && (
        <p
          className="text-sm text-slate-600 leading-relaxed"
          style={{ fontFamily: RB }}
        >
          {historyOfPresentIllness}
        </p>
      )}
    </div>
  );
};

export default ChiefComplaintCard;
