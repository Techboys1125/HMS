import React, { useState } from "react";
import {
  UserPlus,
  X,
  AlertTriangle,
  User,
  Upload,
  Stethoscope,
  DollarSign,
  Clock,
  CheckSquare,
  Lock,
  Shield,
  RefreshCw,
  Check,
  FileCheck,
} from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";

export interface AddDoctorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDoctor: DoctorRecord) => void;
  totalDoctorCount: number;
}

export function AddDoctorDrawer({
  isOpen,
  onClose,
  onSubmit,
  totalDoctorCount,
}: AddDoctorDrawerProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [dob, setDob] = useState("1985-05-14");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const autoEmpId = `EMP-${1040 + totalDoctorCount + 1}`;
  const [regNumber, setRegNumber] = useState(
    () => `MCI-REG-${Math.floor(100000 + Math.random() * 900000)}`,
  );
  const [qualification, setQualification] = useState("");
  const [experienceYrs, setExperienceYrs] = useState<number | "">(5);
  const [department, setDepartment] = useState("Cardiology");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");

  const [consultationFee, setConsultationFee] = useState<number | "">(150);
  const [followUpFee, setFollowUpFee] = useState<number | "">(80);
  const [slotDuration, setSlotDuration] = useState("15 Minutes");

  const [schedule, setSchedule] = useState([
    { day: "Monday", available: true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Tuesday", available: true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Wednesday", available: true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Thursday", available: true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Friday", available: true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Saturday", available: false, startTime: "09:00 AM", endTime: "01:00 PM" },
    { day: "Sunday", available: false, startTime: "09:00 AM", endTime: "01:00 PM" },
  ]);

  const [tempPassword, setTempPassword] = useState(
    () => `TempPass#${Math.floor(1000 + Math.random() * 9000)}`,
  );
  const [forcePassChange, setForcePassChange] = useState(true);
  const [sendCredentialsEmail, setSendCredentialsEmail] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const derivedUsername = email
    ? email.split("@")[0]
    : fullName
      ? fullName.toLowerCase().replace(/[^a-z0-9]/g, "")
      : "doctor.user";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleToggleScheduleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((s, idx) =>
        idx === index ? { ...s, available: !s.available } : s,
      ),
    );
  };

  const handleScheduleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setSchedule((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleRegeneratePassword = () => {
    setTempPassword(`TempPass#${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full Name is required.";
    if (!phone.trim()) errs.phone = "Phone number is required.";
    if (!email.trim() || !email.includes("@"))
      errs.email = "Valid email address is required.";
    if (!regNumber.trim())
      errs.regNumber = "Medical registration number is required.";
    if (!qualification.trim())
      errs.qualification = "Qualification is required.";
    if (experienceYrs === "" || Number(experienceYrs) < 0)
      errs.experienceYrs = "Years of experience is required.";
    if (!department) errs.department = "Department is required.";
    if (!specialty.trim()) errs.specialty = "Specialty is required.";
    if (consultationFee === "" || Number(consultationFee) <= 0)
      errs.consultationFee = "Consultation fee is required.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setAlertMsg(
        "Please fill in all mandatory fields highlighted in red before creating the doctor profile.",
      );
      return false;
    }
    setAlertMsg(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedName = fullName.startsWith("Dr.")
      ? fullName
      : `Dr. ${fullName}`;
    const activeWorkingDays = schedule
      .filter((s) => s.available)
      .map((s) => s.day.slice(0, 3));

    const newDoctor: DoctorRecord = {
      id: `DOC-10${totalDoctorCount + 1}`,
      empId: autoEmpId,
      regNumber: regNumber,
      name: formattedName,
      gender: gender,
      department: department,
      specialty: specialty,
      qualification: qualification,
      experienceYrs: Number(experienceYrs) || 5,
      consultationFee: Number(consultationFee) || 150,
      followUpFee: Number(followUpFee) || 80,
      slotDuration: slotDuration,
      availability: "Available Today",
      status: "Active",
      email: email,
      phone: phone,
      address: address,
      dob: dob,
      opdRoom: `OPD Room ${101 + totalDoctorCount}`,
      joinedDate: new Date().toISOString().split("T")[0],
      shiftTimings: "09:00 AM - 04:00 PM",
      workingDays:
        activeWorkingDays.length > 0
          ? activeWorkingDays
          : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      bio:
        bio ||
        `${formattedName} is a practitioner in ${department} specializing in ${specialty}.`,
    };

    onSubmit(newDoctor);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2
              className="text-base font-bold text-[#111827] flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <UserPlus size={18} className="text-[#0D47A1]" /> Add New Doctor
            </h2>
            <p
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Create a new doctor profile and system account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form
          id="add-doctor-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]/50"
          style={{ fontFamily: RB }}
        >
          {alertMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#EF4444] font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle size={16} className="shrink-0 text-[#EF4444]" />
              <span>{alertMsg}</span>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <User size={15} className="text-[#0D47A1]" /> Section 01: Personal
              Information
            </h3>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div
                className="w-16 h-16 rounded-2xl bg-teal-50 text-[#009688] font-bold text-xl flex items-center justify-center shrink-0 border border-teal-200 overflow-hidden"
                style={{ fontFamily: PP }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : fullName ? (
                  fullName
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                ) : (
                  "DR"
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#111827] block">
                  Doctor Photo Upload
                </span>
                <p className="text-[11px] text-[#64748B]">
                  JPEG or PNG, Max size 2MB. Reused in patient portal & OPD slips.
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 cursor-pointer transition-colors shadow-xs">
                  <Upload size={13} /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Arjun Mehta"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: "" });
                }}
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${
                  errors.fullName
                    ? "border-[#EF4444] bg-red-50/50"
                    : "border-[#E5E7EB] focus:border-[#0D47A1]"
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as "Male" | "Female" | "Other")
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${
                    errors.phone
                      ? "border-[#EF4444] bg-red-50/50"
                      : "border-[#E5E7EB] focus:border-[#0D47A1]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="arjun.mehta@citygeneral.org"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${
                    errors.email
                      ? "border-[#EF4444] bg-red-50/50"
                      : "border-[#E5E7EB] focus:border-[#0D47A1]"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Residential Address
              </label>
              <input
                type="text"
                placeholder="Street address, City, State, ZIP"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <Stethoscope size={15} className="text-[#009688]" /> Section 02:
              Professional Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Employee ID{" "}
                  <span className="text-slate-400 font-normal">(Auto Generated)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={autoEmpId}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#0D47A1] font-mono font-bold outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Medical Registration No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MCI-REG-847291"
                  value={regNumber}
                  onChange={(e) => {
                    setRegNumber(e.target.value);
                    if (errors.regNumber) setErrors({ ...errors, regNumber: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl font-mono text-[#111827] outline-none focus:bg-white transition-colors ${
                    errors.regNumber
                      ? "border-[#EF4444] bg-red-50/50"
                      : "border-[#E5E7EB] focus:border-[#0D47A1]"
                  }`}
                />
                {errors.regNumber && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                    {errors.regNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD, DM (Cardiology)"
                  value={qualification}
                  onChange={(e) => {
                    setQualification(e.target.value);
                    if (errors.qualification)
                      setErrors({ ...errors, qualification: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${
                    errors.qualification
                      ? "border-[#EF4444] bg-red-50/50"
                      : "border-[#E5E7EB] focus:border-[#0D47A1]"
                  }`}
                />
                {errors.qualification && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                    {errors.qualification}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="14"
                  value={experienceYrs}
                  onChange={(e) => {
                    setExperienceYrs(
                      e.target.value === "" ? "" : Number(e.target.value),
                    );
                    if (errors.experienceYrs)
                      setErrors({ ...errors, experienceYrs: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${
                    errors.experienceYrs
                      ? "border-[#EF4444] bg-red-50/50"
                      : "border-[#E5E7EB] focus:border-[#0D47A1]"
                  }`}
                />
                {errors.experienceYrs && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                    {errors.experienceYrs}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) setErrors({ ...errors, department: "" });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="ENT">ENT</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Interventional Cardiology"
                  value={specialty}
                  onChange={(e) => {
                    setSpecialty(e.target.value);
                    if (errors.specialty) setErrors({ ...errors, specialty: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] outline-none focus:bg-white transition-colors ${
                    errors.specialty
                      ? "border-[#EF4444] bg-red-50/50"
                      : "border-[#E5E7EB] focus:border-[#0D47A1]"
                  }`}
                />
                {errors.specialty && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                    {errors.specialty}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Professional Bio (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Summary of clinical background, sub-specialty interests, and key procedures..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <DollarSign size={15} className="text-[#F59E0B]" /> Section 03:
              Consultation Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Consultation Fee ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="150"
                  value={consultationFee}
                  onChange={(e) => {
                    setConsultationFee(
                      e.target.value === "" ? "" : Number(e.target.value),
                    );
                    if (errors.consultationFee)
                      setErrors({ ...errors, consultationFee: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl text-[#111827] font-bold outline-none focus:bg-white transition-colors ${
                    errors.consultationFee
                      ? "border-[#EF4444] bg-red-50/50"
                      : "border-[#E5E7EB] focus:border-[#0D47A1]"
                  }`}
                />
                {errors.consultationFee && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">
                    {errors.consultationFee}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Follow-up Fee ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="80"
                  value={followUpFee}
                  onChange={(e) =>
                    setFollowUpFee(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Appointment Slot Duration <span className="text-red-500">*</span>
              </label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white"
              >
                <option value="10 Minutes">10 Minutes</option>
                <option value="15 Minutes">15 Minutes</option>
                <option value="20 Minutes">20 Minutes</option>
                <option value="30 Minutes">30 Minutes</option>
                <option value="45 Minutes">45 Minutes</option>
                <option value="60 Minutes">60 Minutes</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-[#111827] block">
                Consultation Mode
              </span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D47A1]">
                <CheckSquare size={16} className="text-[#0D47A1]" />
                <span>In-Person OPD Consultations</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                All consultations conducted on-site in assigned OPD cabinet room.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <Clock size={15} className="text-[#009688]" /> Section 04:
              Availability Schedule
            </h3>

            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-[#E5E7EB]">
                  <tr className="text-[#64748B] font-bold" style={{ fontFamily: PP }}>
                    <th className="px-3.5 py-2.5">Day</th>
                    <th className="px-3.5 py-2.5">Available</th>
                    <th className="px-3.5 py-2.5">Start Time</th>
                    <th className="px-3.5 py-2.5">End Time</th>
                    <th className="px-3.5 py-2.5">Slot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#111827]">
                  {schedule.map((item, idx) => (
                    <tr key={item.day} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold">{item.day}</td>
                      <td className="px-3.5 py-2.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={() => handleToggleScheduleDay(idx)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#009688]" />
                        </label>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <select
                          disabled={!item.available}
                          value={item.startTime}
                          onChange={(e) =>
                            handleScheduleTimeChange(idx, "startTime", e.target.value)
                          }
                          className="bg-slate-50 border border-[#E5E7EB] px-2 py-1 rounded-lg outline-none font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="08:30 AM">08:30 AM</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="09:30 AM">09:30 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                        </select>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <select
                          disabled={!item.available}
                          value={item.endTime}
                          onChange={(e) =>
                            handleScheduleTimeChange(idx, "endTime", e.target.value)
                          }
                          className="bg-slate-50 border border-[#E5E7EB] px-2 py-1 rounded-lg outline-none font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                      </td>
                      <td className="px-3.5 py-2.5 font-semibold text-[#0D47A1]">
                        {slotDuration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <Lock size={15} className="text-[#0D47A1]" /> Section 05: Account & Access
            </h3>

            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#64748B] block font-semibold">
                  Assigned System Role (Read Only)
                </span>
                <span
                  className="font-bold text-[#111827] text-xs flex items-center gap-1.5 mt-0.5"
                  style={{ fontFamily: PP }}
                >
                  <Shield size={14} className="text-[#0D47A1]" /> Doctor
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <Lock size={12} /> Locked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  readOnly
                  value={derivedUsername}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-bold text-[#111827] mb-1">
                  Login Email
                </label>
                <input
                  type="text"
                  readOnly
                  value={email || "doctor.name@citygeneral.org"}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Temporary Password (Auto Generated)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={tempPassword}
                  className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#0D47A1] font-mono font-bold outline-none cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleRegeneratePassword}
                  className="px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={13} /> Regenerate
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forcePassChange}
                  onChange={(e) => setForcePassChange(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-semibold text-[#111827]">
                  Force password change on first login
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendCredentialsEmail}
                  onChange={(e) => setSendCredentialsEmail(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-medium text-slate-700">
                  Send login credentials via email (optional)
                </span>
              </label>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="submit"
            form="add-doctor-form"
            className="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-2 shadow-sm"
            style={{ fontFamily: PP }}
          >
            <UserPlus size={15} /> Create Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
