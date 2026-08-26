import React from "react";
import { CheckCircle2, Printer, X, Activity, User, Clock } from "lucide-react";
import { PP, RB } from "../../appointments/constants/appointment.constants";

export interface CheckInConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenNumber: string;
  patientName: string;
  patientMrn: string;
  doctorName?: string;
  departmentName?: string;
  appointmentTime?: string;
  status?: string;
  onPrintSlip?: () => void;
}

export const CheckInConfirmationModal: React.FC<
  CheckInConfirmationModalProps
> = ({
  isOpen,
  onClose,
  tokenNumber,
  patientName,
  patientMrn,
  doctorName = "Duty Doctor",
  departmentName = "Outpatient OPD",
  appointmentTime = "Now",
  status = "Waiting for Vitals",
  onPrintSlip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative flex flex-col items-center text-center space-y-4 transition-transform duration-200"
        style={{ fontFamily: RB }}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Animated Checkmark Circle */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0 mt-1">
          <CheckCircle2
            size={36}
            className="transition-transform duration-300"
          />
        </div>

        {/* Modal Header */}
        <div>
          <h2
            className="text-xl font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: PP }}
          >
            Check-In Confirmed!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Patient queue token generated successfully and status updated.
          </p>
        </div>

        {/* Token Card */}
        <div className="w-full bg-linear-to-br from-[#0D47A1] via-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-lg border border-blue-800 text-left relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
            <span>Queue Token</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Activity size={10} /> {status}
            </span>
          </div>

          <div
            className="text-4xl font-extrabold text-white font-mono tracking-tight my-1"
            style={{ fontFamily: PP }}
          >
            {tokenNumber}
          </div>

          <div className="border-t border-white/10 pt-3 mt-3 space-y-1 text-xs text-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-blue-300 flex items-center gap-1">
                <User size={12} /> Patient:
              </span>
              <strong className="text-white font-semibold">
                {patientName}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-white">{patientMrn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-300">Doctor & Dept:</span>
              <span className="text-white">
                {doctorName} ({departmentName})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-blue-300 flex items-center gap-1">
                <Clock size={12} /> Time:
              </span>
              <span className="text-white font-mono">{appointmentTime}</span>
            </div>
          </div>
        </div>

        {/* Workflow Routing Note */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-left flex items-start gap-2.5">
          <Activity size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Next Step:</span> Patient status set to{" "}
            <strong className="underline decoration-amber-400">{status}</strong>
            . This patient is now visible in the{" "}
            <strong>Nurse Vitals Management</strong> workspace.
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="w-full grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              if (onPrintSlip) onPrintSlip();
              else window.print();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            style={{ fontFamily: PP }}
          >
            <Printer size={14} /> Print Token Slip
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            style={{ fontFamily: PP }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
