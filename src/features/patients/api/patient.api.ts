import { apiClient, axios, ApiError } from "../../../lib/axios";
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
      const response = await apiClient.get<
        PatientApiResponse<QueueData> | QueueData
      >(mrn ? `/api/v1/patients/${mrn}/queue` : `/api/v1/patients/me/queue`);
      return (
        (response.data as PatientApiResponse<QueueData>)?.data ||
        (response.data as QueueData) ||
        null
      );
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
      return response.data?.data || null;
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
      interface BillingApiBill {
        billId?: string | number;
        billNumber?: string;
        date?: string;
        doctor?: string;
        billStatus?: string;
        paymentStatus?: string;
        amount?: string | number;
      }
      interface BillingApiData {
        mrn?: string;
        patientName?: string;
        bills?: BillingApiBill[];
        page?: number;
        size?: number;
      }

      const response = await apiClient.get<
        PatientApiResponse<BillingApiData> | BillingApiData | BillingApiBill[]
      >(`/api/v1/billing/patient/${mrn}`);
      const body = response.data as
        PatientApiResponse<BillingApiData> | BillingApiData | BillingApiBill[];

      let bills: BillingApiBill[] = [];
      if (Array.isArray(body)) {
        bills = body as BillingApiBill[];
      } else if (body !== null && typeof body === "object") {
        if ("data" in body) {
          const inner = (body as PatientApiResponse<BillingApiData>).data;
          if (Array.isArray(inner)) {
            bills = inner as unknown as BillingApiBill[];
          } else if (
            inner !== null &&
            typeof inner === "object" &&
            Array.isArray((inner as BillingApiData).bills)
          ) {
            bills = (inner as BillingApiData).bills as BillingApiBill[];
          }
        }
        if (
          bills.length === 0 &&
          Array.isArray((body as BillingApiData).bills)
        ) {
          bills = (body as BillingApiData).bills as BillingApiBill[];
        }
      }

      return bills.map((bill) => ({
        id: bill.billId ?? "",
        invoiceNumber: bill.billNumber ?? "",
        date: bill.date ?? "",
        status: bill.billStatus ?? bill.paymentStatus ?? "",
        amount: bill.amount ?? "",
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
};
