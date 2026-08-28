import React, { useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ShieldAlert,
  Upload,
  Camera,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import type { FormValues, FormErrors } from "../hooks/useCreateStaffForm";
import UserAvatar from "../../../common/components/UserAvatar";

interface PersonalInfoSectionProps {
  form: FormValues;
  errors: FormErrors;
  setFieldValue: (name: string, value: unknown) => void;
  validateField: (name: keyof FormValues, value: string) => void;
  empIdPreview: string;
  photoUploading?: boolean;
  photoUploadError?: string | null;
  photoPreviewUrl?: string | null;
  onPhotoUpload?: (file: File) => void;
  onRemovePhoto?: () => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  form,
  errors,
  setFieldValue,
  validateField,
  photoUploading = false,
  photoUploadError = null,
  photoPreviewUrl = null,
  onPhotoUpload,
  onRemovePhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-5">
      <h3 className="text-[#0D47A1] font-heading font-bold text-sm border-b border-slate-100 pb-2">
        2. Employment Information
      </h3>

      {/* Profile Photo / Staff Photo Upload Section */}
      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar / Image Preview */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center relative">
            {photoPreviewUrl || form.photoUrl ? (
              <img
                src={photoPreviewUrl || form.photoUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserAvatar
                name={form.fullName || "Staff"}
                size="xl"
                src={form.photoUrl || undefined}
              />
            )}

            {photoUploading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <Loader2 size={20} className="animate-spin text-white" />
                <span className="text-[9px] font-bold mt-1">Uploading...</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={photoUploading}
            title="Change Photo"
            className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-[#0D47A1] text-white rounded-xl shadow-md hover:bg-[#0c3d8a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
          >
            <Camera size={13} />
          </button>
        </div>

        {/* Photo Details & Actions */}
        <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-heading font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <ImageIcon size={14} className="text-[#0D47A1]" />
                Staff Profile Photo
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Upload a clear profile photo (JPG, PNG, WEBP, GIF up to 5MB).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2 pt-1 sm:pt-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onPhotoUpload) {
                    onPhotoUpload(file);
                  }
                  e.target.value = "";
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                className="px-3.5 py-1.5 bg-white border border-[#E5E7EB] hover:border-[#0D47A1] hover:text-[#0D47A1] text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {photoUploading ? (
                  <>
                    <Loader2
                      size={13}
                      className="animate-spin text-[#0D47A1]"
                    />
                    Uploading...
                  </>
                ) : form.photoUrl || photoPreviewUrl ? (
                  <>
                    <Upload size={13} /> Replace Photo
                  </>
                ) : (
                  <>
                    <Upload size={13} /> Select Image
                  </>
                )}
              </button>

              {(form.photoUrl || photoPreviewUrl) && !photoUploading && (
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="px-3 py-1.5 bg-red-50 text-[#EF4444] hover:bg-red-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
          </div>

          {photoUploadError && (
            <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-[11px] text-[#EF4444] font-semibold flex items-center gap-1.5 animate-fade-in">
              <AlertTriangle size={13} className="shrink-0" />
              <span>{photoUploadError}</span>
            </div>
          )}

          {form.photoUrl && !photoUploadError && !photoUploading && (
            <div className="text-[11px] text-green-700 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <CheckCircle2 size={13} className="text-[#66BB6A]" />
              Photo uploaded & ready for saving
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <span className="block text-xs font-heading font-bold text-text-body">
            Full Name *
          </span>
          <div className="relative">
            <User
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              aria-label="Input field"
              type="text"
              value={form.fullName}
              onChange={(e) => setFieldValue("fullName", e.target.value)}
              onBlur={() => validateField("fullName", form.fullName)}
              placeholder="e.g. Dr. Robert Vance"
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-colors text-text-body ${
                errors.fullName
                  ? "border-red-500 bg-red-50/50"
                  : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-[10px] font-semibold mt-0.5">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <span className="block text-xs font-heading font-bold text-text-body">
            Email Address *
          </span>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              aria-label="Input field"
              type="email"
              value={form.email}
              onChange={(e) => setFieldValue("email", e.target.value)}
              onBlur={() => validateField("email", form.email)}
              placeholder="e.g. robert.vance@hospital.org"
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-colors text-text-body ${
                errors.email
                  ? "border-red-500 bg-red-50/50"
                  : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-[10px] font-semibold mt-0.5">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <span className="block text-xs font-heading font-bold text-text-body">
            Phone Number *
          </span>
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              aria-label="Input field"
              type="tel"
              value={form.phone}
              onChange={(e) => setFieldValue("phone", e.target.value)}
              onBlur={() => validateField("phone", form.phone)}
              placeholder="e.g. +1 (555) 234-5678"
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-colors text-text-body ${
                errors.phone
                  ? "border-red-500 bg-red-50/50"
                  : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-[10px] font-semibold mt-0.5">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <span className="block text-xs font-heading font-bold text-text-body">
            Gender
            <select
              aria-label="Select option"
              value={form.gender}
              onChange={(e) => setFieldValue("gender", e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-text-body cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </span>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <span className="block text-xs font-heading font-bold text-text-body">
            Date of Birth
          </span>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              aria-label="Input field"
              type="date"
              value={form.dob}
              onChange={(e) => setFieldValue("dob", e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-text-body cursor-pointer"
            />
          </div>
        </div>

        {/* Employee ID Preview */}
        {/* <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-slate-400">
            Employee ID (Optional)
          </label>
          <div className="relative">
            <ShieldAlert
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              readOnly
              value={empIdPreview}
              className="w-full bg-slate-100 border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none text-slate-500 font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div> */}

        {/* Medical Registration Number (Doctor only) */}
        {form.role === "DOCTOR" && (
          <div className="space-y-1 animate-fade-in">
            <span className="block text-xs font-heading font-bold text-text-body">
              Medical Registration Number *
            </span>
            <div className="relative">
              <ShieldAlert
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                aria-label="Input field"
                type="text"
                value={form.registrationNumber}
                onChange={(e) =>
                  setFieldValue("registrationNumber", e.target.value)
                }
                placeholder="e.g. REG123456"
                className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-colors text-text-body ${
                  errors.registrationNumber
                    ? "border-red-500 bg-red-50/50"
                    : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
                }`}
              />
            </div>
            {errors.registrationNumber && (
              <p className="text-red-500 text-[10px] font-semibold mt-0.5">
                {errors.registrationNumber}
              </p>
            )}
          </div>
        )}

        {/* Professional Identity (Doctor only) */}
        {form.role === "DOCTOR" && (
          <div className="space-y-1 animate-fade-in">
            <span className="block text-xs font-heading font-bold text-text-body">
              Professional Identity
            </span>
            <div className="relative">
              <Briefcase
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                aria-label="Input field"
                type="text"
                value={form.professionalIdentity}
                onChange={(e) =>
                  setFieldValue("professionalIdentity", e.target.value)
                }
                placeholder="e.g. Associate Professor"
                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-text-body"
              />
            </div>
          </div>
        )}

        {/* Residential Address */}
        <div className="space-y-1 md:col-span-1">
          <span className="block text-xs font-heading font-bold text-text-body">
            Residential Address{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
            <input
              aria-label="Input field"
              type="text"
              value={form.residentialAddress}
              onChange={(e) =>
                setFieldValue("residentialAddress", e.target.value)
              }
              placeholder="e.g. 123 Healthcare Avenue, Suite 400, City, Country"
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-text-body"
            />
          </span>
        </div>

        {/* Professional Bio (Doctor only) */}
        {form.role === "DOCTOR" && (
          <div className="space-y-1 md:col-span-2 animate-fade-in">
            <span className="block text-xs font-heading font-bold text-text-body">
              Professional Bio{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </span>
            <textarea
              aria-label="Text area"
              rows={3}
              value={form.professionalBio}
              onChange={(e) => setFieldValue("professionalBio", e.target.value)}
              placeholder="Summary of clinical expertise, achievements, and patient care philosophy..."
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-colors text-text-body resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
