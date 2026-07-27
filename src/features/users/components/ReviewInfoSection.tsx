import React from 'react';
import { User, Building2, ShieldCheck, Briefcase, DollarSign, Clock, Check } from 'lucide-react';
import type { FormValues } from '../hooks/useCreateStaffForm';

interface ReviewInfoSectionProps {
  form: FormValues;
  empIdPreview: string;
}

export const ReviewInfoSection: React.FC<ReviewInfoSectionProps> = ({
  form,
  empIdPreview,
}) => {
  const getDisplayRole = (role: string) => {
    switch (role) {
      case 'DOCTOR': return 'Doctor (OPD Clinical Portal)';
      case 'NURSE': return 'Nurse (Clinical Support)';
      case 'RECEPTIONIST': return 'Receptionist (Bookings & Queue)';
      case 'ACCOUNTANT': return 'Accountant (Billing & Financial)';
      default: return 'Staff Member';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Visual Header */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 bg-[#66BB6A]/10 text-[#66BB6A] rounded-2xl border border-[#66BB6A]/20">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="font-heading font-bold text-sm text-slate-800">Recheck & Confirm Information</h3>
          <p className="font-body text-[11px] text-slate-400 font-medium">Please review the details below before saving this new staff member account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Employment Details Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
          <h4 className="text-slate-800 font-heading font-bold text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
            <User size={14} className="text-[#0D47A1]" />
            Employment Details
          </h4>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start py-0.5">
              <span className="text-slate-400 font-medium">Full Name</span>
              <span className="text-slate-800 font-bold text-right">{form.fullName || '—'}</span>
            </div>
            
            <div className="flex justify-between items-start py-0.5">
              <span className="text-slate-400 font-medium">Email Address</span>
              <span className="text-slate-800 font-bold text-right font-mono text-[11px]">{form.email || '—'}</span>
            </div>
            
            <div className="flex justify-between items-start py-0.5">
              <span className="text-slate-400 font-medium">Phone Number</span>
              <span className="text-slate-800 font-bold text-right">{form.phone || '—'}</span>
            </div>

            <div className="flex justify-between items-start py-0.5">
              <span className="text-slate-400 font-medium">Gender</span>
              <span className="text-slate-800 font-semibold">{form.gender}</span>
            </div>

            <div className="flex justify-between items-start py-0.5">
              <span className="text-slate-400 font-medium">Date of Birth</span>
              <span className="text-slate-800 font-semibold">{form.dob ? new Date(form.dob).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}</span>
            </div>

            <div className="flex justify-between items-start py-0.5 border-t border-dashed border-slate-100 pt-3">
              <span className="text-slate-400 font-medium">Employee ID</span>
              <span className="text-[#0D47A1] font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 text-[10px]">
                {empIdPreview}
              </span>
            </div>

            {form.role === 'DOCTOR' && (
              <>
                <div className="flex justify-between items-start py-0.5">
                  <span className="text-slate-400 font-medium">Registration Number</span>
                  <span className="text-slate-800 font-bold">{form.registrationNumber || '—'}</span>
                </div>
                <div className="flex justify-between items-start py-0.5">
                  <span className="text-slate-400 font-medium">Professional Identity</span>
                  <span className="text-slate-800 font-semibold">{form.professionalIdentity || '—'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* System Access & Role Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-slate-800 font-heading font-bold text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldCheck size={14} className="text-[#0D47A1]" />
              Role & Access Level
            </h4>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">Assigned Role</span>
                <span className="text-[#0D47A1] font-heading font-bold uppercase text-[11px] bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">
                  {form.role || '—'}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed pt-2">
                This user will be registered in the system with <span className="font-semibold text-slate-700">{getDisplayRole(form.role)}</span> portals and authorizations. A dynamic system notification will be scheduled to deliver login details.
              </div>
            </div>
          </div>

          {/* Doctor Professional Info */}
          {form.role === 'DOCTOR' && (
            <div className="space-y-3 border-t border-dashed border-slate-100 pt-4 mt-4 text-xs">
              <div className="flex justify-between items-start py-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1"><Building2 size={13} /> Primary Dept</span>
                <span className="text-slate-800 font-bold text-right">{form.primaryDepartment || '—'}</span>
              </div>
              {form.secondaryDepartment && (
                <div className="flex justify-between items-start py-0.5">
                  <span className="text-slate-400 font-medium flex items-center gap-1"><Building2 size={13} /> Secondary Dept</span>
                  <span className="text-slate-800 font-bold text-right">{form.secondaryDepartment}</span>
                </div>
              )}
              <div className="flex justify-between items-start py-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1"><Briefcase size={13} /> Primary Specialty</span>
                <span className="text-slate-800 font-bold text-right">{form.primarySpecialty || '—'}</span>
              </div>
              {form.secondarySpecialty && (
                <div className="flex justify-between items-start py-0.5">
                  <span className="text-slate-400 font-medium flex items-center gap-1"><Briefcase size={13} /> Secondary Specialty</span>
                  <span className="text-slate-800 font-bold text-right">{form.secondarySpecialty}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1"><DollarSign size={13} /> Consultation Fee</span>
                <span className="text-slate-800 font-bold text-sm">₹{form.consultationFee || '0'}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Doctor Availability Hours Summary List */}
      {form.role === 'DOCTOR' && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
          <h4 className="text-slate-800 font-heading font-bold text-xs border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
            <Clock size={14} className="text-[#0D47A1]" />
            Confirmed Availability Schedule
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-[11px]">
            {Object.entries(form.availability).map(([day, sched]) => (
              <div key={day} className={`border rounded-xl p-3 flex flex-col items-center gap-1.5 text-center ${
                sched.isAvailable 
                  ? 'border-emerald-100 bg-emerald-50/30' 
                  : 'border-slate-100 bg-slate-50/50 text-slate-350'
              }`}>
                <span className="font-heading font-bold text-slate-700">{day.substring(0, 3)}</span>
                
                {sched.isAvailable ? (
                  <>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <Check size={8} /> Active
                    </span>
                    <div className="flex flex-col text-[9px] text-slate-500 font-medium mt-1 font-mono">
                      <span>{sched.startTime}</span>
                      <span className="text-[8px] text-slate-400">to</span>
                      <span>{sched.endTime}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] font-bold text-slate-350 bg-slate-100 px-1.5 py-0.5 rounded">
                      Off
                    </span>
                    <span className="text-[8px] text-slate-350 mt-1">—</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
export default ReviewInfoSection;
