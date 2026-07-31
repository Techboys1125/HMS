import React, { useState, useEffect } from "react";
import {
  Edit,
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
  KeyRound,
  Check,
} from "lucide-react";
import type { DoctorRecord, DoctorStatus } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";
import { doctorsService } from "../services/doctors.service";
import { departmentsApi, type ApiDepartmentLookupItem } from "../../users/api/departments.api";

export interface EditDoctorDrawerProps {
  isOpen: boolean;
  doctor: DoctorRecord | null;
  onClose: () => void;
  onSave: (updatedDoctor: DoctorRecord) => void;
  onDeactivateClick?: (doctor: DoctorRecord) => void;
  onTriggerToast?: (msg: string) => void;
}

export function EditDoctorDrawer({
  isOpen,
  doctor,
  onClose,
  onSave,
  onDeactivateClick,
  onTriggerToast,
}: EditDoctorDrawerProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fullName, setFullName] = useState(doctor?.name || "");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">(
    doctor?.gender || "Male",
  );
  const [dob, setDob] = useState(doctor?.dob || "1985-05-14");
  const [phone, setPhone] = useState(doctor?.phone || "");
  const [email, setEmail] = useState(doctor?.email || "");
  const [address] = useState(doctor?.address || "");

  const [regNumber, setRegNumber] = useState(doctor?.regNumber || "");
  const [qualification, setQualification] = useState(
    doctor?.qualification || "",
  );
  const [experienceYrs, setExperienceYrs] = useState<number | "">(
    doctor?.experienceYrs || 0,
  );
  const [department, setDepartment] = useState(doctor?.department || "");
  const [specialty, setSpecialty] = useState(doctor?.specialty || "");
  const [bio, setBio] = useState(doctor?.bio || "");

  const [lookupList, setLookupList] = useState<ApiDepartmentLookupItem[]>([]);

  useEffect(() => {
    if (isOpen && doctor) {
      departmentsApi.getDepartmentLookup(true).then((list) => {
        setLookupList(list);
        if (doctor.department) {
          setDepartment(doctor.department);
          setSpecialty(doctor.specialty || "");
        } else if (list.length > 0) {
          const firstDept = list[0];
          setDepartment(firstDept.departmentName);
          if (firstDept.specialties && firstDept.specialties.length > 0) {
            setSpecialty(firstDept.specialties[0].name);
          } else {
            setSpecialty("");
          }
        }
      }).catch((err) => console.warn("Failed to load departments lookup:", err));
    }
  }, [isOpen, doctor]);

  const [consultationFee, setConsultationFee] = useState<number | "">(
    doctor?.consultationFee || 0,
  );
  const [followUpFee, setFollowUpFee] = useState<number | "">(
    doctor?.followUpFee || 80,
  );
  const [slotDuration, setSlotDuration] = useState(
    doctor?.slotDuration || "15 Minutes",
  );

  const [accountStatus, setAccountStatus] = useState<DoctorStatus>(
    doctor?.status || "Active",
  );
  const [forcePassChange, setForcePassChange] = useState(true);

  const [schedule, setSchedule] = useState([
    { day: "Monday", available: doctor?.workingDays.includes("Mon") ?? true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Tuesday", available: doctor?.workingDays.includes("Tue") ?? true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Wednesday", available: doctor?.workingDays.includes("Wed") ?? true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Thursday", available: doctor?.workingDays.includes("Thu") ?? true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Friday", available: doctor?.workingDays.includes("Fri") ?? true, startTime: "09:00 AM", endTime: "04:00 PM" },
    { day: "Saturday", available: doctor?.workingDays.includes("Sat") ?? false, startTime: "09:00 AM", endTime: "01:00 PM" },
    { day: "Sunday", available: doctor?.workingDays.includes("Sun") ?? false, startTime: "09:00 AM", endTime: "01:00 PM" },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  if (!isOpen || !doctor) return null;

  const derivedUsername = email
    ? email.split("@")[0]
    : fullName
      ? fullName.toLowerCase().replace(/[^a-z0-9]/g, "")
      : "doctor.user";

  const isFieldModified = (
    fieldName: keyof DoctorRecord,
    currentValue: unknown,
  ) => doctor ? doctor[fieldName] !== currentValue : false;

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

  const handleResetPasswordClick = () => {
    if (onTriggerToast) {
      onTriggerToast(
        `Password reset link & temporary credentials sent to ${email}`,
      );
    } else {
      alert(`Password reset link & temporary credentials sent to ${email}`);
    }
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
        "Please fill in all mandatory fields highlighted in red before saving changes.",
      );
      return false;
    }
    setAlertMsg(null);
    return true;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const activeWorkingDays = schedule
      .filter((s) => s.available)
      .map((s) => s.day.slice(0, 3));

    const activeAvailability = schedule
      .filter((s) => s.available)
      .map((s, idx) => ({
        availabilityId: idx + 1,
        dayOfWeek: s.day.toUpperCase(),
        startTime: s.startTime.includes("AM") || s.startTime.includes("PM")
          ? (s.startTime.includes("PM") && !s.startTime.startsWith("12")
              ? `${Number(s.startTime.split(":")[0]) + 12}:${s.startTime.split(":")[1].replace(" PM", "")}:00`
              : `${s.startTime.replace(" AM", "").replace(" PM", "")}:00`)
          : s.startTime,
        endTime: s.endTime.includes("AM") || s.endTime.includes("PM")
          ? (s.endTime.includes("PM") && !s.endTime.startsWith("12")
              ? `${Number(s.endTime.split(":")[0]) + 12}:${s.endTime.split(":")[1].replace(" PM", "")}:00`
              : `${s.endTime.replace(" AM", "").replace(" PM", "")}:00`)
          : s.endTime,
      }));

    const slotMins = parseInt(slotDuration) || 15;

    const selectedDeptObj = lookupList.find((d) => d.departmentName === department);
    const departmentSpecialties = selectedDeptObj ? selectedDeptObj.specialties : [];
    const specObj = departmentSpecialties.find((s) => s.name === specialty);

    const primaryDeptId = selectedDeptObj ? Number(selectedDeptObj.departmentId) : undefined;
    const primarySpecId = specObj ? Number(specObj.id) : undefined;

    const updatedDoctor: DoctorRecord = {
      ...doctor,
      name: fullName,
      gender,
      dob,
      phone,
      email,
      address,
      regNumber,
      qualification,
      experienceYrs: Number(experienceYrs) || doctor.experienceYrs,
      department,
      primaryDepartmentId: primaryDeptId,
      specialty,
      primarySpecialtyId: primarySpecId,
      bio,
      consultationFee: Number(consultationFee) || doctor.consultationFee,
      followUpFee: Number(followUpFee) || 80,
      slotDuration,
      status: accountStatus,
      workingDays: activeWorkingDays.length > 0 ? activeWorkingDays : doctor.workingDays,
    };

    try {
      const targetUserId = doctor.userId || doctor.id.replace("DOC-", "");
      await doctorsService.update(targetUserId, {
        fullName,
        email,
        mobile: phone,
        gender,
        dateOfBirth: dob,
        residentialAddress: address,
        professionalBio: bio,
        medicalRegistrationNumber: regNumber,
        qualification,
        yearsOfExperience: Number(experienceYrs) || 5,
        primaryDepartmentId: primaryDeptId,
        primarySpecialtyId: primarySpecId,
        consultationFee: Number(consultationFee) || 150,
        followUpFee: Number(followUpFee) || 80,
        slotDurationMinutes: slotMins,
        availability: activeAvailability,
        changeReason: "Admin updated doctor profile details.",
      });
      onSave(updatedDoctor);
    } catch (err) {
      console.warn("Failed to update doctor via API:", err);
      onSave(updatedDoctor);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDeptObj = lookupList.find((d) => d.departmentName === department);
  const departmentSpecialties = selectedDeptObj ? selectedDeptObj.specialties : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2
              className="text-base font-bold text-[#111827] flex items-center gap-2"
              style={{ fontFamily: PP }}
            >
              <Edit size={18} className="text-[#009688]" /> Edit Doctor —{" "}
              {doctor.id}
            </h2>
            <p
              className="text-xs text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              Update doctor information and availability.
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
          id="edit-doctor-form"
          onSubmit={handleSave}
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
              <User size={15} className="text-[#0D47A1]" /> Section 01: Personal Information
            </h3>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div
                className="w-16 h-16 rounded-2xl bg-[#0D47A1] text-white font-bold text-xl flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden"
                style={{ fontFamily: PP }}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  fullName
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#111827] block">Doctor Photo</span>
                <p className="text-[11px] text-[#64748B]">Update profile photo for patient directory.</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 cursor-pointer transition-colors shadow-xs">
                  <Upload size={13} /> Change Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                {isFieldModified("name", fullName) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: "" });
                }}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${
                  isFieldModified("name", fullName)
                    ? "border-[#009688] bg-teal-50/20"
                    : "bg-slate-50 border-[#E5E7EB]"
                } ${errors.fullName ? "border-[#EF4444] bg-red-50/50" : "focus:border-[#0D47A1] focus:bg-white"}`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("gender", gender) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Other")}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white ${
                    isFieldModified("gender", gender)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">Date of Birth</label>
                  {isFieldModified("dob", dob) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white ${
                    isFieldModified("dob", dob)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("phone", phone) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${
                    isFieldModified("phone", phone)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  } ${errors.phone ? "border-[#EF4444] bg-red-50/50" : "focus:border-[#0D47A1] focus:bg-white"}`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("email", email) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${
                    isFieldModified("email", email)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  } ${errors.email ? "border-[#EF4444] bg-red-50/50" : "focus:border-[#0D47A1] focus:bg-white"}`}
                />
                {errors.email && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              {/* <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">Residential Address</label>
                {isFieldModified("address", address) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div> */}
              {/* <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white ${
                  isFieldModified("address", address)
                    ? "border-[#009688] bg-teal-50/20"
                    : "bg-slate-50 border-[#E5E7EB]"
                }`}
              /> */}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <Stethoscope size={15} className="text-[#009688]" /> Section 02: Professional Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Employee ID <span className="text-slate-400 font-normal">(Read Only)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={doctor.empId}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#0D47A1] font-mono font-bold outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Medical Registration No. <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("regNumber", regNumber) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => {
                    setRegNumber(e.target.value);
                    if (errors.regNumber) setErrors({ ...errors, regNumber: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl font-mono text-[#111827] outline-none transition-colors ${
                    isFieldModified("regNumber", regNumber)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  } ${errors.regNumber ? "border-[#EF4444] bg-red-50/50" : "focus:border-[#0D47A1] focus:bg-white"}`}
                />
                {errors.regNumber && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.regNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Qualification <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("qualification", qualification) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => {
                    setQualification(e.target.value);
                    if (errors.qualification) setErrors({ ...errors, qualification: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${
                    isFieldModified("qualification", qualification)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  } ${errors.qualification ? "border-[#EF4444] bg-red-50/50" : "focus:border-[#0D47A1] focus:bg-white"}`}
                />
                {errors.qualification && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.qualification}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("experienceYrs", Number(experienceYrs)) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={experienceYrs}
                  onChange={(e) => {
                    setExperienceYrs(e.target.value === "" ? "" : Number(e.target.value));
                    if (errors.experienceYrs) setErrors({ ...errors, experienceYrs: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none transition-colors ${
                    isFieldModified("experienceYrs", Number(experienceYrs))
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  } ${errors.experienceYrs ? "border-[#EF4444] bg-red-50/50" : "focus:border-[#0D47A1] focus:bg-white"}`}
                />
                {errors.experienceYrs && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.experienceYrs}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Department <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("department", department) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <select
                  value={department}
                  onChange={(e) => {
                    const deptName = e.target.value;
                    setDepartment(deptName);
                    if (errors.department) setErrors({ ...errors, department: "" });
                    const deptObj = lookupList.find((d) => d.departmentName === deptName);
                    if (deptObj && deptObj.specialties && deptObj.specialties.length > 0) {
                      setSpecialty(deptObj.specialties[0].name);
                    } else {
                      setSpecialty("");
                    }
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white ${
                    isFieldModified("department", department)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  }`}
                >
                  {lookupList.length === 0 && (
                    <option value="">Loading departments...</option>
                  )}
                  {lookupList.map((d) => (
                    <option key={d.departmentId} value={d.departmentName}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Specialty <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("specialty", specialty) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <select
                  value={specialty}
                  onChange={(e) => {
                    setSpecialty(e.target.value);
                    if (errors.specialty) setErrors({ ...errors, specialty: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white ${
                    isFieldModified("specialty", specialty)
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  }`}
                >
                  {departmentSpecialties.length === 0 && (
                    <option value="">No specialties available</option>
                  )}
                  {departmentSpecialties.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.specialty && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.specialty}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">Professional Bio</label>
                {isFieldModified("bio", bio) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white resize-none ${
                  isFieldModified("bio", bio)
                    ? "border-[#009688] bg-teal-50/20"
                    : "bg-slate-50 border-[#E5E7EB]"
                }`}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <DollarSign size={15} className="text-[#F59E0B]" /> Section 03: Consultation Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">
                    Consultation Fee ($) <span className="text-red-500">*</span>
                  </label>
                  {isFieldModified("consultationFee", Number(consultationFee)) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={(e) => {
                    setConsultationFee(e.target.value === "" ? "" : Number(e.target.value));
                    if (errors.consultationFee) setErrors({ ...errors, consultationFee: "" });
                  }}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-bold outline-none transition-colors ${
                    isFieldModified("consultationFee", Number(consultationFee))
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  } ${errors.consultationFee ? "border-[#EF4444] bg-red-50/50" : "focus:border-[#0D47A1] focus:bg-white"}`}
                />
                {errors.consultationFee && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1">{errors.consultationFee}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#111827]">Follow-up Fee ($)</label>
                  {isFieldModified("followUpFee", Number(followUpFee)) && (
                    <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={followUpFee}
                  onChange={(e) => setFollowUpFee(e.target.value === "" ? "" : Number(e.target.value))}
                  className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white ${
                    isFieldModified("followUpFee", Number(followUpFee))
                      ? "border-[#009688] bg-teal-50/20"
                      : "bg-slate-50 border-[#E5E7EB]"
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">
                  Appointment Slot Duration <span className="text-red-500">*</span>
                </label>
                {isFieldModified("slotDuration", slotDuration) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-xl text-[#111827] font-semibold outline-none focus:border-[#0D47A1] focus:bg-white ${
                  isFieldModified("slotDuration", slotDuration)
                    ? "border-[#009688] bg-teal-50/20"
                    : "bg-slate-50 border-[#E5E7EB]"
                }`}
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
              <span className="text-xs font-bold text-[#111827] block">Consultation Mode</span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D47A1]">
                <CheckSquare size={16} className="text-[#0D47A1]" />
                <span>In-Person OPD Consultations</span>
              </div>
              <p className="text-[11px] text-[#64748B]">All consultations conducted on-site in assigned OPD cabinet room.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h3
              className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5"
              style={{ fontFamily: PP }}
            >
              <Clock size={15} className="text-[#009688]" /> Section 04: Availability Schedule
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
                          onChange={(e) => handleScheduleTimeChange(idx, "startTime", e.target.value)}
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
                          onChange={(e) => handleScheduleTimeChange(idx, "endTime", e.target.value)}
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
                      <td className="px-3.5 py-2.5 font-semibold text-[#0D47A1]">{slotDuration}</td>
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
                <span className="text-[11px] text-[#64748B] block font-semibold">Assigned System Role (Read Only)</span>
                <span className="font-bold text-[#111827] text-xs flex items-center gap-1.5 mt-0.5" style={{ fontFamily: PP }}>
                  <Shield size={14} className="text-[#0D47A1]" /> Doctor
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <Lock size={12} /> Locked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Username (Read Only)</label>
                <input
                  type="text"
                  readOnly
                  value={derivedUsername}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-bold text-[#111827] mb-1">Login Email (Read Only)</label>
                <input
                  type="text"
                  readOnly
                  value={email}
                  className="w-full px-3 py-2 bg-slate-100 border border-[#E5E7EB] rounded-xl text-[#111827] font-mono outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">Account Status</label>
                {isFieldModified("status", accountStatus) && (
                  <span className="text-[10px] font-bold text-[#009688] bg-teal-50 px-1.5 py-0.5 rounded">Modified</span>
                )}
              </div>
              <select
                value={accountStatus}
                onChange={(e) => setAccountStatus(e.target.value as DoctorStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] font-bold outline-none focus:border-[#0D47A1]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111827] block">Password & Credentials</span>
                  <span className="text-[11px] text-[#64748B]">Trigger password reset for doctor account</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetPasswordClick}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0D47A1] hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <KeyRound size={13} /> Reset Password
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-slate-200">
                <input
                  type="checkbox"
                  checked={forcePassChange}
                  onChange={(e) => setForcePassChange(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-medium text-xs text-[#111827]">Force password change on next login</span>
              </label>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          {onDeactivateClick ? (
            <button
              type="button"
              onClick={() => onDeactivateClick(doctor)}
              className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-[#EF4444] text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-xs"
              style={{ fontFamily: PP }}
            >
              <AlertTriangle size={14} /> Deactivate Doctor
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-doctor-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-[#00796b] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: PP }}
            >
              <Check size={15} />
              <span>{isSubmitting ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
