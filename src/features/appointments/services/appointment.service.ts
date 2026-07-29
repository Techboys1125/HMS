import { appointmentsApi } from "../api/appointments.api";
import type {
  AppointmentRecord,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  LinkedPatient,
  UserRole,
  DoctorSummary,
  PatientSummary,
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

export const normalizeAppointmentRecord = (
  item: Record<string, unknown> | null | undefined,
): AppointmentRecord => {
  const patient = (item?.patient as Record<string, unknown>) || {};
  const doctor = (item?.doctor as Record<string, unknown>) || {};
  const appointmentDate = (item?.appointmentDate || item?.date || "") as string;
  const startTime = (item?.startTime ||
    item?.timeSlot ||
    item?.appointmentTime ||
    "") as string;

  return {
    id: (item?.id ?? item?.appointmentId ?? item?.appointmentNumber ?? "") as
      string | number,
    appointmentNumber: (item?.appointmentNumber ||
      item?.queueToken ||
      String(item?.id ?? "")) as string,
    queueToken: (item?.queueToken || item?.tokenNo) as string | undefined,
    patientId: (item?.patientId ?? patient?.id ?? "") as string | number,
    patientName: (item?.patientName ||
      patient?.fullName ||
      patient?.name ||
      "") as string,
    patientMrn: (item?.patientMrn || patient?.mrn || item?.mrn) as
      string | undefined,
    doctorId: (item?.doctorId ?? doctor?.id ?? "") as string | number,
    doctorName: (item?.doctorName || doctor?.name || "") as string,
    appointmentDate,
    startTime,
    endTime: item?.endTime as string | undefined,
    status: toDisplayStatus(item?.status as string | undefined),
    queueStatus: (item?.queueStatus || item?.arrivalStatus) as
      string | undefined,
    appointmentType: item?.appointmentType as string | undefined,
    reason: (item?.reason || item?.chiefComplaint) as string | undefined,
    symptoms: item?.symptoms as string | undefined,
    departmentId:
      typeof item?.departmentId === "number" ? item.departmentId : undefined,
    departmentName: (item?.departmentName ||
      (item?.department as Record<string, unknown>)?.name) as
      string | undefined,
    patient: patient as unknown as PatientSummary,
    doctor: doctor as unknown as DoctorSummary,
    cancellationReason: item?.cancellationReason as string | undefined,
    rescheduleReason: item?.rescheduleReason as string | undefined,
    vitalsRecorded: item?.vitalsRecorded as boolean | undefined,
    paymentStatus: item?.paymentStatus as
      "PAID" | "UNPAID" | "PARTIAL" | "PENDING" | undefined,
    priority: item?.priority as string | undefined,
    arrivalStatus: item?.arrivalStatus as string | undefined,
    opdRoom: (item?.opdRoom || doctor?.opdRoom) as string | undefined,
    waitingTimeMinutes: item?.waitingTimeMinutes as number | undefined,
    isWalkIn: item?.isWalkIn as boolean | undefined,
    createdDate: (item?.createdDate || item?.createdAt) as string | undefined,
    mrn: (item?.mrn || patient?.mrn) as string | undefined,
    patientAge: item?.patientAge as number | undefined,
    patientGender: item?.patientGender as string | undefined,
    patientPhone: (item?.patientPhone || patient?.phone || patient?.mobile) as
      string | undefined,
    department: (item?.department ||
      item?.departmentName ||
      doctor?.departmentName) as string | undefined,
    doctorSpecialty: (item?.doctorSpecialty || doctor?.specialty) as
      string | undefined,
    tokenNo: (item?.tokenNo || item?.queueToken) as string | undefined,
    timeSlot: (item?.timeSlot || startTime) as string | undefined,
    visitType: (item?.visitType || item?.appointmentType) as string | undefined,
    chiefComplaint: (item?.chiefComplaint || item?.reason) as
      string | undefined,
    notes: item?.notes as string | undefined,
  };
};

const unwrapAppointmentCollection = (response: {
  data?: unknown;
  content?: unknown;
}): Record<string, unknown>[] => {
  if (Array.isArray(response?.data))
    return response.data as Record<string, unknown>[];

  if (Array.isArray(response?.content))
    return response.content as Record<string, unknown>[];

  const resData = response?.data as
    { content?: unknown; data?: { content?: unknown } } | undefined;
  if (Array.isArray(resData?.content))
    return resData.content as Record<string, unknown>[];

  if (Array.isArray(resData?.data?.content))
    return resData.data.content as Record<string, unknown>[];

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
    return res?.data
      ? normalizeAppointmentRecord(
          res.data as unknown as Record<string, unknown>,
        )
      : null;
  },

  async bookAppointment(
    payload: CreateAppointmentRequest,
  ): Promise<AppointmentRecord> {
    const res = await appointmentsApi.createAppointment(payload);
    if (!res?.data) {
      throw new Error("Appointment booking did not return a record.");
    }
    return normalizeAppointmentRecord(
      res.data as unknown as Record<string, unknown>,
    );
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
    return normalizeAppointmentRecord(
      res.data as unknown as Record<string, unknown>,
    );
  },

  async cancelAppointment(
    appointmentId: string | number,
    payload: CancelAppointmentRequest,
  ): Promise<AppointmentRecord> {
    const res = await appointmentsApi.cancelAppointment(appointmentId, payload);
    if (!res?.data) {
      throw new Error("Appointment cancellation did not return a record.");
    }
    return normalizeAppointmentRecord(
      res.data as unknown as Record<string, unknown>,
    );
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

  async listDoctors(departmentId?: string | number): Promise<DoctorSummary[]> {
    const res = await appointmentsApi.getDoctors(departmentId);
    return Array.isArray(res?.data) ? res.data : [];
  },

  async listAvailableSlots(
    doctorId: string | number,
    date: string,
  ): Promise<unknown[]> {
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
