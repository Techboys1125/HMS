import React, { useState } from 'react';
import { AlertTriangle, X, Check, Loader2, DollarSign } from 'lucide-react';
import type { AppointmentRecord } from '../types/appointment.types';

const PP = 'Poppins, sans-serif';

interface CancelModalProps {
  appointment: AppointmentRecord;
  onClose: () => void;
  onConfirmCancel: (reason: string) => Promise<void>;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  appointment,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Cancellation reason is mandatory (FR-006.07 / VR-APT-005)');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onConfirmCancel(reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="bg-rose-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <h3 className="text-sm font-bold" style={{ fontFamily: PP }}>
              Cancel Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-slate-900" style={{ fontFamily: PP }}>
              {appointment.patientName} (ID: {appointment.patientId})
            </p>
            <p className="text-slate-600">
              Doctor: <span className="font-semibold text-slate-800">{appointment.doctorName}</span>
            </p>
            <p className="text-slate-500">
              Date: {appointment.appointmentDate} at {appointment.startTime}
            </p>
          </div>

          {/* Billing warning (EX-APT-004) */}
          {appointment.paymentStatus === 'PAID' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-start gap-2">
              <DollarSign size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold" style={{ fontFamily: PP }}>Billing Impact Warning (EX-APT-004)</p>
                <p className="text-[11px] text-amber-700">
                  This appointment has a PAID status. Cancellation requires a separate billing refund/adjustment workflow.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1" style={{ fontFamily: PP }}>
              Reason for Cancellation *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State explicit reason for cancellation..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-600 bg-slate-50/50"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Confirm Cancellation
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CancelModal;
