import { doctorsApi } from "../api/doctors.api";
import { usersApi } from "../../users/api/users.api";
import type { AdminUpdateStaffData } from "../../users/types/users.types";
import { appointmentService } from "../../appointments/services/appointment.service";
import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import type {
  DoctorRecord,
  DoctorAppointment,
  DoctorDailyAvailabilityData,
  ApiWeeklyScheduleData,
  ApiWeeklyScheduleDay,
  UpdateDoctorPayload,
} from "../types/doctors.types";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

export const toDoctorAppointment = (
  a: AppointmentRecord,
): DoctorAppointment => {
  const patient = a.patient;
  return {
    id: String(a.id ?? a.appointmentNumber ?? ""),
    appointmentNumber: a.appointmentNumber || String(a.id ?? ""),
    patientId: String(a.patientId ?? a.mrn ?? ""),
    patientName: a.patientName || patient?.fullName || "Unknown",
    gender: patient?.gender || a.patientGender || "N/A",
    age: Number(patient?.age ?? a.patientAge ?? 0),
    date: a.appointmentDate || "",
    time: a.startTime || "",
    type: a.visitType || a.appointmentType || "Consultation",
    status: a.status || "Scheduled",
    complaint: a.chiefComplaint || a.reason || "—",
  };
};

export const resolveDoctorId = (doc: DoctorRecord): number | string => {
  if (doc.doctorId && doc.doctorId !== 0) return doc.doctorId;
  if (doc.userId && doc.userId !== 0) return doc.userId;
  const cleaned = String(doc.id || "")
    .replace(/^DOC-/, "")
    .trim();
  if (cleaned && cleaned !== "0") return cleaned;
  return doc.id || "";
};

export const resolveUserId = (doc: DoctorRecord): number | string => {
  if (doc.userId && doc.userId !== 0) return doc.userId;
  if (doc.doctorId && doc.doctorId !== 0) return doc.doctorId;
  const cleaned = String(doc.id || "")
    .replace(/^DOC-/, "")
    .trim();
  if (cleaned && cleaned !== "0") return cleaned;
  return doc.id || "";
};

export const toUpdateDoctorPayload = (
  d: DoctorRecord,
): UpdateDoctorPayload => ({
  fullName: d.name.replace(/^Dr\.\s*/, ""),
  email: d.email,
  mobile: d.phone,
  gender: d.gender,
  dateOfBirth: d.dob || undefined,
  residentialAddress: d.address || undefined,
  professionalBio: d.bio || undefined,
  medicalRegistrationNumber: d.regNumber,
  qualification: d.qualification,
  yearsOfExperience: d.experienceYrs,
  primaryDepartmentId: d.primaryDepartmentId,
  primarySpecialtyId: d.primarySpecialtyId,
  consultationFee: d.consultationFee,
  followUpFee: d.followUpFee,
  slotDurationMinutes: d.slotDurationMinutes,
  availability: d.rawAvailability,
});

export const dayLabel = (dayOfWeek: string): string =>
  DAY_LABELS[String(dayOfWeek).toUpperCase()] || dayOfWeek || "—";

export const doctorProfileService = {
  async getDoctorProfile(userId: number | string): Promise<DoctorRecord> {
    return doctorsApi.getById(String(userId));
  },

  async getWeeklySchedule(
    doctorId: number | string,
  ): Promise<ApiWeeklyScheduleDay[]> {
    const data: ApiWeeklyScheduleData | null =
      await doctorsApi.getWeeklySchedule(doctorId);
    return data?.weeklySchedule || [];
  },

  async getDailyAvailability(
    doctorId: number | string,
    date: string,
  ): Promise<DoctorDailyAvailabilityData | null> {
    return doctorsApi.getDailyAvailability(doctorId, date);
  },

  async listAppointments(
    doctorId: number | string,
  ): Promise<DoctorAppointment[]> {
    const records = await appointmentService.listDoctorAppointments(doctorId);
    return records.map(toDoctorAppointment);
  },

  async updateDoctor(doc: DoctorRecord): Promise<DoctorRecord> {
    const userId = resolveUserId(doc);
    await usersApi.adminUpdateStaff(
      userId,
      toUpdateDoctorPayload(doc) as unknown as AdminUpdateStaffData,
    );
    return this.getDoctorProfile(userId);
  },
};
