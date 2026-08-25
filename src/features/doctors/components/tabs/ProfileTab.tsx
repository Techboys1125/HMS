import { useState, useRef } from "react";
import {
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Stethoscope,
  Hash,
  Tag,
  Camera,
  Trash2,
  Loader2,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  Clock,
  User,
  Info,
} from "lucide-react";
import type { DoctorRecord } from "../../types/doctors.types";
import { PP, RB } from "../../constants/doctors.constants";
import UserAvatar from "../../../../common/components/UserAvatar";
import { usersApi } from "../../../users/api/users.api";

export interface ProfileTabProps {
  doctor: DoctorRecord;
  isOwnProfile: boolean;
  canEdit: boolean;
  onSave?: (updated: DoctorRecord) => void;
}

const fieldStyle = (editable: boolean) =>
  editable
    ? "bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] w-full transition-colors"
    : "bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-2 text-xs text-[#111827] w-full";

export function ProfileTab({ doctor, canEdit, onSave }: ProfileTabProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<DoctorRecord>(doctor);
  const [saving, setSaving] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const [prevDoctor, setPrevDoctor] = useState(doctor);
  if (doctor !== prevDoctor) {
    setPrevDoctor(doctor);
    setFormData(doctor);
    setPhotoPreviewUrl(null);
  }

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    const localBlob = URL.createObjectURL(file);
    setPhotoPreviewUrl(localBlob);
    setPhotoUploading(true);
    setPhotoUploadError(null);
    try {
      const uploadedUrl = await usersApi.uploadPhoto(file);
      setFormData((prev) => ({
        ...prev,
        photoUrl: uploadedUrl,
        photo: uploadedUrl,
      }));
    } catch (err: unknown) {
      setPhotoUploadError(
        err instanceof Error ? err.message : "Failed to upload photo",
      );
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreviewUrl(null);
    setFormData((prev) => ({
      ...prev,
      photoUrl: "",
      photo: "",
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      setEditing(false);
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const displayPhoto = photoPreviewUrl || formData.photoUrl || formData.photo;

  return (
    <div className="space-y-6" style={{ fontFamily: RB }}>
      {/* ─── SECTION 1: PERSONAL INFORMATION (EDITABLE BY DOCTOR) ─── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3
              className="text-sm font-bold text-[#111827] flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <User size={16} className="text-[#0D47A1]" />
              Personal Information
            </h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Personal contact details, residential address, and profile photo
              (editable by you).
            </p>
          </div>
          {canEdit && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors shadow-xs cursor-pointer"
            >
              Edit Personal Info
            </button>
          )}
        </div>

        {/* Profile Photo Display / Upload Section */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
          <UserAvatar
            name={formData.name || "Doctor"}
            size="lg"
            src={displayPhoto || undefined}
          />
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="block text-xs font-bold text-[#111827]">
              Profile Photo{" "}
              {editing && (
                <span className="text-[#0D47A1] font-normal">(Editable)</span>
              )}
            </span>
            {editing ? (
              <div>
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file);
                  }}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={photoUploading}
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-[#CBD5E1] hover:border-[#0D47A1] text-[#0D47A1] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-60 shadow-xs cursor-pointer"
                  >
                    {photoUploading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Camera size={13} />
                    )}
                    {displayPhoto ? "Change Photo" : "Upload Photo"}
                  </button>
                  {Boolean(displayPhoto) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[#64748B] mt-1">
                  JPG, PNG, WebP up to 5MB.
                </p>
                {photoUploadError && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {photoUploadError}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-[#64748B]">
                {displayPhoto
                  ? "Custom profile photo is active."
                  : "No profile photo uploaded. Click Edit Personal Info to upload one."}
              </p>
            )}
          </div>
        </div>

        {/* Personal Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              Full Name
            </span>
            {editing ? (
              <input
                aria-label="Input field"
                type="text"
                value={formData.fullName || formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                    name: e.target.value.startsWith("Dr.")
                      ? e.target.value
                      : `Dr. ${e.target.value}`,
                  })
                }
                className={fieldStyle(true)}
                placeholder="e.g. Dr. Sarath"
              />
            ) : (
              <div className={fieldStyle(false)}>{formData.name || "—"}</div>
            )}
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Phone size={12} className="inline mr-1 text-[#0D47A1]" />
              Phone / Mobile
            </span>
            {editing ? (
              <input
                aria-label="Input field"
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={fieldStyle(true)}
                placeholder="e.g. +91 9876543210"
              />
            ) : (
              <div className={fieldStyle(false)}>{formData.phone || "—"}</div>
            )}
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Mail size={12} className="inline mr-1 text-[#0D47A1]" />
              Email Address
            </span>
            {editing ? (
              <input
                aria-label="Input field"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={fieldStyle(true)}
                placeholder="e.g. doctor@hospital.com"
              />
            ) : (
              <div className={fieldStyle(false)}>{formData.email || "—"}</div>
            )}
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <User size={12} className="inline mr-1 text-[#0D47A1]" />
              Gender
            </span>
            {editing ? (
              <select
                aria-label="Select option"
                value={formData.gender || "Male"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "Male" | "Female" | "Other",
                  })
                }
                className={fieldStyle(true)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <div className={fieldStyle(false)}>{formData.gender || "—"}</div>
            )}
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Calendar size={12} className="inline mr-1 text-[#0D47A1]" />
              Date of Birth
            </span>
            {editing ? (
              <input
                aria-label="Input field"
                type="date"
                value={formData.dob || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className={fieldStyle(true)}
              />
            ) : (
              <div className={fieldStyle(false)}>{formData.dob || "—"}</div>
            )}
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <MapPin size={12} className="inline mr-1 text-[#0D47A1]" />
              Residential Address
            </span>
            {editing ? (
              <input
                aria-label="Input field"
                type="text"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={fieldStyle(true)}
                placeholder="e.g. 123 Healthcare Ave, City"
              />
            ) : (
              <div className={fieldStyle(false)}>{formData.address || "—"}</div>
            )}
          </div>
        </div>

        <div>
          <span className="block text-[11px] font-bold text-[#64748B] mb-1">
            Professional Bio / Summary
          </span>
          {editing ? (
            <textarea
              aria-label="Text area"
              rows={3}
              value={formData.bio || ""}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className={fieldStyle(true)}
              placeholder="Write a brief summary of your clinical background and medical interests..."
            />
          ) : (
            <div className={fieldStyle(false)}>{formData.bio || "—"}</div>
          )}
        </div>

        {editing && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || photoUploading}
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {saving ? "Saving..." : "Save Personal Details"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(doctor);
                setPhotoPreviewUrl(null);
                setEditing(false);
              }}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ─── SECTION 2: PROFESSIONAL & HOSPITAL INFORMATION (HOSPITAL MANAGED / READ-ONLY) ─── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3
              className="text-sm font-bold text-[#111827] flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <ShieldCheck size={16} className="text-[#009688]" />
              Professional & Clinical Credentials
            </h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Verified clinical registrations, assigned departments, and
              consultation fees.
            </p>
          </div>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Building2 size={11} /> Hospital Managed
          </span>
        </div>

        {/* Informational Banner */}
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5">
          <Info size={15} className="text-[#0D47A1] shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-700 leading-relaxed">
            Professional credentials, medical license numbers, department
            assignments, and consultation fee schedules are managed by Hospital
            Administration to maintain compliance. To request updates to your
            qualifications or department affiliations, please contact the
            Hospital Admin desk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Hash size={12} className="inline mr-1 text-slate-500" />
              Doctor ID
            </span>
            <div className={fieldStyle(false)}>{formData.id || "—"}</div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Building2 size={12} className="inline mr-1 text-slate-500" />
              Employee ID
            </span>
            <div className={fieldStyle(false)}>{formData.empId || "—"}</div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <ShieldCheck size={12} className="inline mr-1 text-teal-600" />
              Registration Number
            </span>
            <div className={fieldStyle(false)}>{formData.regNumber || "—"}</div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <GraduationCap
                size={12}
                className="inline mr-1 text-purple-600"
              />
              Qualification
            </span>
            <div className={fieldStyle(false)}>
              {formData.qualification || "—"}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Stethoscope size={12} className="inline mr-1 text-blue-600" />
              Experience
            </span>
            <div className={fieldStyle(false)}>
              {formData.experienceYrs ? `${formData.experienceYrs} years` : "—"}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Tag size={12} className="inline mr-1 text-amber-600" />
              Department
            </span>
            <div className={fieldStyle(false)}>
              {formData.department || "—"}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Hash size={12} className="inline mr-1 text-indigo-600" />
              Specialty
            </span>
            <div className={fieldStyle(false)}>{formData.specialty || "—"}</div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <CreditCard size={12} className="inline mr-1 text-green-600" />
              Consultation Fee
            </span>
            <div className={fieldStyle(false)}>
              {formData.consultationFee ? `₹${formData.consultationFee}` : "—"}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#64748B] mb-1">
              <Clock size={12} className="inline mr-1 text-slate-500" />
              Slot Duration
            </span>
            <div className={fieldStyle(false)}>
              {formData.slotDurationMinutes
                ? `${formData.slotDurationMinutes} mins`
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
