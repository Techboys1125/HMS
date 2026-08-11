import { useState } from "react";
import type { FormEvent } from "react";
import { X, Check, Lock, Loader2 } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP } from "../constants/doctors.constants";

export interface EditDoctorProfileModalProps {
  isOpen: boolean;
  doctor: DoctorRecord;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST";
  onClose: () => void;
  onSave: (updatedDoctor: DoctorRecord) => Promise<void>;
}

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

  const isAdmin = role === "ADMIN";
  const isDoctor = role === "DOCTOR";

  const [prevDoctor, setPrevDoctor] = useState(doctor);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (doctor !== prevDoctor || isOpen !== prevIsOpen) {
    setPrevDoctor(doctor);
    setPrevIsOpen(isOpen);
    setFormData(doctor);
    setErrorMsg(null);
  }

  if (!isOpen) return null;

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
      // Doctor can ONLY edit phone, email, address, bio
      const editableFields: Array<keyof DoctorRecord> = [
        "phone",
        "email",
        "address",
        "bio",
      ];
      return !editableFields.includes(fieldName);
    }
    return true; // Receptionist or other role is completely disabled
  };

  const inputClass = (disabled: boolean) =>
    `w-full px-3 py-2 text-xs border rounded-xl outline-none transition-colors ${
      disabled
        ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
        : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#0D47A1]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5E7EB] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
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
                : "You can update your contact phone, email, residential address, and bio."}
            </p>
          </div>
          <button
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Full Name{" "}
                {isFieldDisabled("name") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
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
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Gender{" "}
                {isFieldDisabled("gender") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <select
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
              <label className="block font-bold text-[#111827] mb-1">
                Contact Phone{" "}
                <span className="text-[#0D47A1] font-normal">(Editable)</span>
              </label>
              <input
                type="text"
                disabled={isFieldDisabled("phone")}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={inputClass(isFieldDisabled("phone"))}
              />
            </div>

            <div>
              <label className="block font-bold text-[#111827] mb-1">
                Email Address{" "}
                <span className="text-[#0D47A1] font-normal">(Editable)</span>
              </label>
              <input
                type="email"
                disabled={isFieldDisabled("email")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={inputClass(isFieldDisabled("email"))}
              />
            </div>

            <div>
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Employee ID{" "}
                {isFieldDisabled("empId") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
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
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Medical Reg Number{" "}
                {isFieldDisabled("regNumber") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
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
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Qualification{" "}
                {isFieldDisabled("qualification") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
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
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Experience Years{" "}
                {isFieldDisabled("experienceYrs") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
                type="number"
                min="0"
                disabled={isFieldDisabled("experienceYrs")}
                value={formData.experienceYrs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experienceYrs: Number(e.target.value),
                  })
                }
                className={inputClass(isFieldDisabled("experienceYrs"))}
              />
            </div>

            <div>
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Department{" "}
                {isFieldDisabled("department") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
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
              <label className="block font-bold text-[#111827] mb-1 flex items-center gap-1">
                Specialty{" "}
                {isFieldDisabled("specialty") && (
                  <Lock size={11} className="text-slate-400" />
                )}
              </label>
              <input
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
            <label className="block font-bold text-[#111827] mb-1">
              Residential Address{" "}
              <span className="text-[#0D47A1] font-normal">(Editable)</span>
            </label>
            <input
              type="text"
              disabled={isFieldDisabled("address")}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={inputClass(isFieldDisabled("address"))}
            />
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">
              Professional Bio{" "}
              <span className="text-[#0D47A1] font-normal">(Editable)</span>
            </label>
            <textarea
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
              className="px-5 py-2 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-blue-800 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
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
