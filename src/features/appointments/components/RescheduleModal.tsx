import React, { useState } from 'react';
import { Calendar, AlertCircle, X, Check, Loader2 } from 'lucide-react';
import type { AppointmentRecord } from '../types/appointment.types';

const PP = 'Poppins, sans-serif';

interface RescheduleModalProps {
  appointment: AppointmentRecord;
  onClose: () => void;
  onConfirmReschedule: (date: string, time: string, reason: string) => Promise<void>;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  onClose,
  onConfirmReschedule,
}) => {
  const [newDate, setNewDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [newTime, setNewTime] = useState('11:00 AM');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Reschedule reason is mandatory (BR-APT-005 / VR-APT-005)');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onConfirmReschedule(newDate, newTime, reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-400" />
            <h3 className="text-sm font-bold" style={{ fontFamily: PP }}>
              Reschedule Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold text-slate-900" style={{ fontFamily: PP }}>
              {appointment.patientName} (ID: {appointment.patientId})
            </p>
            <p className="text-slate-600">
              Doctor: <span className="font-semibold text-slate-800">{appointment.doctorName}</span>
            </p>
            <p className="text-slate-500">
              Current: {appointment.appointmentDate} at {appointment.startTime}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1" style={{ fontFamily: PP }}>
              New Appointment Date *
            </label>
            <input
              type="date"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0D47A1] bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1" style={{ fontFamily: PP }}>
              New Time Slot *
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0D47A1] bg-slate-50/50"
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:30 PM">03:30 PM</option>
              <option value="04:30 PM">04:30 PM</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1" style={{ fontFamily: PP }}>
              Reschedule Reason *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide explicit reason for rescheduling..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0D47A1] bg-slate-50/50"
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0c3d8a] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Confirm Reschedule
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RescheduleModal;
