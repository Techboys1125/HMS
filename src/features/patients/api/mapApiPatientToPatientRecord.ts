import type { Patient } from "../types/patient.types";

export function mapApiPatientToPatientRecord(
  p: Patient | Record<string, unknown>,
): Patient {
  const patient = p as Patient;

  return {
    ...patient,
    mrn:
      patient.mrn || `MRN-${String(patient.id ?? "000000").padStart(6, "0")}`,
    fullName:
      patient.fullName ||
      patient.name ||
      patient.patientName ||
      "Unknown Patient",
    name:
      patient.fullName ||
      patient.name ||
      patient.patientName ||
      "Unknown Patient",
    gender: patient.gender || "Unknown",
    phone: patient.phone || patient.mobileNumber || patient.mobile || "N/A",
    mobileNumber:
      patient.mobileNumber || patient.mobile || patient.phone || "N/A",
    dateOfBirth:
      patient.dateOfBirth ||
      patient.dob ||
      ((p as Record<string, unknown>).birthDate as string) ||
      ((p as Record<string, unknown>).date_of_birth as string) ||
      "",
    dob:
      patient.dateOfBirth ||
      patient.dob ||
      ((p as Record<string, unknown>).birthDate as string) ||
      ((p as Record<string, unknown>).date_of_birth as string) ||
      "",
    bloodGroup: patient.bloodGroup || patient.blood_type || "UNKNOWN",
    status: (patient.status as Patient["status"]) || "ACTIVE",
    age:
      patient.age && Number(patient.age) > 0
        ? Number(patient.age)
        : (p as Record<string, unknown>).patientAge &&
            Number((p as Record<string, unknown>).patientAge) > 0
          ? Number((p as Record<string, unknown>).patientAge)
          : calculateAge(
              patient.dateOfBirth ||
                patient.dob ||
                ((p as Record<string, unknown>).birthDate as string) ||
                ((p as Record<string, unknown>).date_of_birth as string),
            ),
    address:
      typeof patient.address === "string"
        ? patient.address
        : patient.address?.addressLine1 || patient.address?.street || "",
    emergencyContact: patient.emergencyContact
      ? {
          name:
            patient.emergencyContact.name ||
            patient.emergencyContact.contactName ||
            "",
          relationship: patient.emergencyContact.relationship || "",
          mobile:
            patient.emergencyContact.mobile ||
            patient.emergencyContact.contactNumber ||
            patient.emergencyContact.mobileNumber ||
            "N/A",
        }
      : undefined,
    email: patient.email || "",
    photoUrl: patient.photoUrl || patient.photo || "",
    maritalStatus: patient.maritalStatus || "",
    nationalId: patient.nationalId || "",
    patientCategory: patient.patientCategory || "",
    registrationType: patient.registrationType || "",
    knownAllergies: patient.knownAllergies || patient.allergies || [],
    chronicDiseases: patient.chronicDiseases || [],
    specialNotes: patient.specialNotes || "",
    assignedDoctor: extractDoctorName(p) || patient.assignedDoctor || "",
    registrationDate: patient.registrationDate || patient.createdAt || "",
    version: patient.version ?? 1,
    updatedAt: patient.updatedAt || "",
    updatedBy: patient.updatedBy
      ? {
          userId: patient.updatedBy.userId || "",
          employeeId: patient.updatedBy.employeeId || "",
          fullName: patient.updatedBy.fullName || "",
          role: patient.updatedBy.role || "",
        }
      : undefined,
  };
}

export function extractDoctorName(
  p: unknown,
  doctorMap?: Record<string | number, string>,
): string {
  if (!p || typeof p !== "object") return "";
  const obj = p as Record<string, unknown>;

  const checkString = (val: unknown): string => {
    if (!val) return "";
    if (
      typeof val === "string" &&
      isNaN(Number(val.trim())) &&
      val.trim().length > 1
    ) {
      return val.trim();
    }
    if (typeof val === "object") {
      const d = val as Record<string, unknown>;
      const name = String(
        d.fullName || d.name || d.doctorName || d.nameEn || "",
      ).trim();
      if (name) return name;
    }
    return "";
  };

  const directName =
    checkString(obj.assignedDoctor) ||
    checkString(obj.doctorName) ||
    checkString(obj.primaryDoctorName) ||
    checkString(obj.assignedDoctorName) ||
    checkString(obj.primaryDoctor) ||
    checkString(obj.attendingDoctor) ||
    checkString(obj.doctor);

  if (directName) return directName;

  const extractId = (val: unknown): string | number | null => {
    if (!val) return null;
    if (
      typeof val === "number" ||
      (typeof val === "string" && !isNaN(Number(val.trim())))
    ) {
      return val;
    }
    if (typeof val === "object") {
      const d = val as Record<string, unknown>;
      return (d.id || d.doctorId || d.userId || null) as string | number | null;
    }
    return null;
  };

  const id =
    extractId(obj.assignedDoctorId) ||
    extractId(obj.doctorId) ||
    extractId(obj.primaryDoctorId) ||
    extractId(obj.assignedDoctor) ||
    extractId(obj.doctor) ||
    extractId(obj.primaryDoctor);

  if (id != null && doctorMap) {
    const rawId = String(id);
    const cleanedId = rawId.replace(/^DOC-/, "");
    const resolvedName =
      doctorMap[id] ||
      doctorMap[rawId] ||
      doctorMap[cleanedId] ||
      doctorMap[Number(id)] ||
      doctorMap[Number(cleanedId)];
    if (resolvedName) return resolvedName;
  }

  return "";
}

function calculateAge(dob?: string): number {
  if (!dob) return 0;
  const trimmed = String(dob).trim();
  if (!trimmed) return 0;
  let birth: Date;
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/");
    if (parts.length === 3 && parts[2].length === 4) {
      birth = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0]),
      );
    } else {
      birth = new Date(trimmed);
    }
  } else {
    birth = new Date(trimmed);
  }
  if (Number.isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}
