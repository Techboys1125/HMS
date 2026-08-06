import React from "react";
import { MessageSquare } from "lucide-react";

export const PrescriptionAdviceCard: React.FC<{ advice: string }> = ({ advice }) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
        <MessageSquare size={13} className="text-[#0D47A1]" />
        Doctor's Advice & Clinical Instructions
      </div>
      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
        {advice || "No specific advice recorded."}
      </p>
    </div>
  );
};

export default PrescriptionAdviceCard;
