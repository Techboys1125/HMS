import React from "react";
import { Receipt, X, Printer, CheckCircle } from "lucide-react";
import { formatTime } from "../../lib/time-utils";

interface QueueTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenNumber: string;
  patientName: string;
  patientMrn: string;
  doctorName?: string;
  departmentName?: string;
  appointmentTime?: string;
  onPrint?: () => void;
}

export const QueueTokenModal: React.FC<QueueTokenModalProps> = ({
  isOpen,
  onClose,
  tokenNumber,
  patientName,
  patientMrn,
  doctorName = "Duty Doctor",
  departmentName = "General OPD",
  appointmentTime = formatTime(appointmentTime || "09:00 AM"),
  onPrint,
}) => {
  if (!isOpen) return null;

  const handlePrint = onPrint || (() => window.print());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-150 shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-[#0D47A1]" />
            <span className="font-bold text-[#1E293B] text-sm">
              Queue Token Slip
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center">
          {/* Success Check */}
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200 mb-5">
            <CheckCircle size={12} />
            <span>Checked-In Successfully</span>
          </div>

          {/* Token Box */}
          <div className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
              Queue Token
            </span>
            <span className="text-4xl font-extrabold text-[#0D47A1] mt-1 font-mono tracking-tight">
              {tokenNumber}
            </span>
            <span className="text-[10px] text-slate-450 mt-1 font-mono">
              {new Date().toLocaleDateString()}
            </span>

            {/* Slip Key Value Pairs */}
            <div className="w-full border-t border-gray-200/60 mt-4 pt-4 text-xs font-medium space-y-2.5 text-left text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="text-[#1E293B] font-bold">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MRN:</span>
                <span className="text-[#1E293B] font-mono font-bold">
                  {patientMrn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="text-[#1E293B] font-bold">{doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dept:</span>
                <span className="text-[#1E293B] font-bold">
                  {departmentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Slot:</span>
                <span className="text-[#1E293B] font-bold">
                  {appointmentTime}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-4 border-t border-gray-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-250 text-slate-700 bg-white hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2 bg-[#0D47A1] hover:bg-[#0c3d8a] text-white rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs text-xs"
          >
            <Printer size={14} />
            <span>Print Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueTokenModal;
