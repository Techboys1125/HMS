import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import type { Patient } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";

export interface ProfileTabProps {
  patient: Patient;
  isOwnProfile: boolean;
  canEdit: boolean;
  onSave?: (updated: Patient) => void;
}

export function PatientProfileTab({
  patient,
  isOwnProfile,
  canEdit,
  onSave,
}: ProfileTabProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Patient>(patient);
  const [saving, setSaving] = useState(false);

  const allowedFields = isOwnProfile
    ? (["phone", "address", "emergencyContact"] as const)
    : ([
        "phone",
        "address",
        "emergencyContact",
        "bloodGroup",
        "maritalStatus",
        "knownAllergies",
        "chronicDiseases",
        "specialNotes",
      ] as const);

  const isFieldEditable = (field: string) =>
    canEdit && allowedFields.includes(field as any);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) await onSave(formData);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = (editable: boolean) =>
    editable
      ? "bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#111827] outline-none focus:border-[#0D47A1]"
      : "bg-slate-50 border border-transparent rounded-lg px-3 py-2 text-xs text-[#111827]";

  const addressText = (addr: Patient["address"]): string => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    const a = addr as Record<string, string | undefined>;
    return [
      a.streetAddress || a.street || a.addressLine1 || "",
      a.city || "",
      a.state || "",
      a.pincode || a.postalCode || a.zipCode || "",
      a.country || "",
    ]
      .filter(Boolean)
      .join(", ");
  };

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
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Full Name
          </label>
          <div className={fieldStyle(false)}>{formData.fullName}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            MRN
          </label>
          <div className={fieldStyle(false)}>{formData.mrn}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Gender
          </label>
          <div className={fieldStyle(false)}>{formData.gender}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Date of Birth
          </label>
          <div className={fieldStyle(false)}>{formData.dob || "—"}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Age
          </label>
          <div className={fieldStyle(false)}>{formData.age} years</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Status
          </label>
          <div className={fieldStyle(false)}>{formData.status}</div>
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
              value={formData.phone || ""}
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
          <div className={fieldStyle(false)}>{formData.email || "—"}</div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-[#64748B] mb-1">
          <MapPin size={12} className="inline mr-1" />
          Address
        </label>
        {isFieldEditable("address") ? (
          <textarea
            rows={2}
            value={addressText(formData.address)}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className={fieldStyle(true)}
          />
        ) : (
          <div className={fieldStyle(false)}>
            {addressText(formData.address) || "—"}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Blood Group
          </label>
          <div className={fieldStyle(false)}>{formData.bloodGroup || "—"}</div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1">
            Marital Status
          </label>
          <div className={fieldStyle(false)}>
            {formData.maritalStatus || "—"}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-[#64748B] mb-1">
          Emergency Contact
        </label>
        {formData.emergencyContact ? (
          <div className={fieldStyle(false)}>
            <div className="font-medium">{formData.emergencyContact.name}</div>
            <div className="text-[11px] text-[#64748B]">
              {formData.emergencyContact.relationship} ·{" "}
              {formData.emergencyContact.mobile}
            </div>
          </div>
        ) : (
          <div className={fieldStyle(false)}>—</div>
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
              setFormData(patient);
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
