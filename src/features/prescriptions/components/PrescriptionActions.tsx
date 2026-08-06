import React from "react";
import { Printer, Download, CheckCircle2 } from "lucide-react";

export const PrescriptionActions: React.FC<{
  onPrint: () => void;
  onDownload: () => void;
  onFinalize?: () => void;
  role: "patient" | "doctor" | "admin";
  status?: string;
}> = ({ onPrint, onDownload, onFinalize, role, status }) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrint} className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-sm">
        <Printer size={14} /> Print
      </button>
      <button onClick={onDownload} className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-sm">
        <Download size={14} /> PDF
      </button>
      {role === "doctor" && status === "Draft" && onFinalize && (
        <button onClick={onFinalize} className="px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 size={14} /> Finalize
        </button>
      )}
    </div>
  );
};

export default PrescriptionActions;
