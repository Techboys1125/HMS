import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Stethoscope,
  Hash,
  Tag,
} from "lucide-react";
import type { DoctorRecord } from "../../types/doctors.types";
import { PP } from "../../constants/doctors.constants";

export interface ProfileTabProps {
  doctor: DoctorRecord;
  isOwnProfile: boolean;
  canEdit: boolean;
  onSave?: (updated: DoctorRecord) => void;
}

export function ProfileTab({
  doctor,
  isOwnProfile,
  canEdit,
  onSave,
}: ProfileTabProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<DoctorRecord>(doctor);
  const [saving, setSaving] = useState(false);

  const allowedFields = isOwnProfile
    ? (["phone", "email", "bio"] as const)
    : ([
        "phone",
        "email",
        "qualification",
        "consultationFee",
        "experienceYrs",
        "department",
        "specialty",
        "bio",
      ] as const);

  const isFieldEditable = (field: string) =>
    canEdit && allowedFields.includes(field as any);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      setEditing(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = (editable: boolean) =>
    editable
      ? "bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] outline-none focus:border-[#0D47A1]"
      : "bg-slate-50 border border-transparent rounded-lg px-3 py-2 text-xs text-[#111827]";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Personal Information
        </h3>
        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Full Name
          </label>
          <div className={fieldStyle(false)}>{formData.name}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Employee ID
          </label>
          <div className={fieldStyle(false)}>{formData.empId}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Registration Number
          </label>
          <div className={fieldStyle(false)}>{formData.regNumber}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Doctor ID
          </label>
          <div className={fieldStyle(false)}>{formData.id}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            <Phone size={12} className="inline mr-1" />
            Phone
          </label>
          {isFieldEditable("phone") ? (
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={fieldStyle(true)}
            />
          ) : (
            <div className={fieldStyle(false)}>{formData.phone}</div>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            <Mail size={12} className="inline mr-1" />
            Email
          </label>
          {isFieldEditable("email") ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={fieldStyle(true)}
            />
          ) : (
            <div className={fieldStyle(false)}>{formData.email}</div>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            <GraduationCap size={12} className="inline mr-1" />
            Qualification
          </label>
          {isFieldEditable("qualification") ? (
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) =>
                setFormData({ ...formData, qualification: e.target.value })
              }
              className={fieldStyle(true)}
            />
          ) : (
            <div className={fieldStyle(false)}>{formData.qualification}</div>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            <Stethoscope size={12} className="inline mr-1" />
            Experience
          </label>
          {isFieldEditable("experienceYrs") ? (
            <input
              type="number"
              min="0"
              value={formData.experienceYrs}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experienceYrs: Number(e.target.value),
                })
              }
              className={fieldStyle(true)}
            />
          ) : (
            <div className={fieldStyle(false)}>
              {formData.experienceYrs} years
            </div>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            <Tag size={12} className="inline mr-1" />
            Department
          </label>
          {isFieldEditable("department") ? (
            <input
              type="text"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className={fieldStyle(true)}
            />
          ) : (
            <div className={fieldStyle(false)}>{formData.department}</div>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            <Hash size={12} className="inline mr-1" />
            Specialty
          </label>
          {isFieldEditable("specialty") ? (
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
              className={fieldStyle(true)}
            />
          ) : (
            <div className={fieldStyle(false)}>{formData.specialty}</div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-[#64748B] mb-1">
          <MapPin size={12} className="inline mr-1" />
          Address
        </label>
        <div className={fieldStyle(false)}>{formData.address || "—"}</div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-[#64748B] mb-1">
          Bio
        </label>
        {isFieldEditable("bio") ? (
          <textarea
            rows={3}
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className={fieldStyle(true)}
          />
        ) : (
          <div className={fieldStyle(false)}>{formData.bio || "—"}</div>
        )}
      </div>

      {editing && (
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(doctor);
              setEditing(false);
            }}
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
