import React from 'react';
import { User, Mail, Phone, Calendar, Briefcase, ShieldAlert } from 'lucide-react';
import type { FormValues, FormErrors } from '../hooks/useCreateStaffForm';

interface PersonalInfoSectionProps {
  form: FormValues;
  errors: FormErrors;
  setFieldValue: (name: string, value: unknown) => void;
  validateField: (name: keyof FormValues, value: string) => void;
  empIdPreview: string;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  form,
  errors,
  setFieldValue,
  validateField,
  empIdPreview,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
      <h3 className="text-[#0D47A1] font-heading font-bold text-sm border-b border-slate-100 pb-2">
        2. Employment Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">Full Name *</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={form.fullName}
              onChange={e => setFieldValue('fullName', e.target.value)}
              onBlur={() => validateField('fullName', form.fullName)}
              placeholder="e.g. Dr. Robert Vance"
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all text-text-body ${
                errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-[10px] font-semibold mt-0.5">{errors.fullName}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">Email Address *</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={form.email}
              onChange={e => setFieldValue('email', e.target.value)}
              onBlur={() => validateField('email', form.email)}
              placeholder="e.g. robert.vance@hospital.org"
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all text-text-body ${
                errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-[10px] font-semibold mt-0.5">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">Phone Number *</label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              value={form.phone}
              onChange={e => setFieldValue('phone', e.target.value)}
              onBlur={() => validateField('phone', form.phone)}
              placeholder="e.g. +1 (555) 234-5678"
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all text-text-body ${
                errors.phone ? 'border-red-500 bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white'
              }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-[10px] font-semibold mt-0.5">{errors.phone}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">Gender</label>
          <select
            value={form.gender}
            onChange={e => setFieldValue('gender', e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body cursor-pointer"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">Date of Birth</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={form.dob}
              onChange={e => setFieldValue('dob', e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body cursor-pointer"
            />
          </div>
        </div>

        {/* Employee ID Preview */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-slate-400">Employee ID (Optional)</label>
          <div className="relative">
            <ShieldAlert size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              readOnly
              value={empIdPreview}
              className="w-full bg-slate-100 border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none text-slate-500 font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>

        {/* Medical Registration Number (Doctor only) */}
        {form.role === 'DOCTOR' && (
          <div className="space-y-1 animate-fade-in">
            <label className="block text-xs font-heading font-bold text-text-body">Medical Registration Number *</label>
            <div className="relative">
              <ShieldAlert size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.registrationNumber}
                onChange={e => setFieldValue('registrationNumber', e.target.value)}
                placeholder="e.g. REG123456"
                className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all text-text-body ${
                  errors.registrationNumber ? 'border-red-500 bg-red-50/50' : 'border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white'
                }`}
              />
            </div>
            {errors.registrationNumber && <p className="text-red-500 text-[10px] font-semibold mt-0.5">{errors.registrationNumber}</p>}
          </div>
        )}

        {/* Professional Identity (Doctor only) */}
        {form.role === 'DOCTOR' && (
          <div className="space-y-1 animate-fade-in">
            <label className="block text-xs font-heading font-bold text-text-body">Professional Identity</label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.professionalIdentity}
                onChange={e => setFieldValue('professionalIdentity', e.target.value)}
                placeholder="e.g. Associate Professor"
                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default PersonalInfoSection;
