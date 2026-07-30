import React from "react";
import type { ReceptionQueueItem } from "../types/reception.types";
import { Printer, X, Building2} from "lucide-react";

interface VisitSlipModalProps {
  item: ReceptionQueueItem | null;
  onClose: () => void;
}

export const VisitSlipModal: React.FC<VisitSlipModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-scale-in">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="font-bold text-xs flex items-center gap-2">
            <Printer size={16} className="text-[#009688]" /> Reception Visit Slip
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Printable Content */}
        <div className="p-6 space-y-4 text-slate-900 font-sans print:p-0" id="printable-visit-slip">
          <div className="text-center pb-3 border-b border-slate-200">
            <div className="flex items-center justify-center gap-1.5 font-bold text-base text-[#0D47A1]">
              <Building2 size={18} /> SAFE HANDS HOSPITAL
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Outpatient Department Visit Token Slip</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
              Queue Token Number
            </span>
            <div className="text-3xl font-mono font-extrabold text-[#0D47A1] my-1">
              {item.tokenNumber}
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              {item.visitType} • {item.queueStatus}
            </span>
          </div>

          <div className="space-y-2 text-xs border-b border-slate-200 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient Name:</span>
              <span className="font-bold text-slate-900">{item.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MRN Number:</span>
              <span className="font-mono font-bold">{item.mrn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800">{item.departmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Doctor:</span>
              <span className="font-semibold text-slate-800">{item.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consultation Fee:</span>
              <span className="font-bold text-slate-900">₹{item.consultationFee} ({item.billingStatus})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Check-In Time:</span>
              <span className="font-medium text-slate-700">
                {item.arrivalTime || item.appointmentTime}
              </span>
            </div>
          </div>

          {/* Barcode Mock */}
          <div className="text-center pt-1">
            <div className="inline-block px-4 py-1.5 bg-slate-100 font-mono text-xs tracking-widest border border-slate-300 rounded-sm">
              ||||| | |||| ||| |||| | |||||
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Please present this slip at the consultation desk</p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Printer size={15} /> Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};
