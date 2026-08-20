import type {
  ApiUserDoctorRecord,
  DoctorRecord,
  CreateDoctorPayload,
  UpdateDoctorPayload,
  ApiDoctorProfile,
  ApiScheduleExceptionItem,
  ApiSpecialtyRef,
} from "../types/doctors.types";

export function mapApiUserToDoctorRecord(u: ApiUserDoctorRecord): DoctorRecord {
  const anyU = u as ApiUserDoctorRecord & Record<string, unknown>;
  const profile = u.doctorProfile || anyU.profile || anyU.doctor || u;
  const anyProfile = profile as Record<string, unknown>;

  const primaryDept =
    profile?.primaryDepartment?.departmentName ||
    anyProfile?.primaryDepartmentName ||
    anyProfile?.departmentName ||
    anyProfile?.department ||
    anyU.departmentName ||
    anyU.department ||
    anyU.primaryDepartmentName ||
    anyU.primaryDepartment?.departmentName ||
    anyU.deptName ||
    anyU.dept ||
    "";

  const primarySpec =
    profile?.primarySpecialty?.specialtyName ||
    anyProfile?.primarySpecialtyName ||
    anyProfile?.specialtyName ||
    anyProfile?.specialty ||
    anyU.specialtyName ||
    anyU.specialty ||
    anyU.primarySpecialtyName ||
    anyU.primarySpecialty?.specialtyName ||
    anyU.specName ||
    "";

  const qualification =
    profile?.qualification ||
    anyProfile?.qualification ||
    anyU.qualification ||
    "";

  const experienceYrs =
    profile?.yearsOfExperience ??
    anyProfile?.yearsOfExperience ??
    anyProfile?.experienceYrs ??
    anyProfile?.experienceYears ??
    anyProfile?.experience ??
    anyU.yearsOfExperience ??
    anyU.experienceYrs ??
    anyU.experienceYears ??
    anyU.experience ??
    0;

  const regNumber =
    profile?.medicalRegistrationNumber ||
    anyProfile?.medicalRegistrationNumber ||
    anyProfile?.regNumber ||
    anyU.medicalRegistrationNumber ||
    anyU.regNumber ||
    "";

  const empId =
    u.employeeId ||
    anyU.empId ||
    anyProfile?.employeeId ||
    anyProfile?.empId ||
    "";

  const consultationFee =
    profile?.consultationFee ??
    anyProfile?.consultationFee ??
    anyProfile?.fees?.standardConsultationFee ??
    anyU.consultationFee ??
    anyU.fees?.standardConsultationFee ??
    0;

  const followUpFee =
    profile?.followUpFee ?? anyProfile?.followUpFee ?? anyU.followUpFee ?? 0;

  const slotDurationMinutes =
    profile?.slotDurationMinutes ??
    anyProfile?.slotDurationMinutes ??
    anyU.slotDurationMinutes ??
    15;

  const slotDuration = slotDurationMinutes
    ? `${slotDurationMinutes} mins`
    : "15 mins";

  const rawAvail =
    profile?.availability ||
    anyProfile?.availability ||
    anyU.availability ||
    [];
  const workingDays = Array.from(
    new Set(
      rawAvail.map((a: ApiAvailabilityItem) =>
        String(a.dayOfWeek || "")
          .substring(0, 3)
          .toUpperCase(),
      ),
    ),
  ).filter(Boolean);

  let shiftTimings = "";
  if (rawAvail.length > 0 && rawAvail[0].startTime && rawAvail[0].endTime) {
    shiftTimings = `${rawAvail[0].startTime} - ${rawAvail[0].endTime}`;
  }

  const rawStatus = String(
    u.status || anyProfile?.status || "ACTIVE",
  ).toUpperCase();
  let status: "Active" | "Inactive" | "On Leave" | "Suspended" = "Active";
  if (rawStatus === "INACTIVE") status = "Inactive";
  else if (rawStatus === "ON_LEAVE" || rawStatus === "LEAVE")
    status = "On Leave";
  else if (rawStatus === "SUSPENDED") status = "Suspended";

  const rawDoctorId =
    profile?.doctorId ?? anyProfile?.doctorId ?? anyU.doctorId ?? 0;
  const hasExplicitDoctorId = Number.isFinite(rawDoctorId) && rawDoctorId > 0;
  const rawUserId = hasExplicitDoctorId
    ? (u.userId ?? anyProfile?.userId ?? 0)
    : (u.userId ?? u.id ?? anyProfile?.userId ?? anyProfile?.id ?? 0);
  const finalDoctorId = hasExplicitDoctorId ? rawDoctorId : rawUserId;

  return {
    fullName: u.fullName || u.name || anyProfile?.name || "",
    id: `DOC-${finalDoctorId || rawUserId}`,
    userId: Number(rawUserId),
    doctorId: Number(finalDoctorId),
    empId,
    regNumber,
    name: (u.fullName || u.name || anyProfile?.name || "").startsWith("Dr.")
      ? u.fullName || u.name || anyProfile?.name || ""
      : `Dr. ${u.fullName || u.name || anyProfile?.name || "Doctor"}`,
    gender:
      ((u.gender || anyProfile?.gender) as "Male" | "Female" | "Other") ||
      "Male",
    department: primaryDept,
    primaryDepartmentId:
      profile?.primaryDepartment?.departmentId ??
      anyProfile?.departmentId ??
      anyU.departmentId,
    specialty: primarySpec,
    primarySpecialtyId:
      profile?.primarySpecialty?.specialtyId ??
      anyProfile?.specialtyId ??
      anyU.specialtyId,
    qualification,
    experienceYrs: Number(experienceYrs),
    consultationFee: Number(consultationFee),
    followUpFee: Number(followUpFee),
    slotDuration,
    slotDurationMinutes: Number(slotDurationMinutes),
    availability:
      status === "Inactive"
        ? "Out of Office"
        : status === "On Leave"
          ? "On Leave"
          : "Available Today",
    status,
    email: u.email || anyProfile?.email || "",
    phone:
      u.mobile ||
      u.phoneNumber ||
      u.phone ||
      anyProfile?.phone ||
      anyProfile?.mobile ||
      "",
    address:
      u.residentialAddress ||
      anyProfile?.address ||
      anyProfile?.residentialAddress ||
      "",
    dob: u.dateOfBirth || anyProfile?.dateOfBirth || anyProfile?.dob || "",
    opdRoom: anyProfile?.opdRoom || anyU.opdRoom || "",
    joinedDate: anyProfile?.joinedDate || anyU.joinedDate || "",
    shiftTimings,
    workingDays: workingDays.length > 0 ? (workingDays as string[]) : [],
    bio:
      u.professionalBio || anyProfile?.bio || anyProfile?.professionalBio || "",
    designation:
      (profile?.designation as string) || anyProfile?.designation || "",
    scheduleExceptions:
      profile?.scheduleExceptions || anyProfile?.scheduleExceptions || [],
    rawAvailability: rawAvail,
    secondarySpecialties:
      profile?.secondarySpecialties?.map(
        (s: ApiSpecialtyRef) => s.specialtyName,
      ) || [],
    effectiveFrom: anyProfile?.effectiveFrom,
    effectiveTo: anyProfile?.effectiveTo,
    availabilityTemplate: anyProfile?.availabilityTemplate,
  };
}

export function mapDoctorRecordToCreatePayload(
  doc: Partial<DoctorRecord>,
): CreateDoctorPayload {
  return {
    fullName: (doc.name || "").replace(/^Dr\.\s*/, ""),
    email: doc.email || "",
    mobile: doc.phone || "",
    gender: doc.gender || "Male",
    dateOfBirth: doc.dob || undefined,
    residentialAddress: doc.address || undefined,
    professionalBio: doc.bio || undefined,
    role: "DOCTOR",
    medicalRegistrationNumber: doc.regNumber || "",
    qualification: doc.qualification || "",
    yearsOfExperience: doc.experienceYrs || 0,
    primaryDepartmentId: doc.primaryDepartmentId || 1,
    primarySpecialtyId: doc.primarySpecialtyId || 1,
    consultationFee: doc.consultationFee || 0,
    followUpFee: doc.followUpFee || 0,
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
    mobile: doc.phone,
    gender: doc.gender,
    dateOfBirth: doc.dob || undefined,
    residentialAddress: doc.address || undefined,
    professionalBio: doc.bio || undefined,
    medicalRegistrationNumber: doc.regNumber,
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
