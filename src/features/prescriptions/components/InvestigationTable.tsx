import React from "react";
import { FileText } from "lucide-react";

export const InvestigationTable: React.FC<{ investigations: string[] }> = ({ investigations }) => {
  if (!investigations || investigations.length === 0) {
    return <div className="text-xs text-slate-400">No investigations recommended.</div>;
  }
  return (
    <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3">
      {investigations.map((inv, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <FileText size={12} className="text-blue-500" />
          <span>{inv}</span>
        </div>
      ))}
    </div>
  );
};

export default InvestigationTable;
