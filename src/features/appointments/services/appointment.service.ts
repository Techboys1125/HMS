import { appointmentsApi } from "../api/appointments.api";
import type {
  AppointmentRecord,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  LinkedPatient,
  UserRole,
} from "../types/appointment.types";

export interface AppointmentPage<T> {
  content?: T[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

const STATUS_MAP: Record<string, AppointmentRecord["status"]> = {
  BOOKED: "Scheduled",
  CONFIRMED: "Scheduled",
  CHECKED_IN: "Checked-In",
  IN_CONSULTATION: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "Cancelled",
  RESCHEDULED: "Scheduled",
  WAITING: "Waiting",
  CALLED: "Checked-In",
  SCHEDULED: "Scheduled",
};

const toDisplayStatus = (status?: string): AppointmentRecord["status"] =>
  STATUS_MAP[String(status || "").toUpperCase()] ||
  (status as AppointmentRecord["status"]) ||
  "Scheduled";

export const normalizeAppointmentRecord = (item: any): AppointmentRecord => {
  const patient = item?.patient || {};
  const doctor = item?.doctor || {};
  const appointmentDate = item?.appointmentDate || item?.date || "";
  const startTime =
    item?.startTime || item?.timeSlot || item?.appointmentTime || "";

  return {
    id: item?.id ?? item?.appointmentId ?? item?.appointmentNumber ?? "",
    appointmentNumber:
      item?.appointmentNumber || item?.queueToken || String(item?.id ?? ""),
    queueToken: item?.queueToken || item?.tokenNo,
    patientId: item?.patientId ?? patient?.id ?? "",
    patientName: item?.patientName || patient?.fullName || patient?.name || "",
    patientMrn: item?.patientMrn || patient?.mrn || item?.mrn,
    doctorId: item?.doctorId ?? doctor?.id ?? "",
    doctorName: item?.doctorName || doctor?.name || "",
    appointmentDate,
    startTime,
    endTime: item?.endTime,
    status: toDisplayStatus(item?.status),
    queueStatus: item?.queueStatus || item?.arrivalStatus,
    appointmentType: item?.appointmentType,
    reason: item?.reason || item?.chiefComplaint,
    symptoms: item?.symptoms,
    departmentId: item?.departmentId,
    departmentName: item?.departmentName || item?.department?.name,
    patient: patient,
    doctor: doctor,
    cancellationReason: item?.cancellationReason,
    rescheduleReason: item?.rescheduleReason,
    vitalsRecorded: item?.vitalsRecorded,
    paymentStatus: item?.paymentStatus,
    priority: item?.priority,
    arrivalStatus: item?.arrivalStatus,
    opdRoom: item?.opdRoom || doctor?.opdRoom,
    waitingTimeMinutes: item?.waitingTimeMinutes,
    isWalkIn: item?.isWalkIn,
    createdDate: item?.createdDate || item?.createdAt,
    mrn: item?.mrn || patient?.mrn,
    patientAge: item?.patientAge,
    patientGender: item?.patientGender,
    patientPhone: item?.patientPhone || patient?.phone || patient?.mobile,
    department:
      item?.department || item?.departmentName || doctor?.departmentName,
    doctorSpecialty: item?.doctorSpecialty || doctor?.specialty,
    tokenNo: item?.tokenNo || item?.queueToken,
    timeSlot: item?.timeSlot || startTime,
    visitType: item?.visitType || item?.appointmentType,
    chiefComplaint: item?.chiefComplaint || item?.reason,
    notes: item?.notes,
  };
};

const unwrapAppointmentCollection = (response: any): any[] => {
  if (Array.isArray(response?.data)) return response.data;

  if (Array.isArray(response?.content)) return response.content;

  if (Array.isArray(response?.data?.content)) return response.data.content;

  if (Array.isArray(response?.data?.data?.content))
    return response.data.data.content;

  return [];
};

export const appointmentService = {
  async listAppointments(params?: {
    doctorId?: string | number;
    patientId?: string | number;
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<AppointmentRecord[]> {
    const res = await appointmentsApi.getAppointments(params);
    const items = unwrapAppointmentCollection(res);
    return items.map(normalizeAppointmentRecord);
  },

  async listDoctorAppointments(
    date?: string,
    status?: string,
  ): Promise<AppointmentRecord[]> {
    const res = await appointmentsApi.getDoctorAppointments(date);
    const items = unwrapAppointmentCollection(res);
    return items
      .filter((item) =>
        !status
          ? true
          : String(item?.status || "").toUpperCase() === status.toUpperCase(),
      )
      .map(normalizeAppointmentRecord);
  },

  async listPatientAppointments(
    patientId: string | number,
  ): Promise<AppointmentRecord[]> {
    const res = await appointmentsApi.getPatientAppointments(patientId);
    const items = unwrapAppointmentCollection(res);
    return items.map(normalizeAppointmentRecord);
  },

  async getAppointment(
    appointmentId: string | number,
  ): Promise<AppointmentRecord | null> {
    const res = await appointmentsApi.getAppointmentById(appointmentId);
    return res?.data ? normalizeAppointmentRecord(res.data) : null;
  },

  async bookAppointment(
    payload: CreateAppointmentRequest,
  ): Promise<AppointmentRecord> {
    const res = await appointmentsApi.createAppointment(payload);
    if (!res?.data) {
      throw new Error("Appointment booking did not return a record.");
    }
    return normalizeAppointmentRecord(res.data);
  },

  async rescheduleAppointment(
    appointmentId: string | number,
    payload: RescheduleAppointmentRequest,
  ): Promise<AppointmentRecord> {
    const res = await appointmentsApi.rescheduleAppointment(
      appointmentId,
      payload,
    );
    if (!res?.data) {
      throw new Error("Appointment reschedule did not return a record.");
    }
    return normalizeAppointmentRecord(res.data);
  },

  async cancelAppointment(
    appointmentId: string | number,
    payload: CancelAppointmentRequest,
  ): Promise<AppointmentRecord> {
    const res = await appointmentsApi.cancelAppointment(appointmentId, payload);
    if (!res?.data) {
      throw new Error("Appointment cancellation did not return a record.");
    }
    return normalizeAppointmentRecord(res.data);
  },

  async receptionCheckIn(appointmentId: string | number) {
    return appointmentsApi.receptionCheckIn(appointmentId);
  },

  async queueCallNext(doctorId?: string | number) {
    return appointmentsApi.queueCallNext(doctorId);
  },

  async doctorStartConsultation(appointmentId: string | number) {
    return appointmentsApi.doctorStartConsultation(appointmentId);
  },

  async doctorCompleteConsultation(appointmentId: string | number) {
    return appointmentsApi.doctorCompleteConsultation(appointmentId);
  },

  async listLinkedPatients(): Promise<LinkedPatient[]> {
    const res = await appointmentsApi.getLinkedPatients();
    return Array.isArray(res?.data) ? res.data : [];
  },

  async listDoctors(departmentId?: string | number): Promise<any[]> {
    const res = await appointmentsApi.getDoctors(departmentId);
    return Array.isArray(res?.data) ? res.data : [];
  },

  async listAvailableSlots(
    doctorId: string | number,
    date: string,
  ): Promise<any[]> {
    const res = await appointmentsApi.getAvailableSlots(doctorId, date);
    return Array.isArray(res?.data) ? res.data : [];
  },
};

export type AppointmentService = typeof appointmentService;

export const isUserRole = (role?: string | null): role is UserRole =>
  Boolean(role) &&
  [
    "Receptionist",
    "Admin",
    "Hospital Admin",
    "Super Admin",
    "Doctor",
    "Nurse",
    "Patient",
  ].includes(role as UserRole);
