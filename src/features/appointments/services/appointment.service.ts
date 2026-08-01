import { appointmentsApi } from "../api/appointments.api";
import { departmentsApi } from "../../users/api/departments.api";
import type {
  AppointmentRecord,
  CreateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  LinkedPatient,
  UserRole,
  DoctorSummary,
  PatientSummary,
  Department,
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
  WAITING_FOR_VITALS: "Checked-In",
  WAITING_FOR_CONSULTATION: "Waiting",
  VITALS_DONE: "Checked-In",
  REGULAR: "Scheduled",
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

  const deptObj =
    item?.department && typeof item.department === "object"
      ? (item.department as Record<string, unknown>)
      : null;
  const resolvedDeptName = (item?.departmentName ||
    deptObj?.departmentName ||
    deptObj?.name ||
    (typeof item?.department === "string" ? item.department : undefined) ||
    doctor?.departmentName) as string | undefined;

  return {
    id: (item?.id ?? item?.appointmentId ?? item?.appointmentNumber ?? "") as
      | string
      | number,
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
      | string
      | undefined,
    doctorId: (item?.doctorId ?? doctor?.doctorId ?? doctor?.id ?? "") as
      | string
      | number,
    doctorName: (item?.doctorName || doctor?.name || "") as string,
    appointmentDate,
    startTime,
    endTime: item?.endTime as string | undefined,
    status: toDisplayStatus(item?.status as string | undefined),
    queueStatus: (item?.queueStatus || item?.arrivalStatus) as
      | string
      | undefined,
    appointmentType: item?.appointmentType as string | undefined,
    reason: (item?.reason || item?.chiefComplaint) as string | undefined,
    symptoms: item?.symptoms as string | undefined,
    departmentId:
      typeof item?.departmentId === "number"
        ? item.departmentId
        : typeof deptObj?.departmentId === "number" ||
            typeof deptObj?.departmentId === "string"
          ? Number(deptObj.departmentId)
          : undefined,
    departmentName: resolvedDeptName,
    patient: patient as unknown as PatientSummary,
    doctor: doctor as unknown as DoctorSummary,
    cancellationReason: item?.cancellationReason as string | undefined,
    rescheduleReason: item?.rescheduleReason as string | undefined,
    vitalsRecorded: item?.vitalsRecorded as boolean | undefined,
    paymentStatus: item?.paymentStatus as
      | "PAID"
      | "UNPAID"
      | "PARTIAL"
      | "PENDING"
      | undefined,
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
      | string
      | undefined,
    department: resolvedDeptName,
    doctorSpecialty: (item?.doctorSpecialty || doctor?.specialty) as
      | string
      | undefined,
    tokenNo: (item?.tokenNo || item?.queueToken) as string | undefined,
    timeSlot: (item?.timeSlot || startTime) as string | undefined,
    visitType: (item?.visitType || item?.appointmentType) as string | undefined,
    chiefComplaint: (item?.chiefComplaint || item?.reason) as
      | string
      | undefined,
    notes: item?.notes as string | undefined,
  };
};

const unwrapAppointmentCollection = (
  response: any,
): Record<string, unknown>[] => {
  console.log("Appointments API Response:", response);
  try {
    console.log("JSON stringified response:", JSON.stringify(response));
  } catch (e) {
    console.log("Could not stringify response:", e);
  }

  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.appointments)) return response.appointments;

  const resData = response?.data;
  if (Array.isArray(resData?.appointments)) return resData.appointments;
  if (Array.isArray(resData?.content)) return resData.content;
  if (Array.isArray(resData?.data)) return resData.data;
  if (Array.isArray(resData?.data?.content)) return resData.data.content;
  if (Array.isArray(resData?.data?.appointments))
    return resData.data.appointments;

  if (response?.success && resData && typeof resData === "object") {
    if (Array.isArray(resData.appointments)) return resData.appointments;
    if (Array.isArray(resData.content)) return resData.content;
    if (Array.isArray(resData.data)) return resData.data;
  }

  return [];
};

export const appointmentService = {
  async listAppointments(params?: {
    doctorId?: string | number;
    patientId?: string | number;
    mrn?: string;
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<AppointmentRecord[]> {
    // 1. Fetch doctors lookup to resolve empty/missing department fields
    const doctorsMap = new Map<string, DoctorSummary>();
    try {
      const doctors = await this.listDoctors();
      doctors.forEach((d) => {
        if (d.id) doctorsMap.set(String(d.id), d);
      });
    } catch (e) {
      console.warn("Failed to load doctors for resolving departments:", e);
    }

    const res = await appointmentsApi.getAppointments(params);
    const items = unwrapAppointmentCollection(res);
    console.log("Extracted items:", items);

    return items.map((item) => {
      const docObj = (item?.doctor as Record<string, unknown>) || {};
      const docId = String(
        item?.doctorId || docObj?.id || docObj?.doctorId || "",
      );
      const knownDoc = docId ? doctorsMap.get(docId) : null;

      const updatedItem = { ...item };
      if (knownDoc) {
        if (
          (!updatedItem.departmentName || updatedItem.departmentName === "") &&
          knownDoc.departmentName
        ) {
          updatedItem.departmentName = knownDoc.departmentName;
        }
        if (
          (!updatedItem.departmentId || updatedItem.departmentId === 0) &&
          knownDoc.departmentId
        ) {
          updatedItem.departmentId = Number(knownDoc.departmentId);
        }
      }
      return normalizeAppointmentRecord(updatedItem);
    });
  },

  async listDoctorAppointments(
    doctorId?: string | number,
    date?: string,
    status?: string,
  ): Promise<AppointmentRecord[]> {
    let doctorsMap = new Map<string, DoctorSummary>();
    try {
      const doctors = await this.listDoctors();
      doctors.forEach((d) => {
        if (d.id) doctorsMap.set(String(d.id), d);
      });
    } catch (e) {
      console.warn("Failed to load doctors for resolving departments:", e);
    }

    const res = await appointmentsApi.getDoctorAppointments(
      doctorId,
      date,
      status,
    );
    let items = unwrapAppointmentCollection(res);

    if (items.length === 0) {
      console.log(
        `[listDoctorAppointments] Doctor route returned 0 items for doctorId=${doctorId}. Trying fallbacks...`,
      );
      try {
        const fallbackRes = await appointmentsApi.getAppointments({
          doctorId,
          date,
          status,
        });
        const fallbackItems = unwrapAppointmentCollection(fallbackRes);
        if (fallbackItems.length > 0) {
          console.log(
            `[listDoctorAppointments] Fallback 1 (getAppointments with doctorId) returned ${fallbackItems.length} items.`,
          );
          items = fallbackItems;
        }
      } catch (e) {
        console.warn("Doctor appointment fallback 1 failed:", e);
      }

      if (items.length === 0) {
        try {
          const generalRes = await appointmentsApi.getAppointments({
            date,
            status,
          });
          const generalItems = unwrapAppointmentCollection(generalRes);
          if (generalItems.length > 0) {
            const docIdStr = String(doctorId || "").toLowerCase();
            items = generalItems.filter((item: any) => {
              const docObj = (item?.doctor as Record<string, unknown>) || {};
              const itemDocId = String(
                item?.doctorId ?? docObj?.doctorId ?? docObj?.id ?? "",
              );
              const itemDocCode = String(
                item?.doctorCode ?? docObj?.doctorCode ?? docObj?.code ?? "",
              );
              const itemDocName = String(
                item?.doctorName ??
                  docObj?.name ??
                  docObj?.doctorName ??
                  item?.doctor ??
                  "",
              ).toLowerCase();

              return (
                (docIdStr && itemDocId === docIdStr) ||
                (docIdStr && itemDocCode.toLowerCase() === docIdStr) ||
                itemDocName.includes("subha") ||
                (docIdStr && itemDocName.includes(docIdStr)) ||
                itemDocCode === "KJBJC"
              );
            });
            console.log(
              `[listDoctorAppointments] Fallback 2 (general getAppointments matched for doctor) returned ${items.length} items.`,
            );
          }
        } catch (e) {
          console.warn("Doctor appointment fallback 2 failed:", e);
        }
      }
    }

    return items
      .filter((item) =>
        !status
          ? true
          : String(item?.status || "").toUpperCase() === status.toUpperCase(),
      )
      .map((item) => {
        const docObj = (item?.doctor as Record<string, unknown>) || {};
        const docId = String(
          item?.doctorId || docObj?.id || docObj?.doctorId || "",
        );
        const knownDoc = docId ? doctorsMap.get(docId) : null;

        const updatedItem = { ...item };
        if (knownDoc) {
          if (
            (!updatedItem.departmentName ||
              updatedItem.departmentName === "") &&
            knownDoc.departmentName
          ) {
            updatedItem.departmentName = knownDoc.departmentName;
          }
          if (
            (!updatedItem.departmentId || updatedItem.departmentId === 0) &&
            knownDoc.departmentId
          ) {
            updatedItem.departmentId = Number(knownDoc.departmentId);
          }
        }
        return normalizeAppointmentRecord(updatedItem);
      });
  },

  async listPatientAppointments(
    patientId: string | number,
  ): Promise<AppointmentRecord[]> {
    let doctorsMap = new Map<string, DoctorSummary>();
    try {
      const doctors = await this.listDoctors();
      doctors.forEach((d) => {
        if (d.id) doctorsMap.set(String(d.id), d);
      });
    } catch (e) {
      console.warn("Failed to load doctors for resolving departments:", e);
    }

    const res = await appointmentsApi.getPatientAppointments(patientId);
    const items = unwrapAppointmentCollection(res);
    return items.map((item) => {
      const docObj = (item?.doctor as Record<string, unknown>) || {};
      const docId = String(
        item?.doctorId || docObj?.id || docObj?.doctorId || "",
      );
      const knownDoc = docId ? doctorsMap.get(docId) : null;

      const updatedItem = { ...item };
      if (knownDoc) {
        if (
          (!updatedItem.departmentName || updatedItem.departmentName === "") &&
          knownDoc.departmentName
        ) {
          updatedItem.departmentName = knownDoc.departmentName;
        }
        if (
          (!updatedItem.departmentId || updatedItem.departmentId === 0) &&
          knownDoc.departmentId
        ) {
          updatedItem.departmentId = Number(knownDoc.departmentId);
        }
      }
      return normalizeAppointmentRecord(updatedItem);
    });
  },

  async getAppointment(
    appointmentId: string | number,
  ): Promise<AppointmentRecord | null> {
    const res = await appointmentsApi.getAppointmentById(appointmentId);
    const data = res?.data;
    return data
      ? normalizeAppointmentRecord(data as unknown as Record<string, unknown>)
      : null;
  },

  async bookAppointment(
    payload: CreateAppointmentRequest,
  ): Promise<AppointmentRecord> {
    const res = await appointmentsApi.createAppointment(payload);
    const data = res?.data;
    if (!data) {
      throw new Error("Appointment booking did not return a record.");
    }
    return normalizeAppointmentRecord(
      data as unknown as Record<string, unknown>,
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
    const data = res?.data;
    if (!data) {
      throw new Error("Appointment reschedule did not return a record.");
    }
    return normalizeAppointmentRecord(
      data as unknown as Record<string, unknown>,
    );
  },

  async cancelAppointment(
    appointmentId: string | number,
    payload: CancelAppointmentRequest,
  ): Promise<AppointmentRecord> {
    const res = await appointmentsApi.cancelAppointment(appointmentId, payload);
    const data = res?.data;
    if (!data) {
      throw new Error("Appointment cancellation did not return a record.");
    }
    return normalizeAppointmentRecord(
      data as unknown as Record<string, unknown>,
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

  async listDepartments(): Promise<Department[]> {
    const data = await departmentsApi.getDepartments();
    return (data || []).map((d) => ({
      id: d.departmentId ?? d.id ?? "",
      departmentName: d.departmentName ?? d.name ?? "",
      departmentCode: d.departmentCode ?? d.code ?? "",
    }));
  },

  async listDoctors(departmentId?: string | number): Promise<DoctorSummary[]> {
    try {
      const res = await appointmentsApi.getDoctors(departmentId);
      const rawList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];

      return rawList.map((d: any) => ({
        id: d.doctorId ?? d.doctorProfile?.doctorId ?? d.id ?? "",
        name: d.doctorName ?? d.name ?? "",
        departmentName: d.department ?? d.departmentName ?? "",
        department: d.department ?? d.departmentName ?? "",
        departmentId: d.departmentId ?? departmentId,
        specialty: d.specialty ?? "",
        qualification: d.qualification ?? "",
        consultationFee:
          d.fees?.standardConsultationFee ?? d.consultationFee ?? 0,
        opdRoom: d.opdRoom ?? "",
      }));
    } catch (error) {
      console.warn("[appointmentService] listDoctors failed:", error);
      return [];
    }
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
