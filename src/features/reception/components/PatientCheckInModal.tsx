import React, { useState } from "react";
import type { ReceptionQueueItem } from "../types/reception.types";
import { UserCheck, X, Clock, CheckCircle2} from "lucide-react";

interface PatientCheckInModalProps {
  item: ReceptionQueueItem | null;
  onClose: () => void;
  onConfirmCheckIn: (queueItemId: string | number, notes?: string) => Promise<void>;
}

export const PatientCheckInModal: React.FC<PatientCheckInModalProps> = ({
  item,
  onClose,
  onConfirmCheckIn,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmCheckIn(item.id, notes);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 bg-[#009688] text-white flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <UserCheck size={18} /> Arrival Check-In Confirmation
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Patient Name:</span>
              <span className="font-bold text-slate-900 text-sm">{item.patientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">MRN:</span>
              <span className="font-mono font-bold text-slate-800">{item.mrn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Doctor & Dept:</span>
              <span className="font-medium text-slate-800">
                {item.doctorName} ({item.departmentName})
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-teal-200">
              <span className="text-slate-500 font-semibold">Scheduled Time:</span>
              <span className="font-bold text-[#0D47A1]">{item.appointmentTime}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1.5">
              Check-In Notes / Special Instructions (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Wheelchair requested, patient experiencing mild fever..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#009688] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <Clock size={14} className="text-[#009688] shrink-0" />
            <span>Server Check-In Timestamp will be recorded automatically upon confirmation.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#009688] hover:bg-[#00796B] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 size={16} /> Confirm Arrival Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
