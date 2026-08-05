import type {
  ApiUserDoctorRecord,
  DoctorRecord,
  CreateDoctorPayload,
  UpdateDoctorPayload,
  ApiDoctorProfile,
  ApiScheduleExceptionItem,
} from "../types/doctors.types";

export function mapApiUserToDoctorRecord(u: ApiUserDoctorRecord): DoctorRecord {
  const profile = u.doctorProfile;
  const primaryDept =
    profile?.primaryDepartment?.departmentName || "General Medicine";
  const primarySpec =
    profile?.primarySpecialty?.specialtyName || "General Physician";

  const rawAvail = profile?.availability || [];
  const workingDays = Array.from(
    new Set(rawAvail.map((a) => a.dayOfWeek.substring(0, 3).toUpperCase())),
  );

  let shiftTimings = "09:00 AM - 05:00 PM";
  if (rawAvail.length > 0 && rawAvail[0].startTime && rawAvail[0].endTime) {
    shiftTimings = `${rawAvail[0].startTime} - ${rawAvail[0].endTime}`;
  }

  const rawStatus = (u.status || "ACTIVE").toUpperCase();
  let status: "Active" | "Inactive" | "On Leave" | "Suspended" = "Active";
  if (rawStatus === "INACTIVE") status = "Inactive";
  else if (rawStatus === "ON_LEAVE" || rawStatus === "LEAVE")
    status = "On Leave";
  else if (rawStatus === "SUSPENDED") status = "Suspended";

  return {
    id: `DOC-${u.userId}`,
    userId: u.userId,
    doctorId: profile?.doctorId,
    empId: u.employeeId || `EMP-${u.userId}`,
    regNumber: profile?.medicalRegistrationNumber || "N/A",
    name: u.fullName.startsWith("Dr.") ? u.fullName : `Dr. ${u.fullName}`,
    gender: (u.gender as "Male" | "Female" | "Other") || "Male",
    department: primaryDept,
    primaryDepartmentId: profile?.primaryDepartment?.departmentId,
    specialty: primarySpec,
    primarySpecialtyId: profile?.primarySpecialty?.specialtyId,
    qualification: profile?.qualification || "MBBS",
    experienceYrs: profile?.yearsOfExperience || 5,
    consultationFee: profile?.consultationFee || 100,
    followUpFee: profile?.followUpFee || 50,
    slotDuration: profile?.slotDurationMinutes
      ? `${profile.slotDurationMinutes} mins`
      : "15 mins",
    slotDurationMinutes: profile?.slotDurationMinutes || 15,
    availability:
      status === "Inactive"
        ? "Out of Office"
        : status === "On Leave"
          ? "On Leave"
          : "Available Today",
    status,
    email: u.email,
    phone: u.mobile || "N/A",
    address: u.residentialAddress || "",
    dob: u.dateOfBirth || "",
    opdRoom: "OPD-101",
    joinedDate: "2024-01-15",
    shiftTimings,
    workingDays:
      workingDays.length > 0
        ? workingDays
        : ["MON", "TUE", "WED", "THU", "FRI"],
    bio: u.professionalBio || "",
    designation: (profile?.designation as string | undefined) || "",
    scheduleExceptions: profile?.scheduleExceptions || [],
    rawAvailability: rawAvail,
    secondarySpecialties:
      profile?.secondarySpecialties?.map((s) => s.specialtyName) || [],
    effectiveFrom:
      ((profile as unknown as Record<string, unknown> | undefined)
        ?.effectiveFrom as string | undefined) || "2024-01-01",
    effectiveTo: (profile as unknown as Record<string, unknown> | undefined)
      ?.effectiveTo as string | undefined,
    availabilityTemplate:
      ((profile as unknown as Record<string, unknown> | undefined)
        ?.availabilityTemplate as string | undefined) || "STANDARD_WEEKLY",
  };
}

export function mapDoctorRecordToCreatePayload(
  doc: Partial<DoctorRecord>,
): CreateDoctorPayload {
  return {
    fullName: (doc.name || "").replace(/^Dr\.\s*/, ""),
    email: doc.email || "",
    mobile: doc.phone === "N/A" ? "" : doc.phone || "",
    gender: doc.gender || "Male",
    dateOfBirth: doc.dob || undefined,
    residentialAddress: doc.address || undefined,
    professionalBio: doc.bio || undefined,
    role: "DOCTOR",
    medicalRegistrationNumber:
      doc.regNumber === "N/A" ? "" : doc.regNumber || "",
    qualification: doc.qualification || "MBBS",
    yearsOfExperience: doc.experienceYrs || 0,
    primaryDepartmentId: doc.primaryDepartmentId || 1,
    primarySpecialtyId: doc.primarySpecialtyId || 1,
    consultationFee: doc.consultationFee || 100,
    followUpFee: doc.followUpFee || 50,
    slotDurationMinutes: doc.slotDurationMinutes || 15,
    availability: doc.rawAvailability || [],
    scheduleExceptions: doc.scheduleExceptions || [],
  };
}

export function mapDoctorToUpdatePayload(
  doc: DoctorRecord,
): UpdateDoctorPayload {
  return {
    fullName: doc.name.replace(/^Dr\.\s*/, ""),
    email: doc.email,
    mobile: doc.phone === "N/A" ? "" : doc.phone,
    gender: doc.gender,
    dateOfBirth: doc.dob || undefined,
    residentialAddress: doc.address || undefined,
    professionalBio: doc.bio || undefined,
    medicalRegistrationNumber: doc.regNumber === "N/A" ? "" : doc.regNumber,
    qualification: doc.qualification,
    yearsOfExperience: doc.experienceYrs,
    primaryDepartmentId: doc.primaryDepartmentId,
    primarySpecialtyId: doc.primarySpecialtyId,
    consultationFee: doc.consultationFee,
    followUpFee: doc.followUpFee,
    slotDurationMinutes: doc.slotDurationMinutes,
    availability: doc.rawAvailability,
  };
}

export function mergeDoctorWithScheduleData(
  base: DoctorRecord,
  scheduleData: {
    weeklySchedule?: ApiDoctorProfile;
    exceptions?: ApiScheduleExceptionItem[];
    dailyAvailability?: DoctorRecord["rawAvailability"];
  },
): DoctorRecord {
  return {
    ...base,
    scheduleExceptions: scheduleData.exceptions ?? base.scheduleExceptions,
    rawAvailability: scheduleData.dailyAvailability ?? base.rawAvailability,
  };
}
