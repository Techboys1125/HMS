import { apiClient, axios, ApiError } from "../../../lib/axios";
import { useAuthStore } from "../../auth";
import { triggerNotificationMatrix } from "../../notification/services/notificationTrigger";
import { billingService } from "../../billing/services/billing.service";
import type { AppointmentRecord } from "../../appointments/types/appointment.types";
import type {
  ApiPatientAppointment,
  ApiPatientFamilyMember,
  ApiPatientInvoice,
  ApiPatientPrescription,
  CreatePatientRequest,
  DuplicateCheckRequest,
  DuplicateOverrideRequest,
  MergePatientsRequest,
  PaginatedResponse,
  Patient,
  PatientApiResponse,
  PatientStatistics,
} from "../types/patient.types";

const unwrapData = <T>(response: unknown): T | null => {
  if (!response) return null;
  const resObj = response as { data?: T };
  return (resObj.data ?? response) as T;
};

export const patientsApi = {
  /**
   * cURL:
   * curl -X GET http://192.168.1.44:8081/api/v1/patients \
   *   -H "Authorization: Bearer <ACCESS_TOKEN>" \
   *   -H "Content-Type: application/json"
   */
  async getAll(params?: {
    query?: string;
    page?: number;
    size?: number;
    status?: string;
  }): Promise<Patient[]> {
    try {
      const search = new URLSearchParams();
      if (params?.query) search.append("query", params.query);
      if (params?.page !== undefined)
        search.append("page", String(params.page));
      if (params?.size !== undefined)
        search.append("size", String(params.size));
      if (params?.status) search.append("status", params.status);
      const url = `/api/v1/patients${search.toString() ? `?${search.toString()}` : ""}`;
      let res;
      try {
        res = await apiClient.get<unknown>(url);
      } catch (err) {
        const fallbackUrl = params?.query
          ? `/api/v1/patients/search?query=${encodeURIComponent(params.query)}`
          : "/api/v1/admin/users?role=PATIENT";
        try {
          res = await apiClient.get<unknown>(fallbackUrl);
        } catch {
          throw err;
        }
      }
      let data: unknown = res.data;
      if (data && typeof data === "object" && "data" in data) {
        data = (data as { data?: unknown }).data;
      }
      if (
        data &&
        typeof data === "object" &&
        "content" in data &&
        Array.isArray((data as { content?: unknown[] }).content)
      ) {
        return (data as { content: Patient[] }).content;
      }
      return Array.isArray(data) ? (data as Patient[]) : [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async search(query: string): Promise<Patient[]> {
    try {
      const res = await apiClient.get<{ content?: Patient[] } | Patient[]>(
        `/api/v1/patients/search?query=${encodeURIComponent(query)}`,
      );
      const data = res.data;
      if (
        data &&
        typeof data === "object" &&
        "content" in data &&
        Array.isArray(data.content)
      ) {
        return data.content;
      }
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async getById(mrn: string): Promise<Patient> {
    try {
      const res = await apiClient.get<Patient>(
        `/api/v1/patients/${encodeURIComponent(mrn)}`,
      );
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async create(
    payload: CreatePatientRequest,
  ): Promise<{ success?: boolean; message?: string; data?: Patient }> {
    try {
      const res = await apiClient.post<{
        success?: boolean;
        message?: string;
        data?: Patient;
      }>("/api/v1/patients", payload);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async createWithOverride(
    payload: CreatePatientRequest,
    reason: string,
  ): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>("/api/v1/patients/override", {
        ...payload,
        reason,
      });
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async update(
    userIdOrMrn: string | number,
    payload: Record<string, unknown>,
  ): Promise<Patient> {
    try {
      let res;
      try {
        res = await apiClient.put<Patient>(
          `/api/v1/admin/users/${userIdOrMrn}`,
          payload,
        );
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          res = await apiClient.put<Patient>(
            `/api/v1/patients/${encodeURIComponent(String(userIdOrMrn))}`,
            payload,
          );
        } else {
          throw err;
        }
      }
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async checkDuplicates(payload: DuplicateCheckRequest): Promise<Patient[]> {
    try {
      const res = await apiClient.post<{ candidates?: Patient[] } | Patient[]>(
        "/api/v1/patients/check-duplicates",
        payload,
      );
      const data = res.data;
      if (
        data &&
        typeof data === "object" &&
        "candidates" in data &&
        Array.isArray(data.candidates)
      ) {
        return data.candidates;
      }
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async overrideDuplicate(
    payload: DuplicateOverrideRequest & { mrn?: string },
  ): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>(
        "/api/v1/patients/duplicate-override",
        payload,
      );
      const raw = res.data;
      if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
        return raw.data as Patient;
      }
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async merge(payload: MergePatientsRequest): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>(
        "/api/v1/patients/merge",
        payload,
      );
      return unwrapData<Patient>(res) as Patient;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async getMyPatients(relationship?: string): Promise<Patient[]> {
    try {
      const search = new URLSearchParams();
      if (relationship) search.append("relationship", relationship);
      const url = `/api/v1/patients/my${search.toString() ? `?${search.toString()}` : ""}`;
      const res = await apiClient.get<unknown>(url);
      let data: unknown = res.data;
      if (data && typeof data === "object" && "data" in data) {
        data = (data as { data?: unknown }).data;
      }
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") {
        const collection = data as {
          content?: unknown;
          patients?: unknown;
        };
        if (Array.isArray(collection.content))
          return collection.content as Patient[];
        if (Array.isArray(collection.patients))
          return collection.patients as Patient[];
      }
      return [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },

  async getStatistics(): Promise<PatientStatistics> {
    try {
      const res = await apiClient.get<PatientStatistics>(
        "/api/v1/patients/statistics",
      );
      return unwrapData<PatientStatistics>(res) as PatientStatistics;
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 403 || error.response?.status === 404)
      ) {
        console.warn("Statistics endpoint not available, returning mock data");
        return {
          totalPatients: 0,
          activePatients: 0,
          inactivePatients: 0,
          duplicateCandidates: 0,
          deceasedPatients: 0,
          newRegistrationsToday: 0,
        };
      }
      if (
        error instanceof ApiError &&
        (error.response?.status === 403 || error.response?.status === 404)
      ) {
        console.warn("Statistics endpoint not available, returning mock data");
        return {
          totalPatients: 0,
          activePatients: 0,
          inactivePatients: 0,
          duplicateCandidates: 0,
          deceasedPatients: 0,
          newRegistrationsToday: 0,
        };
      }
      throw error;
    }
  },

  /**
   * GET /api/v1/patients/me/queue
   * Fetch current patient's queue status
   */
  async getMyQueue(): Promise<{
    appointmentId: number;
    token: string;
    position: number;
    patientsAhead: number;
    estimatedWaitMinutes: number;
    status: string;
    doctorName: string;
    departmentName: string;
  } | null> {
    try {
      const res = await apiClient.get<unknown>("/api/v1/patients/me/queue");
      const responseBody = res.data;
      const data =
        responseBody &&
        typeof responseBody === "object" &&
        "data" in responseBody
          ? (responseBody as { data?: unknown }).data
          : responseBody;
      if (data && typeof data === "object") {
        const queue = data as Record<string, unknown>;
        return {
          appointmentId: Number(queue.appointmentId || 0),
          token: String(queue.token || queue.tokenNumber || "TK-001"),
          position: Number(queue.position ?? 1),
          patientsAhead: Number(queue.patientsAhead ?? 0),
          estimatedWaitMinutes: Number(queue.estimatedWaitMinutes ?? 15),
          status: String(queue.status || queue.queueStatus || "WAITING"),
          doctorName: String(queue.doctorName || "Duty Doctor"),
          departmentName: String(queue.departmentName || "General OPD"),
        };
      }
      return null;
    } catch (error) {
      console.warn("[patientApi] Fallback for getMyQueue:", error);
      return null;
    }
  },

  listPatients: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    query?: string;
    status?: string;
    registrationType?: string;
  }): Promise<PaginatedResponse<Patient>> => {
    try {
      const searchParams = new URLSearchParams();
      const queryVal =
        ((params as Record<string, unknown> | undefined)?.query as
          string | undefined) || params?.search;
      if (queryVal) searchParams.append("query", queryVal);
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.limit) searchParams.append("limit", String(params.limit));
      if (params?.status) searchParams.append("status", params.status);
      if (params?.registrationType)
        searchParams.append("registrationType", params.registrationType);

      const url = `/api/v1/patients${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      let response;
      try {
        response = await apiClient.get<
          PatientApiResponse<Patient[]> | Patient[]
        >(url);
      } catch {
        // Fallback endpoint if primary /api/v1/patients returns 500
        const fallbackUrl = queryVal
          ? `/api/v1/patients/search?query=${encodeURIComponent(queryVal)}`
          : "/api/v1/admin/users?role=PATIENT";
        response = await apiClient.get<
          PatientApiResponse<Patient[]> | Patient[]
        >(fallbackUrl);
      }

      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as { data?: Patient[]; content?: Patient[] })?.data ||
          (response.data as { data?: Patient[]; content?: Patient[] })
            ?.content ||
          [];

      return {
        items: data,
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(data.length / (params?.limit || 10)) || 1,
      };
    } catch (error) {
      console.warn("[patientApi] Fallback error fetching patient list:", error);
      return {
        items: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      };
    }
  },

  getPatientByMrn: async (mrn: string): Promise<Patient> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<Patient> | Patient
      >(`/api/v1/patients/${mrn}`);
      const data =
        (response.data as PatientApiResponse<Patient>)?.data ||
        (response.data as Patient);
      if (!data) throw new Error(`Patient ${mrn} not found`);
      return data as Patient;
    } catch (error) {
      console.error(`[patientApi] Failed to fetch patient ${mrn}:`, error);
      throw error;
    }
  },

  registerPatient: async (
    payload: Record<string, unknown>,
  ): Promise<Patient> => {
    try {
      const response = await apiClient.post<PatientApiResponse<Patient>>(
        "/api/v1/patients",
        payload,
      );
      const data = response.data?.data || (response.data as unknown as Patient);
      if (!data) throw new Error("Failed to register patient");

      // Trigger notification
      const currentUser = useAuthStore.getState().user;
      triggerNotificationMatrix({
        eventId: `EVT-PAT-REG-${data.mrn || data.id || Date.now()}`,
        title: "New Patient Registered",
        message: `New patient ${data.fullName || data.name || "Patient"} has been registered by ${currentUser?.fullName || "Staff"}.`,
        module: "PATIENT",
        eventType: "PATIENT_REGISTERED",
        priority: "MEDIUM",
        receivers: [{ role: "Hospital Admin" }],
      });

      return data;
    } catch (error) {
      console.error("[patientApi] Patient registration failed:", error);
      throw error;
    }
  },

  updatePatient: async (
    mrn: string,
    payload: Record<string, unknown>,
  ): Promise<Patient> => {
    try {
      const response = await apiClient.put<PatientApiResponse<Patient>>(
        `/api/v1/patients/${mrn}`,
        payload,
      );
      const data = response.data?.data || (response.data as unknown as Patient);
      if (!data) throw new Error("Failed to update patient");

      // Trigger notification
      triggerNotificationMatrix({
        eventId: `EVT-PAT-UPD-${mrn}-${Date.now()}`,
        title: "Patient Profile Updated",
        message: `Patient ${data.fullName || data.name || "Patient"} profile was updated.`,
        eventType: "PATIENT_UPDATED_ADMIN",
        priority: "LOW",
        receivers: [
          {
            role: "Patient Portal",
            userId: data.userId || data.id,
            messageOverride:
              "Your profile information has been updated successfully.",
            eventTypeOverride: "PATIENT_UPDATED_PATIENT",
          },
          {
            role: "Hospital Admin",
            eventTypeOverride: "PATIENT_UPDATED_ADMIN",
          },
        ],
      });

      return data;
    } catch (error) {
      console.error(`[patientApi] Failed to update patient ${mrn}:`, error);
      throw error;
    }
  },

  getFamilyMembers: async (mrn: string): Promise<ApiPatientFamilyMember[]> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientFamilyMember[]>
      >(`/api/v1/patients/${mrn}/family-members`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  addFamilyMember: async (
    mrn: string,
    payload: Record<string, unknown>,
  ): Promise<ApiPatientFamilyMember | null> => {
    try {
      const response = await apiClient.post<
        PatientApiResponse<ApiPatientFamilyMember>
      >(`/api/v1/patients/${mrn}/family-members`, payload);
      return (
        response.data?.data ||
        (response.data as unknown as ApiPatientFamilyMember) ||
        null
      );
    } catch {
      return null;
    }
  },

  linkFamilyMember: async (
    primaryUserId: number,
    familyUserId: number,
    relationship: string,
  ): Promise<ApiPatientFamilyMember | null> => {
    try {
      const response = await apiClient.post<
        PatientApiResponse<ApiPatientFamilyMember>
      >("/api/v1/patients/family-members", {
        primaryUserId,
        familyUserId,
        relationship,
      });
      return (
        response.data?.data ||
        (response.data as unknown as ApiPatientFamilyMember) ||
        null
      );
    } catch {
      return null;
    }
  },

  updateFamilyMember: async (
    mrn: string,
    memberId: string,
    payload: Record<string, unknown>,
  ): Promise<ApiPatientFamilyMember | null> => {
    try {
      const response = await apiClient.put<
        PatientApiResponse<ApiPatientFamilyMember>
      >(`/api/v1/patients/${mrn}/family-members/${memberId}`, payload);
      return (
        response.data?.data ||
        (response.data as unknown as ApiPatientFamilyMember) ||
        null
      );
    } catch {
      return null;
    }
  },

  deleteFamilyMember: async (
    mrn: string,
    memberId: string,
  ): Promise<boolean> => {
    try {
      await apiClient.delete(
        `/api/v1/patients/${mrn}/family-members/${memberId}`,
      );
      return true;
    } catch {
      return false;
    }
  },

  getAppointments: async (mrn: string): Promise<ApiPatientAppointment[]> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientAppointment[]>
      >(`/api/v1/appointments?mrn=${mrn}`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  getPatientQueue: async (mrn?: string) => {
    try {
      type QueueData = {
        appointmentId: number;
        patientsAhead: number;
        estimatedWaitMinutes: number;
        status: string;
        doctorName: string;
        departmentName: string;
        queueStatus: string;
        position?: number;
        token?: string;
      };
      if (
        !mrn ||
        mrn.includes("MRN-PATIENT") ||
        mrn.includes("Generating") ||
        mrn === "N/A"
      ) {
        return null;
      }
      try {
        const response = await apiClient.get<
          PatientApiResponse<QueueData> | QueueData
        >(`/api/v1/patients/me/queue`);
        return (
          (response.data as PatientApiResponse<QueueData>)?.data ||
          (response.data as QueueData) ||
          null
        );
      } catch (err: unknown) {
        if (
          axios.isAxiosError(err) &&
          (err.response?.status === 404 || err.response?.status === 400)
        ) {
          // Gracefully return null if patient profile is not yet linked or 404 is returned
          return null;
        }
        return null;
      }
    } catch {
      return null;
    }
  },

  getReceptionQueue: async () => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<{
          queue: Array<{
            appointmentId: string;
            mrn: string;
            patientName: string;
            token: string;
            status: string;
          }>;
        }>
      >(`/api/v1/reception/queue`);
      return response.data?.data?.queue || [];
    } catch {
      return [];
    }
  },

  checkInAppointment: async (appointmentId: string): Promise<boolean> => {
    try {
      await apiClient.patch(
        `/api/v1/reception/appointments/${appointmentId}/check-in`,
      );

      // Trigger notifications for patient checked in
      let patientName = "Patient";
      let doctorId: string | number = "";
      try {
        const aptRes = await apiClient.get<
          PatientApiResponse<AppointmentRecord>
        >(`/api/v1/appointments/${appointmentId}`);
        const apt = aptRes.data?.data;
        if (apt) {
          patientName = apt.patientName || apt.patient?.fullName || "Patient";
          doctorId = apt.doctorId || apt.doctor?.id || "";
        }
      } catch (e) {
        console.warn(
          "Failed to fetch appointment details for check-in notification",
          e,
        );
      }

      triggerNotificationMatrix({
        eventId: `EVT-RECEPT-CHECKIN-${appointmentId}`,
        title: "Patient Checked In",
        message: `Patient ${patientName} checked in successfully.`,
        module: "RECEPTION",
        eventType: "PATIENT_CHECKED_IN",
        priority: "MEDIUM",
        receivers: [
          {
            role: "Doctor",
            userId: doctorId,
            messageOverride: `Patient ${patientName} has checked in and is waiting.`,
          },
          {
            role: "Nurse",
            messageOverride: `Patient ${patientName} is ready for vitals.`,
          },
          {
            role: "Receptionist",
            messageOverride: `Patient ${patientName} has been checked in at reception.`,
          },
          { role: "Hospital Admin" },
        ],
      });

      return true;
    } catch {
      return false;
    }
  },

  generateToken: async (
    appointmentId: string,
  ): Promise<{ token: string } | null> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<{ token: string }>
      >(`/api/v1/reception/appointments/${appointmentId}/token`);
      const resData = response.data?.data;

      if (resData) {
        const tokenNo = resData.token || "TK-001";
        let patientId = "";
        try {
          const aptRes = await apiClient.get<
            PatientApiResponse<AppointmentRecord>
          >(`/api/v1/appointments/${appointmentId}`);
          const apt = aptRes.data?.data;
          if (apt) {
            patientId = String(apt.patientId || apt.patient?.id || "");
          }
        } catch (e) {
          console.warn("Failed to fetch patientId for token notification", e);
        }

        if (patientId) {
          triggerNotificationMatrix({
            eventId: `EVT-QUEUE-TOKEN-${appointmentId}`,
            title: "Queue Token Generated",
            message: `Your queue token is ${tokenNo}. Please wait for your turn.`,
            module: "QUEUE",
            eventType: "QUEUE_TOKEN_GENERATED",
            priority: "LOW",
            receivers: [{ role: "Patient Portal", userId: patientId }],
          });
        }
      }
      return resData || null;
    } catch {
      return null;
    }
  },

  getNurseVitalsWaiting: async () => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<
          Array<{
            mrn: string;
            fullName: string;
            age: number;
            gender: string;
            doctor: string;
            department: string;
            appointmentId: string;
          }>
        >
      >(`/api/v1/nurse/vitals/waiting`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  submitVitals: async (
    appointmentId: string,
    payload: Record<string, unknown>,
  ): Promise<boolean> => {
    try {
      await apiClient.post(
        `/api/v1/nurse/appointments/${appointmentId}/vitals`,
        payload,
      );

      // Trigger notifications for vitals completed/updated
      let patientName = "Patient";
      let doctorId: string | number = "";
      let isUpdate = false;
      try {
        const aptRes = await apiClient.get<
          PatientApiResponse<AppointmentRecord>
        >(`/api/v1/appointments/${appointmentId}`);
        const apt = aptRes.data?.data;
        if (apt) {
          patientName = apt.patientName || apt.patient?.fullName || "Patient";
          doctorId = apt.doctorId || apt.doctor?.id || "";
          isUpdate = apt.vitalsRecorded === true;
        }
      } catch (e) {
        console.warn(
          "Failed to fetch appointment details for vitals notification",
          e,
        );
      }

      triggerNotificationMatrix({
        eventId: `EVT-VITALS-${appointmentId}-${Date.now()}`,
        title: isUpdate ? "Vitals Updated" : "Vitals Completed",
        message: isUpdate
          ? `Patient ${patientName} vitals have been updated.`
          : `Vitals for ${patientName} have been completed. Patient is ready for consultation.`,
        module: "NURSE",
        eventType: isUpdate ? "VITALS_UPDATED" : "VITALS_COMPLETED",
        priority: "MEDIUM",
        receivers: [
          { role: "Doctor", userId: doctorId },
          {
            role: "Hospital Admin",
            messageOverride: `Vitals for ${patientName} have been ${isUpdate ? "updated" : "completed"}.`,
          },
        ],
      });

      return true;
    } catch {
      return false;
    }
  },

  getPrescriptions: async (mrn: string): Promise<ApiPatientPrescription[]> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientPrescription[]> | ApiPatientPrescription[]
      >(`/api/v1/patient/prescriptions?mrn=${mrn}`);
      const body = response.data as
        | PatientApiResponse<ApiPatientPrescription[]>
        | ApiPatientPrescription[]
        | { content?: ApiPatientPrescription[] };

      if (Array.isArray(body)) return body;
      if (body !== null && typeof body === "object" && "data" in body) {
        const inner = (body as PatientApiResponse<ApiPatientPrescription[]>)
          .data;
        if (Array.isArray(inner)) return inner;
        if (
          inner !== null &&
          typeof inner === "object" &&
          "content" in inner &&
          Array.isArray(
            (inner as { content?: ApiPatientPrescription[] }).content,
          )
        ) {
          return (inner as { content: ApiPatientPrescription[] }).content;
        }
      }
      if (
        body !== null &&
        typeof body === "object" &&
        "content" in body &&
        Array.isArray((body as { content?: ApiPatientPrescription[] }).content)
      ) {
        return (body as { content: ApiPatientPrescription[] }).content;
      }
      return [];
    } catch {
      return [];
    }
  },

  getPrescriptionById: async (
    id: string,
  ): Promise<ApiPatientPrescription | null> => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<ApiPatientPrescription>
      >(`/api/v1/patient/prescriptions/${id}`);
      return (
        response.data?.data ||
        (response.data as unknown as ApiPatientPrescription) ||
        null
      );
    } catch {
      return null;
    }
  },

  getBilling: async (mrn: string): Promise<ApiPatientInvoice[]> => {
    try {
      const records = await billingService.getPatientBilling(mrn);
      return records.map((r) => ({
        id: String(r.id),
        invoiceNumber: r.billNumber || r.id,
        date: r.invoiceDate,
        amount: r.invoiceAmount,
        status: r.paymentStatus,
      }));
    } catch {
      return [];
    }
  },

  getPatientAudit: async (mrn: string) => {
    try {
      const response = await apiClient.get<
        PatientApiResponse<
          Array<{
            action: string;
            timestamp: string;
            performedBy: string;
            details: string;
          }>
        >
      >(`/api/v1/patients/${mrn}/audit`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },

  /**
   * GET /api/v1/doctor/patients
   * Fetch patients assigned to the logged-in doctor
   */
  getDoctorPatients: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Patient>> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page !== undefined)
        searchParams.append("page", String(params.page));
      if (params?.size !== undefined)
        searchParams.append("size", String(params.size));
      if (params?.search) searchParams.append("search", params.search);

      const url = `/api/v1/doctor/patients${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await apiClient.get<{
        doctorId?: string;
        doctorName?: string;
        totalPatients?: number;
        page?: number;
        size?: number;
        totalPages?: number;
        patients?: Array<{
          patientId?: string;
          mrn?: string;
          fullName?: string;
          gender?: string;
          age?: number;
          mobileNumber?: string;
          bloodGroup?: string;
          visitCount?: number;
          lastVisitDate?: string;
          nextAppointmentDate?: string;
          lastVisit?: string;
          totalVisits?: number;
        }>;
      }>(url);

      const data = response.data;
      const patients: Patient[] = (data?.patients || []).map((p) => ({
        id: p.patientId ? Number(p.patientId) || undefined : undefined,
        mrn: p.mrn || "",
        fullName: p.fullName || "",
        name: p.fullName,
        patientName: p.fullName,
        gender: p.gender || "MALE",
        age: p.age,
        phone: p.mobileNumber,
        mobileNumber: p.mobileNumber,
        mobile: p.mobileNumber,
        bloodGroup: p.bloodGroup,
        status: "ACTIVE",
        registrationDate: p.lastVisitDate,
        insuranceDetails: null,
        visitCount: p.visitCount,
        lastVisitDate: p.lastVisitDate,
        nextAppointmentDate: p.nextAppointmentDate,
        lastVisit: p.lastVisit,
        totalVisits: p.totalVisits,
        userId: 0,
      }));

      return {
        items: patients,
        total: data?.totalPatients || patients.length,
        page: (data?.page || 0) + 1,
        limit: data?.size || 20,
        totalPages: data?.totalPages || 1,
      };
    } catch (error) {
      console.warn("[patientApi] Failed to fetch doctor patients:", error);
      return {
        items: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.size || 20,
        totalPages: 1,
      };
    }
  },
};
