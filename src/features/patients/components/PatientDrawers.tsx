import { useState } from "react";
import {
  Download,
  Eye,
  Edit,
  Receipt,
  X,
  Phone,
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Printer,
  CheckCircle2,
  Save,
  Info,
} from "lucide-react";
import { PP, RB } from "../constants/patient.mock";
import { Avatar } from "./Avatar";
import { type ScreenPatient } from "../types/patient.types";
import { StatusBadge } from "./StatusBadges";
export function EditPatientInformationDrawer({
  isOpen,
  onClose,
  patient,
  onSaveSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  patient?: ScreenPatient | null;
  onSaveSuccess?: (updatedPatient: ScreenPatient) => void;
}) {
  const [formData, setFormData] = useState({
    firstName: patient?.name ? patient.name.split(" ")[0] : "Sarah",
    lastName: patient?.name
      ? patient.name.split(" ").slice(1).join(" ")
      : "Mitchell",
    dob: "1990-05-14",
    gender: (patient?.gender === "M"
      ? "Male"
      : patient?.gender === "F"
        ? "Female"
        : "Other") as "Male" | "Female" | "Other",
    bloodGroup: "O+",
    phone: patient?.mobile || "+1 (555) 234-5678",
    email: "sarah.mitchell@example.com",
    address: "123 Healthcare Ave, NY 10001",
    emergencyName: patient?.emergencyContact?.name || "David Mitchell",
    emergencyNumber: patient?.emergencyContact?.phone || "+1 (555) 345-6789",
    relationship: patient?.emergencyContact?.relationship || "Spouse",
    patientCategory: "General" as
      "General" | "Senior Citizen" | "Corporate" | "VIP" | "Emergency",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const updatedPt: ScreenPatient = {
      id: patient?.id || "PT-2024-001",
      name: fullName,
      age: patient?.age || 34,
      gender:
        formData.gender === "Female"
          ? "F"
          : formData.gender === "Male"
            ? "M"
            : "Other",
      mobile: formData.phone,
      doctor: patient?.doctor || "Dr. A. Mehta",
      department: patient?.department || "Cardiology",
      visitType: patient?.visitType || "OPD",
      regDate: patient?.regDate || "2024-03-12",
      status: patient?.status || "Active",
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.relationship,
        phone: formData.emergencyNumber,
      },
      lastVisit: patient?.lastVisit,
    };

    setSuccessMessage(
      `Patient demographic info for ${fullName} updated successfully!`,
    );
    setTimeout(() => {
      setSuccessMessage(null);
      if (onSaveSuccess) onSaveSuccess(updatedPt);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Edit size={18} className="text-blue-100" />
              </div>
              <div>
                <h2
                  className="text-base font-bold leading-tight"
                  style={{ fontFamily: PP }}
                >
                  Edit Patient Information
                </h2>
                <p className="text-xs text-blue-200" style={{ fontFamily: RB }}>
                  MRN: {patient?.id || "PT-2024-001"} • Demographic &amp;
                  Contact Update
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/40"
            style={{ fontFamily: RB }}
          >
            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="text-[#66BB6A] shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Read-only Notice */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-[#0D47A1] flex items-start gap-2.5">
              <Info size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">
                  Demographic Update Boundary
                </span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Allows editing demographic &amp; emergency details ONLY.
                  Clinical records, consultations, prescriptions, and vitals are
                  locked.
                </span>
              </div>
            </div>

            {/* Demographic Fields */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3
                className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                style={{ fontFamily: PP }}
              >
                Demographic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "Male" | "Female" | "Other",
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>
            </div>

            {/* Emergency Contact & Category */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3
                className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                style={{ fontFamily: PP }}
              >
                Emergency Contact &amp; Category
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData({ ...formData, relationship: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Patient Category
                  </label>
                  <select
                    value={formData.patientCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientCategory: e.target.value as
                          | "General"
                          | "Senior Citizen"
                          | "Corporate"
                          | "VIP"
                          | "Emergency",
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="General">General</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Corporate">Corporate</option>
                    <option value="VIP">VIP</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#E5E7EB] bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-xl bg-[#0D47A1] text-white font-bold text-xs hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function RegisterPatientDrawer({
  isOpen,
  onClose,
  onSaveSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male" as "Male" | "Female" | "Other",
    bloodGroup: "O+",
    phone: "",
    email: "",
    address: "",
    emergencyName: "",
    emergencyNumber: "",
    relationship: "Spouse",
    patientCategory: "General" as
      "General" | "Senior Citizen" | "Corporate" | "VIP" | "Emergency",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    setSuccessMessage(`Patient ${fullName} registered successfully!`);
    setTimeout(() => {
      setSuccessMessage(null);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-50 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: PP }}>
                Register New Patient
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Enter demographics for registration</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in-95">
                <CheckCircle2 size={16} className="text-[#66BB6A] shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Demographics */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                Demographics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" | "Other" })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider" style={{ fontFamily: PP }}>
                Emergency Contact &amp; Category
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyNumber}
                    onChange={(e) => setFormData({ ...formData, emergencyNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ fontFamily: PP }}
              >
                <Save size={15} /> Save Patient
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ProfileBookApptDrawer({
  isOpen,
  onClose,
  patientName,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onSuccess: (msg: string) => void;
}) {
  const [doctor, setDoctor] = useState("Dr. A. Mehta");
  const [date, setDate] = useState("2024-03-15");
  const [slot, setSlot] = useState("10:30 AM");
  const [type, setType] = useState("OPD Consultation");

  if (!isOpen) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(
      `Appointment booked with ${doctor} for ${patientName} on ${date} at ${slot}`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>
                Book Appointment Drawer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
          <form
            onSubmit={handleBook}
            className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs"
            style={{ fontFamily: RB }}
          >
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Patient
                </label>
                <input
                  type="text"
                  value={patientName}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-slate-600 font-semibold"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Assigned Doctor
                </label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]"
                >
                  <option>Dr. A. Mehta (Cardiology)</option>
                  <option>Dr. P. Sharma (General Medicine)</option>
                  <option>Dr. S. Patel (Gynecology)</option>
                  <option>Dr. R. Kapoor (Neurology)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]"
                  >
                    <option>09:30 AM</option>
                    <option>10:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:15 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Visit Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1]"
                >
                  <option>OPD Consultation</option>
                  <option>Follow-up Visit</option>
                  <option>Routine Checkup</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-2.5 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-[#0c3d8a] shadow-sm"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ProfileApptDetailsDrawer({
  appt,
  onClose,
  onAction,
}: {
  appt: {
    id?: string;
    status?: string;
    doctor?: string;
    department?: string;
    date?: string;
    time?: string;
    type?: string;
    notes?: string;
  } | null;
  onClose: () => void;
  onAction: (msg: string) => void;
}) {
  if (!appt) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>
                Appointment Details Drawer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
          <div
            className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs"
            style={{ fontFamily: RB }}
          >
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {appt.id}
                </span>
                <StatusBadge status={appt.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Doctor
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    {appt.doctor}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Department
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    {appt.department}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Date &amp; Time
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    {appt.date} • {appt.time}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Visit Type
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    {appt.type}
                  </span>
                </div>
              </div>
              {appt.notes && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-slate-400 block text-[11px] mb-1">
                    Clinical Notes
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-gray-100">
                    {appt.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onAction(
                    `Reschedule request initiated for appointment ${appt.id}`,
                  );
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-[#0D47A1] text-[#0D47A1] bg-blue-50/50 hover:bg-blue-50 font-semibold"
              >
                Reschedule Appointment
              </button>
              <button
                onClick={() => {
                  onAction(`Appointment ${appt.id} has been cancelled.`);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 font-semibold"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileInvoiceDrawer({
  invoice,
  onClose,
  onPay,
}: {
  invoice:
    | (Record<string, unknown> & {
        id?: string;
        date?: string;
        status?: string;
        description?: string;
        amount?: number;
      })
    | null;
  onClose: () => void;
  onPay: (msg: string) => void;
}) {
  if (!invoice) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Receipt size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>
                Invoice Drawer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
          <div
            className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs"
            style={{ fontFamily: RB }}
          >
            <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0D47A1]">
                    {invoice.id}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Issued: {invoice.date}
                  </span>
                </div>
                <StatusBadge status={invoice.status} />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 block text-[11px] font-medium uppercase tracking-wider">
                  Itemized Line Items
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#111827]">
                      {invoice.description}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Consultation &amp; Diagnostics Intake
                    </div>
                  </div>
                  <span className="font-bold text-[#111827] text-sm">
                    ${(invoice.amount ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-[#111827]">
                <span>Total Amount Due</span>
                <span className="text-red-600">
                  ${(invoice.amount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              {invoice.status !== "Paid" && (
                <button
                  onClick={() => {
                    onPay(
                      `Payment of $${(invoice.amount ?? 0).toFixed(2)} for ${invoice.id} processed successfully!`,
                    );
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-[#66BB6A] hover:bg-green-600 text-white font-bold shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  Pay Invoice Now
                </button>
              )}
              <button
                onClick={() => {
                  onPay(`Downloading Invoice ${invoice.id}.pdf...`);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
              >
                Download PDF Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileDocDrawer({
  doc,
  onClose,
  onDownload,
}: {
  doc:
    | (Record<string, unknown> & {
        title?: string;
        category?: string;
        date?: string;
        size?: string;
        doctor?: string;
      })
    | null;
  onClose: () => void;
  onDownload: (msg: string) => void;
}) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="text-blue-100" />
              <h2 className="text-base font-bold" style={{ fontFamily: PP }}>
                Document Preview Drawer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
          <div
            className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F1F5F9]/30 text-xs"
            style={{ fontFamily: RB }}
          >
            <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold shrink-0">
                  PDF
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">
                    {doc.title}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {doc.category} • {doc.date}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>File Size:</span>
                  <span className="font-semibold text-[#111827]">
                    {doc.size || "1.2 MB"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Issuing Doctor / Staff:</span>
                  <span className="font-semibold text-[#111827]">
                    {doc.doctor || "Dr. A. Mehta"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Security Status:</span>
                  <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    Verified Record
                  </span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-gray-200 text-center text-slate-500 py-8">
                <FileText size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="font-medium text-xs">Document Preview Ready</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Official electronic healthcare document copy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onDownload(`Downloading ${doc.title}...`);
                  onClose();
                }}
                className="flex-[2] py-2.5 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-[#0c3d8a] shadow-sm flex items-center justify-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileVisitDetailsDrawer({
  visit,
  onClose,
  onPrint,
}: {
  visit: {
    id?: string;
    date?: string;
    time?: string;
    doctor?: string;
    department?: string;
    chiefComplaint?: string;
    diagnosis?: string;
    treatmentSummary?: string;
    rxStatus?: string;
    billingStatus?: string;
  } | null;
  onClose: () => void;
  onPrint: (msg: string) => void;
}) {
  if (!visit) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Stethoscope size={18} className="text-blue-100" />
              <div>
                <h2
                  className="text-base font-bold leading-tight"
                  style={{ fontFamily: PP }}
                >
                  Visit Summary Details
                </h2>
                <span className="text-[11px] text-blue-100 font-mono">
                  {visit.id}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="flex-1 p-6 space-y-5 overflow-y-auto bg-[#F1F5F9]/30 text-xs"
            style={{ fontFamily: RB }}
          >
            {/* Visit & Doctor Info */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3
                className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider"
                style={{ fontFamily: PP }}
              >
                Visit &amp; Doctor Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Visit Date &amp; Time
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    {visit.date} • {visit.time || "09:45 AM"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Attending Doctor
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    {visit.doctor}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Department / Clinic
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    {visit.department} (OPD Wing A)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Visit Type
                  </span>
                  <span className="font-semibold text-[#111827] mt-0.5 block">
                    OPD Consultation
                  </span>
                </div>
              </div>
            </div>

            {/* Symptoms & Diagnosis */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3
                className="text-xs font-bold text-[#009688] uppercase tracking-wider"
                style={{ fontFamily: PP }}
              >
                Symptoms &amp; Diagnosis
              </h3>
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">
                  Chief Complaints / Symptoms
                </span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                  {visit.chiefComplaint ||
                    "Patient presented with headache and elevated blood pressure readings."}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <span className="text-slate-400 block text-[11px] mb-1">
                  Clinical Diagnosis
                </span>
                <span className="font-bold text-[#111827] text-sm block">
                  {visit.diagnosis}
                </span>
              </div>
            </div>

            {/* Treatment Notes & Prescriptions */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3
                className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                style={{ fontFamily: PP }}
              >
                Treatment &amp; Prescription Summary
              </h3>
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">
                  Treatment Notes
                </span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                  {visit.treatmentSummary}
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Prescription Status
                </span>
                <span className="px-2.5 py-0.5 rounded-md font-semibold text-green-700 bg-green-50 border border-green-100 text-[11px]">
                  {visit.rxStatus || "Issued (Rx-2024-089)"}
                </span>
              </div>
            </div>

            {/* Billing Summary & Documents */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
              <h3
                className="text-xs font-bold text-amber-700 uppercase tracking-wider"
                style={{ fontFamily: PP }}
              >
                Billing &amp; Visit Documents
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Billing Invoice
                  </span>
                  <span className="font-semibold text-[#111827]">
                    Invoice #INV-10245 ($125.00)
                  </span>
                </div>
                <StatusBadge status={visit.billingStatus || "Paid"} />
              </div>
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <span className="text-slate-400 block text-[11px]">
                  Associated Documents
                </span>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-gray-100 text-[#0D47A1] font-semibold">
                  <FileText size={14} /> Consultation_Summary_{visit.id}.pdf
                  (1.4 MB)
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onPrint(`Printing Visit Summary for ${visit.id}...`);
                }}
                className="flex-[2] py-2.5 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-[#0c3d8a] shadow-sm flex items-center justify-center gap-1.5"
                style={{ fontFamily: PP }}
              >
                <Printer size={15} /> Print Visit Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PatientQuickDetailsDrawer({
  patient,
  onClose,
  onPatientSelect,
  onEdit,
}: {
  patient: ScreenPatient | null;
  onClose: () => void;
  onPatientSelect: (id: string) => void;
  onEdit?: () => void;
  onViewTimeline?: () => void;
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!patient) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-4 bg-[#0D47A1] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar name={patient.name} size="md" />
              <div>
                <h2
                  className="text-base font-bold leading-tight"
                  style={{ fontFamily: PP }}
                >
                  {patient.name}
                </h2>
                <div
                  className="flex items-center gap-2 text-xs text-blue-200 mt-0.5"
                  style={{ fontFamily: RB }}
                >
                  <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">
                    {patient.id}
                  </span>
                  <span>
                    • {patient.age} Y /{" "}
                    {patient.gender === "F" ? "Female" : "Male"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body - Scrollable */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F1F5F9]/50"
            style={{ fontFamily: RB }}
          >
            {/* Toast feedback */}
            {toastMsg && (
              <div className="bg-[#111827] text-white text-xs px-3.5 py-2.5 rounded-xl shadow flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#66BB6A]" />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Section 1: Patient Summary */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                  style={{ fontFamily: PP }}
                >
                  Patient Summary
                </span>
                <StatusBadge status={patient.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Mobile Phone
                  </span>
                  <span className="font-semibold text-[#111827] flex items-center gap-1 mt-0.5">
                    <Phone size={12} className="text-slate-400" />{" "}
                    {patient.mobile}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Registration Date
                  </span>
                  <span className="font-medium text-slate-700 mt-0.5 block">
                    {patient.regDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Emergency Contact
                  </span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    +1 (555) 987-6543
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Latest Appointment */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={14} className="text-[#0D47A1]" /> Latest
                  Appointment
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  OPD Slot
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#111827]">
                    March 12, 2024 • 10:30 AM
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {patient.department} • Follow-up Consultation
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                  Completed
                </span>
              </div>
            </div>

            {/* Section 3: Assigned Doctor */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Stethoscope size={14} className="text-[#009688]" /> Assigned
                  Doctor
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#009688] flex items-center justify-center font-bold text-sm shrink-0">
                  Dr
                </div>
                <div className="text-xs flex-1">
                  <div className="font-bold text-[#111827]">
                    {patient.doctor}
                  </div>
                  <div className="text-slate-500">
                    Senior Consultant • {patient.department} Wing
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Ext. 4082 • dr.mehta@hospital.org
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Outstanding Bills */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Receipt size={14} className="text-red-500" /> Outstanding
                  Bills
                </span>
                <span className="text-xs font-bold text-red-600">$125.00</span>
              </div>

              <div className="flex items-center justify-between text-xs bg-red-50/50 p-2.5 rounded-xl border border-red-100">
                <div>
                  <div className="font-semibold text-slate-800">
                    OPD Consultation & ECG Fee
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Inv #INV-10245 • Mar 12, 2024
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  Due in 5d
                </span>
              </div>
            </div>

            {/* Section 5: Recent Prescription */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
                  style={{ fontFamily: PP }}
                >
                  <Pill size={14} className="text-purple-600" /> Recent
                  Prescription
                </span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Rx-2024-089
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-between font-medium text-slate-700">
                  <span>Amlodipine 5mg</span>
                  <span className="text-[11px] text-slate-500">
                    1 Tab OD (Morning)
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-between font-medium text-slate-700">
                  <span>Atorvastatin 20mg</span>
                  <span className="text-[11px] text-slate-500">
                    1 Tab HS (Night)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="p-4 bg-white border-t border-gray-100 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  if (onEdit) onEdit();
                  triggerToast(`Opening edit form for ${patient.name}`);
                }}
                className="py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Edit size={13} className="text-slate-500" /> Edit
              </button>
              <button
                onClick={() =>
                  triggerToast(
                    `Appointment booking initiated for ${patient.name}`,
                  )
                }
                className="py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Calendar size={13} className="text-[#0D47A1]" /> Book Appt
              </button>
              <button
                onClick={() =>
                  triggerToast(`Generating bill invoice for ${patient.name}`)
                }
                className="py-2 px-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Receipt size={13} className="text-amber-600" /> Gen Bill
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                style={{ fontFamily: PP }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onPatientSelect(patient.id);
                }}
                className="flex-[2] py-2.5 px-4 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center justify-center gap-2 shadow-sm"
                style={{ fontFamily: PP }}
              >
                <Eye size={15} /> View Full Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
