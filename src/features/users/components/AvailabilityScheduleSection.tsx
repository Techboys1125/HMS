import React from 'react';
import { CalendarRange, Copy, AlertTriangle } from 'lucide-react';
import type { FormValues, FormErrors } from '../hooks/useCreateStaffForm';

interface AvailabilityScheduleSectionProps {
  form: FormValues;
  errors: FormErrors;
  setFieldValue: (name: string, value: unknown) => void;
  setNestedFieldValue: (
    section: 'availability',
    key: string,
    value: { isAvailable: boolean; startTime: string; endTime: string }
  ) => void;
  copyMondayHoursToWeekdays: () => void;
}

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AvailabilityScheduleSection: React.FC<AvailabilityScheduleSectionProps> = ({
  form,
  errors,
  setNestedFieldValue,
  copyMondayHoursToWeekdays,
}) => {
  const handleDayToggle = (day: string, checked: boolean) => {
    const currentDay = form.availability[day];
    setNestedFieldValue('availability', day, {
      ...currentDay,
      isAvailable: checked,
    });
  };

  const handleTimeChange = (day: string, timeType: 'startTime' | 'endTime', value: string) => {
    const currentDay = form.availability[day];
    setNestedFieldValue('availability', day, {
      ...currentDay,
      [timeType]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
        <h3 className="text-[#0D47A1] font-heading font-bold text-sm flex items-center gap-2">
          <CalendarRange size={16} />
          Doctor Availability Schedule
        </h3>

        <button
          type="button"
          onClick={copyMondayHoursToWeekdays}
          className="text-xs font-semibold text-[#009688] hover:text-[#00796B] flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Copy size={13} /> Copy Monday's Hours to Weekdays
        </button>
      </div>

      {errors.availabilityGeneral && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0 text-red-500" />
          <span>{errors.availabilityGeneral}</span>
        </div>
      )}

      {/* Grid Schedule */}
      <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden divide-y divide-gray-100 bg-white">
        {WEEK_DAYS.map(day => {
          const sched = form.availability[day] || { isAvailable: false, startTime: '', endTime: '' };
          const dayErrors = errors.availabilityDays?.[day];

          return (
            <div
              key={day}
              className={`p-4 grid grid-cols-1 sm:grid-cols-4 items-center gap-4 text-xs transition-colors ${sched.isAvailable ? 'bg-slate-50/50' : 'bg-white opacity-60'
                }`}
            >
              {/* Day Name & Checkbox */}
              <div className="col-span-1 flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`avail-${day}`}
                  checked={sched.isAvailable}
                  onChange={e => handleDayToggle(day, e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1] cursor-pointer"
                />
                <label
                  htmlFor={`avail-${day}`}
                  className="font-heading font-bold text-slate-800 cursor-pointer select-none"
                >
                  {day}
                </label>
              </div>

              {/* Start Time */}
              <div className="col-span-1 space-y-1">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase">Start Time</label>
                <input
                  type="time"
                  disabled={!sched.isAvailable}
                  value={sched.startTime}
                  onChange={e => handleTimeChange(day, 'startTime', e.target.value)}
                  className={`w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D47A1] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${dayErrors?.startTime ? 'border-red-500 bg-red-50/50' : ''
                    }`}
                />
                {sched.isAvailable && dayErrors?.startTime && (
                  <p className="text-red-500 text-[10px] font-semibold mt-0.5">{dayErrors.startTime}</p>
                )}
              </div>

              {/* End Time */}
              <div className="col-span-1 space-y-1">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase">End Time</label>
                <input
                  type="time"
                  disabled={!sched.isAvailable}
                  value={sched.endTime}
                  onChange={e => handleTimeChange(day, 'endTime', e.target.value)}
                  className={`w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D47A1] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${dayErrors?.endTime ? 'border-red-500 bg-red-50/50' : ''
                    }`}
                />
                {sched.isAvailable && dayErrors?.endTime && (
                  <p className="text-red-500 text-[10px] font-semibold mt-0.5">{dayErrors.endTime}</p>
                )}
              </div>

              {/* Status indicator */}
              <div className="col-span-1 sm:text-right">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sched.isAvailable ? 'bg-green-50 text-[#66BB6A] border border-green-200' : 'bg-slate-50 border border-slate-200 text-slate-400'
                  }`}>
                  <span className={`w-1 h-1 rounded-full ${sched.isAvailable ? 'bg-[#66BB6A]' : 'bg-slate-450'}`} />
                  {sched.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AvailabilityScheduleSection;
