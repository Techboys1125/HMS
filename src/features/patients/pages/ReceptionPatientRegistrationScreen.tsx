import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  UserPlus,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCreatePatient } from "../hooks/useCreatePatient";
import type { CreatePatientRequest } from "../types/patient.types";
import { PP, RB } from "../constants/patient.mock";

export function ReceptionPatientRegistrationScreen({
  onBack,
  onBookAppointment,
  onViewProfile,
}: {
  onBack: () => void;
  onBookAppointment?: (mrn: string) => void;
  onViewProfile?: (mrn: string) => void;
}) {
  // Form State
  const [formData, setFormData] = useState({
    // Essential (Required)
    relationship: "SELF",
    fullName: "",
    gender: "",
    dob: "",
    age: "",
    phone: "",
    email: "",
    bloodGroup: "",
    address: "",

    // Personal (Optional)
    maritalStatus: "",
    aadhaar: "",
    patientCategory: "",
    photo: null as string | null,

    // Other (Optional)
    emergencyName: "",
    emergencyMobile: "",
    altContact: "",
    allergies: "",
    chronicDiseases: "",
    specialNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedMrn, setGeneratedMrn] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDobChange = (dobValue: string) => {
    let calculatedAge = "";
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age >= 0 ? age.toString() : "";
    }
    setFormData((prev) => ({ ...prev, dob: dobValue, age: calculatedAge }));
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: "" }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile Number is required";
    } else if (
      !/^\+?[0-9]{10,14}$/.test(formData.phone.replace(/[\s-]/g, ""))
    ) {
      newErrors.phone = "Enter a valid mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPatient = useCreatePatient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload: CreatePatientRequest = {
      relationship: formData.relationship.trim() || "SELF",
      fullName: formData.fullName.trim(),
      gender: formData.gender.toUpperCase() as any,
      dateOfBirth: formData.dob,
      bloodGroup: formData.bloodGroup || "UNKNOWN",
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim() ? { value: formData.address.trim() } : undefined,
    };
    // Only include bloodGroup if user selected one (empty string crashes backend enum parsing)
    if (formData.bloodGroup) {
      (payload as any).bloodGroup = formData.bloodGroup;
    }

    try {
      const created = await createPatient.mutateAsync(payload);
      setGeneratedMrn(created.MRNId || "Unknown");
      setShowSuccessDialog(true);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        submit: err?.message || "Patient registration failed.",
      }));
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9] relative flex flex-col min-h-screen pb-24"
      style={{ fontFamily: RB }}
    >
      {/* TOP HEADER */}
      <div className="max-w-4xl w-full mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white border border-[#E5E7EB] shadow-sm rounded-xl flex items-center justify-center text-slate-600 hover:text-[#0D47A1] hover:border-blue-200 transition-colors"
            title="Go Back"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div
              className="flex items-center gap-2 text-xs text-[#64748B] mb-0.5"
              style={{ fontFamily: RB }}
            >
              <span
                className="hover:text-[#0D47A1] cursor-pointer transition-colors"
                onClick={onBack}
              >
                Patient Management
              </span>
              <ChevronRight size={12} />
              <span className="font-semibold text-[#0D47A1]">
                Patient Registration
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Register New Patient
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto space-y-6">
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 mt-0.5" />
            <div className="text-sm text-red-800">{errors.submit}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* SECTION 1: ESSENTIAL INFORMATION (REQUIRED) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3
                className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <UserPlus size={18} className="text-[#0D47A1]" /> Essential
                Information
              </h3>
              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-bold uppercase tracking-wide">
                Primary / Required
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm">
              <div className="md:col-span-2 flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#0D47A1] group-hover:bg-blue-50">
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt="Patient"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        size={30}
                        className="text-slate-400 group-hover:text-[#0D47A1]"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">
                    Patient Photo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload a clear facial photo (Optional)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => handleChange("relationship", e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                >
                  <option value="SELF">Self</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="CHILD">Child</option>
                  <option value="PARENT">Parent</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-slate-800 outline-none transition-all ${errors.fullName ? "border-red-400 focus:ring-2 focus:ring-red-50" : "border-gray-200 focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50"}`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-slate-800 outline-none transition-all ${errors.gender ? "border-red-400 focus:ring-2 focus:ring-red-50" : "border-gray-200 focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50"}`}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.gender}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Age
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-slate-800 outline-none font-mono"
                    />
                    <span className="text-xs text-slate-500 font-semibold">
                      YRS
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-slate-800 outline-none transition-all ${errors.phone ? "border-red-400 focus:ring-2 focus:ring-red-50" : "border-gray-200 focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50"}`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => handleChange("bloodGroup", e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                >
                  <option value="">Select Group</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter complete residential address..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONAL INFORMATION (OPTIONAL) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3
                className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                Personal Information
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-wide">
                Optional
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Marital Status
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) =>
                    handleChange("maritalStatus", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                >
                  <option value="">Select</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Aadhaar / National ID
                </label>
                <input
                  type="text"
                  value={formData.aadhaar}
                  onChange={(e) => handleChange("aadhaar", e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Patient Category
                </label>
                <select
                  value={formData.patientCategory}
                  onChange={(e) =>
                    handleChange("patientCategory", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="GENERAL">General</option>
                  <option value="VIP">VIP</option>
                  <option value="CORPORATE">Corporate</option>
                  <option value="STAFF">Staff / Dependent</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: OTHER INFORMATION (OPTIONAL) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3
                className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                Other Information
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-wide">
                Optional
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) =>
                    handleChange("emergencyName", e.target.value)
                  }
                  placeholder="Contact Person Name"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Emergency Mobile
                </label>
                <input
                  type="tel"
                  value={formData.emergencyMobile}
                  onChange={(e) =>
                    handleChange("emergencyMobile", e.target.value)
                  }
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Known Allergies
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts (or type 'None')"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chronic Diseases
                </label>
                <input
                  type="text"
                  value={formData.chronicDiseases}
                  onChange={(e) =>
                    handleChange("chronicDiseases", e.target.value)
                  }
                  placeholder="e.g. Diabetes, Hypertension (or type 'None')"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Special Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  value={formData.specialNotes}
                  onChange={(e) => handleChange("specialNotes", e.target.value)}
                  placeholder="Any other important information..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-800 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 shadow-lg z-30 flex items-center justify-end gap-3 px-8">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
          style={{ fontFamily: PP }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-all shadow-md flex items-center gap-2"
          style={{ fontFamily: PP }}
        >
          <UserPlus size={16} /> Register Patient & Generate MRN
        </button>
      </div>

      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-green-50 text-[#66BB6A] flex items-center justify-center mb-1">
                <CheckCircle2 size={36} />
              </div>
              <h3
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Patient Registered Successfully
              </h3>
              <p className="text-xs text-[#64748B]">
                New patient master record created in HMS.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E7EB] space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[#64748B]">Generated MRN</span>
                <span className="font-mono text-base font-bold text-[#0D47A1]">
                  {generatedMrn}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Patient Name</span>
                <span className="font-bold text-[#111827]">
                  {formData.fullName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Registration Date</span>
                <span className="font-mono text-[#111827]">2026-07-27</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Status</span>
                <span className="font-bold text-[#66BB6A]">
                  Active Master Profile
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  if (onBookAppointment) onBookAppointment(generatedMrn);
                  else onBack();
                }}
                className="w-full py-2.5 rounded-xl bg-[#009688] text-white text-xs font-semibold hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: PP }}
              >
                <Calendar size={15} /> Book Appointment Now
              </button>
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  if (onViewProfile) onViewProfile(generatedMrn);
                  else onBack();
                }}
                className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-all"
                style={{ fontFamily: PP }}
              >
                View Patient Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
