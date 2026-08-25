import { useState, useRef } from "react";
import type { FormEvent } from "react";
import { X, Check, Lock, Loader2, Camera, Trash2 } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP } from "../constants/doctors.constants";
import UserAvatar from "../../../common/components/UserAvatar";
import { usersApi } from "../../users/api/users.api";

export interface EditDoctorProfileModalProps {
  isOpen: boolean;
  doctor: DoctorRecord;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST";
  onClose: () => void;
  onSave: (updatedDoctor: DoctorRecord) => Promise<void>;
}

const inputClass = (disabled: boolean) =>
  `w-full px-3 py-2 text-xs border rounded-xl outline-none transition-colors ${
    disabled
      ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
      : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#0D47A1]"
  }`;

export function EditDoctorProfileModal({
  isOpen,
  doctor,
  role,
  onClose,
  onSave,
}: EditDoctorProfileModalProps) {
  const [formData, setFormData] = useState<DoctorRecord>(doctor);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const isAdmin = role === "ADMIN";
  const isDoctor = role === "DOCTOR";

  const [prevDoctor, setPrevDoctor] = useState(doctor);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (doctor !== prevDoctor || isOpen !== prevIsOpen) {
    setPrevDoctor(doctor);
    setPrevIsOpen(isOpen);
    setFormData(doctor);
    setErrorMsg(null);
    setPhotoUploadError(null);
  }

  if (!isOpen) return null;

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
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
    setFormData((prev) => ({
      ...prev,
      photoUrl: "",
      photo: "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isFieldDisabled = (fieldName: keyof DoctorRecord) => {
    if (isAdmin) return false;
    if (isDoctor) {
      // Doctor can ONLY edit phone, email, address, bio, photo
      const editableFields: Array<keyof DoctorRecord> = [
        "phone",
        "email",
        "address",
        "bio",
        "photoUrl",
        "photo",
      ];
      return !editableFields.includes(fieldName);
    }
    return true; // Receptionist or other role is completely disabled
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5E7EB] flex flex-col max-h-[90vh] overflow-hidden transition-transform duration-150">
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-slate-50">
          <div>
            <h2
              className="text-base font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {isAdmin ? "Edit Doctor Information" : "Edit Personal Details"}
            </h2>
            <p className="text-xs text-[#64748B]">
              {isAdmin
                ? "Full administrative edit mode."
                : "You can update your profile photo, contact phone, email, residential address, and bio."}
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 text-xs"
        >
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Profile Photo Upload */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
            <UserAvatar
              name={formData.name || "Doctor"}
              size="lg"
              src={formData.photoUrl || formData.photo || undefined}
            />
            <div className="flex-1 min-w-0 space-y-1.5">
              <span className="block font-bold text-[#111827]">
                Profile Photo{" "}
                <span className="text-[#0D47A1] font-normal">(Editable)</span>
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
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={photoUploading}
                  onClick={() => photoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-[#CBD5E1] hover:border-[#0D47A1] text-[#0D47A1] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-60 shadow-xs"
                >
                  {photoUploading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Camera size={13} />
                  )}
                  {formData.photoUrl || formData.photo
                    ? "Change Photo"
                    : "Upload Photo"}
                </button>
                {(formData.photoUrl || formData.photo) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">
                JPG, PNG, WebP up to 5MB.
              </p>
              {photoUploadError && (
                <p className="text-xs text-red-600 font-medium">
                  {photoUploadError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#111827] mb-1 items-center gap-1">
                Full Name{" "}
                {isFieldDisabled("name") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                aria-label="Input field"
                type="text"
                disabled={isFieldDisabled("name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass(isFieldDisabled("name"))}
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] mb-1 flex items-center gap-1">
                Gender{" "}
                {isFieldDisabled("gender") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <select
                aria-label="Select option"
                disabled={isFieldDisabled("gender")}
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "Male" | "Female" | "Other",
                  })
                }
                className={inputClass(isFieldDisabled("gender"))}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <span className="block font-bold text-[#111827] mb-1">
                Contact Phone{" "}
                <span className="text-[#0D47A1] font-normal">(Editable)</span>
                <input
                  aria-label="Input field"
                  type="text"
                  disabled={isFieldDisabled("phone")}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={inputClass(isFieldDisabled("phone"))}
                />
              </span>
            </div>

            <div>
              <span className="block font-bold text-[#111827] mb-1">
                Email Address{" "}
                <span className="text-[#0D47A1] font-normal">(Editable)</span>
                <input
                  aria-label="Input field"
                  type="email"
                  disabled={isFieldDisabled("email")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputClass(isFieldDisabled("email"))}
                />
              </span>
            </div>

            <div>
              <label className="font-bold text-[#111827] mb-1 flex items-center gap-1">
                Employee ID{" "}
                {isFieldDisabled("empId") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                aria-label="Input field"
                type="text"
                disabled={isFieldDisabled("empId")}
                value={formData.empId}
                onChange={(e) =>
                  setFormData({ ...formData, empId: e.target.value })
                }
                className={inputClass(isFieldDisabled("empId"))}
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] mb-1 flex items-center gap-1">
                Medical Reg Number{" "}
                {isFieldDisabled("regNumber") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                aria-label="Input field"
                type="text"
                disabled={isFieldDisabled("regNumber")}
                value={formData.regNumber}
                onChange={(e) =>
                  setFormData({ ...formData, regNumber: e.target.value })
                }
                className={inputClass(isFieldDisabled("regNumber"))}
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] mb-1 flex items-center gap-1">
                Qualification{" "}
                {isFieldDisabled("qualification") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                aria-label="Input field"
                type="text"
                disabled={isFieldDisabled("qualification")}
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                className={inputClass(isFieldDisabled("qualification"))}
              />
            </div>

            <div>
              <label className="font-bold text-[#111827] mb-1 flex items-center gap-1">
                Experience Years{" "}
                {isFieldDisabled("experienceYrs") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                aria-label="Input field"
                type="number"
                min="0"
                disabled={isFieldDisabled("experienceYrs")}
                value={formData.experienceYrs}
                onChange={(e) => {
                  const v = e.currentTarget.valueAsNumber;
                  setFormData({
                    ...formData,
                    experienceYrs: Number.isFinite(v) ? v : 0,
                  });
                }}
                className={inputClass(isFieldDisabled("experienceYrs"))}
              />
            </div>

            <div>
              <label className="block font-bold text-[#111827] mb-1 items-center gap-1">
                Department{" "}
                {isFieldDisabled("department") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                aria-label="Input field"
                type="text"
                disabled={isFieldDisabled("department")}
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className={inputClass(isFieldDisabled("department"))}
              />
            </div>

            <div>
              <label className="block font-bold text-[#111827] mb-1 items-center gap-1">
                Specialty{" "}
                {isFieldDisabled("specialty") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                aria-label="Input field"
                type="text"
                disabled={isFieldDisabled("specialty")}
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className={inputClass(isFieldDisabled("specialty"))}
              />
            </div>
          </div>

          <div>
            <span className="block font-bold text-[#111827] mb-1">
              Residential Address{" "}
              <span className="text-[#0D47A1] font-normal">(Editable)</span>
              <input
                aria-label="Input field"
                type="text"
                disabled={isFieldDisabled("address")}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={inputClass(isFieldDisabled("address"))}
              />
            </span>
          </div>

          <div>
            <span className="block font-bold text-[#111827] mb-1">
              Professional Bio{" "}
              <span className="text-[#0D47A1] font-normal">(Editable)</span>
            </span>
            <textarea
              aria-label="Text input"
              rows={3}
              disabled={isFieldDisabled("bio")}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className={`${inputClass(isFieldDisabled("bio"))} resize-none`}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              style={{ fontFamily: PP }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
