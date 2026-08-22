import { apiClient, axios } from "../../../lib/axios";
import type { ApiPatientPrescription } from "../../patients/types/patient.types";
import type {
  PatientPrescriptionSummary,
  PaginatedResponse,
} from "../types/prescription.types";

export interface ApiEnvelope<T> {
  success?: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data?: T;
  errors?: Record<string, unknown>;
}

interface ApiResponseBody<T> {
  data?: T;
  content?: T;
}

const unwrap = <T>(body: ApiEnvelope<T> | T): T => {
  if (
    body !== null &&
    typeof body === "object" &&
    "data" in body &&
    (body as ApiEnvelope<T>).data !== undefined
  ) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
};

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) {
      throw new Error(data.message);
    }
  }
  throw error;
};

export interface PrescriptionDetailResponse {
  prescriptionId: number | string;
  prescriptionNumber?: string;
  patientName?: string;
  patientMrn?: string;
  doctorName?: string;
  department?: string;
  status?: string;
  outcome?: string;
  currentVersion?: number;
  createdAt?: string;
  updatedAt?: string;
  finalizedAt?: string;
  medicines?: Array<{
    medicationId?: number | string;
    medicineId?: number | string;
    medicineName?: string;
    name?: string;
    strength?: string;
    dosage?: string;
    dose?: { value?: number; unit?: string };
    frequency?: string | { code?: string; display?: string };
    duration?: string | { value?: number; unit?: string };
    quantity?: { value?: number; unit?: string };
    route?: string;
    instructions?: string;
    source?: string;
    displayOrder?: number;
  }>;
  advice?: {
    general?: string;
    diet?: string;
    precautions?: string;
    additionalInstructions?: string;
  };
  followUp?: {
    instructions?: string;
    type?: string;
    intervalValue?: number;
    intervalUnit?: string;
    followUpDate?: string;
  };
}

export interface PrescriptionSummaryResponse {
  totalPrescriptions?: number;
  issuedCount?: number;
  completedCount?: number;
  activeFollowUps?: number;
  reprintCount?: number;
}

export interface AmendmentResponse {
  amendmentId?: number | string;
  prescriptionId?: number | string;
  version?: number;
  reason?: string;
  createdAt?: string;
}

export interface ReprintResponse {
  reprintId?: number | string;
  prescriptionId?: number | string;
  printedAt?: string;
  reason?: string;
}

export interface PrintOutputResponse {
  prescriptionNumber?: string;
  patientName?: string;
  patientMrn?: string;
  doctorName?: string;
  registrationNumber?: string;
  department?: string;
  medicines?: Array<{
    medicineName?: string;
    strength?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  advice?: {
    general?: string;
    diet?: string;
    precautions?: string;
  };
  followUpDate?: string;
  digitalSeal?: string;
}

export const prescriptionApi = {
  /**
   * GET /api/v1/patient/prescriptions
   * GET /api/v1/patient/prescriptions?mrn=...
   */
  getPrescriptions: async (mrn?: string): Promise<ApiPatientPrescription[]> => {
    try {
      let url: string;
      if (mrn) {
        url = `/api/v1/patient/prescriptions?mrn=${mrn}`;
      } else {
        url = "/api/v1/patient/prescriptions";
      }
      const response =
        await apiClient.get<ApiResponseBody<ApiPatientPrescription[]>>(url);
      const body = response.data;

      if (Array.isArray(body)) {
        return body;
      }

      if (body && typeof body === "object") {
        const bodyRecord = body as {
          data?: unknown;
          content?: unknown;
        };

        if (Array.isArray(bodyRecord.data)) {
          return bodyRecord.data as ApiPatientPrescription[];
        }

        if (
          bodyRecord.data &&
          typeof bodyRecord.data === "object" &&
          Array.isArray((bodyRecord.data as { content?: unknown }).content)
        ) {
          return (bodyRecord.data as { content: ApiPatientPrescription[] })
            .content;
        }

        if (Array.isArray(bodyRecord.content)) {
          return bodyRecord.content as ApiPatientPrescription[];
        }
      }

      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /api/v1/patient/prescriptions/{id}
   */
  getPrescriptionById: async (
    id: string | number,
  ): Promise<ApiPatientPrescription | null> => {
    try {
      const response = await apiClient.get<ApiPatientPrescription>(
        `/api/v1/patient/prescriptions/${id}`,
      );
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/prescriptions/{prescriptionId}
   */
  getPrescriptionDetails: async (
    prescriptionId: string | number,
  ): Promise<PrescriptionDetailResponse | null> => {
    try {
      const response = await apiClient.get<PrescriptionDetailResponse>(
        `/api/v1/prescriptions/${prescriptionId}`,
      );
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/encounters/{encounterId}/prescription
   */
  getEncounterPrescription: async (
    encounterId: string | number,
  ): Promise<ApiPatientPrescription | null> => {
    try {
      const response = await apiClient.get<ApiPatientPrescription>(
        `/api/v1/encounters/${encounterId}/prescription`,
      );
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/finalize
   */
  finalizePrescription: async (
    prescriptionId: string | number,
    payload: { confirmation: boolean } = { confirmation: true },
  ): Promise<ApiPatientPrescription> => {
    const response = await apiClient.post<ApiPatientPrescription>(
      `/api/v1/prescriptions/${prescriptionId}/finalize`,
      payload,
    );
    return response.data;
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/amendments
   */
  createAmendment: async (
    prescriptionId: string | number,
    payload?: { reason?: string },
  ) => {
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const response = await apiClient.post<ApiResponseBody<AmendmentResponse>>(
        `/api/v1/prescriptions/${prescriptionId}/amendments`,
        payload || {},
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        },
      );
      return unwrap<AmendmentResponse>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/prescriptions/{prescriptionId}/reprint
   */
  reprintPrescription: async (
    prescriptionId: string | number,
    payload?: { reason?: string },
  ) => {
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const response = await apiClient.post<ApiResponseBody<ReprintResponse>>(
        `/api/v1/prescriptions/${prescriptionId}/reprint`,
        payload || {},
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        },
      );
      return unwrap<ReprintResponse>(response.data);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  },

  /**
   * GET /api/v1/prescriptions/{prescriptionId}/print-output
   */
  getPrintOutput: async (
    prescriptionId: string | number,
  ): Promise<PrintOutputResponse | null> => {
    try {
      const response = await apiClient.get<PrintOutputResponse>(
        `/api/v1/prescriptions/${prescriptionId}/print-output`,
      );
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/doctor/prescriptions/summary
   */
  getDoctorSummary: async (): Promise<PrescriptionSummaryResponse | null> => {
    try {
      const response = await apiClient.get<PrescriptionSummaryResponse>(
        "/api/v1/doctor/prescriptions/summary",
      );
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * GET /api/v1/doctors/{id}/prescriptions
   */
  getDoctorPrescriptions: async (
    doctorId: string | number,
  ): Promise<ApiPatientPrescription[]> => {
    try {
      const response = await apiClient.get<
        ApiResponseBody<ApiPatientPrescription[]>
      >(`/api/v1/doctors/${doctorId}/prescriptions`);
      const body = response.data;
      if (Array.isArray(body)) return body;
      if (body && typeof body === "object" && "data" in body) {
        const inner = body.data;
        if (Array.isArray(inner)) return inner;
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /api/v1/patients/{mrn}/prescriptions
   * Patient-specific endpoint — returns paginated prescriptions for a patient.
   */
  getPatientPrescriptions: async (
    mrn: string,
    params?: {
      page?: number;
      size?: number;
      status?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<PaginatedResponse<PatientPrescriptionSummary>> => {
    try {
      const query = new URLSearchParams();
      if (params?.page !== undefined) query.set("page", String(params.page));
      if (params?.size !== undefined) query.set("size", String(params.size));
      if (params?.status) query.set("status", params.status);
      if (params?.fromDate) query.set("fromDate", params.fromDate);
      if (params?.toDate) query.set("toDate", params.toDate);
      const qs = query.toString();
      const url = `/api/v1/patients/${encodeURIComponent(mrn)}/prescriptions${qs ? `?${qs}` : ""}`;
      const response =
        await apiClient.get<
          ApiEnvelope<PaginatedResponse<PatientPrescriptionSummary>>
        >(url);
      const envelope = response.data;
      if (envelope?.data) return envelope.data;
      return {
        content: [],
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      };
    } catch {
      return {
        content: [],
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      };
    }
  },

  /**
   * GET /api/v1/patients/{mrn}/prescriptions-history
   */
  getPatientPrescriptionsHistory: async (
    mrn: string,
  ): Promise<ApiPatientPrescription[]> => {
    try {
      const response = await apiClient.get<
        ApiResponseBody<ApiPatientPrescription[]>
      >(`/api/v1/patients/${mrn}/prescriptions-history`);
      const body = response.data;
      if (Array.isArray(body)) return body;
      if (body && typeof body === "object" && "data" in body) {
        const inner = body.data;
        if (Array.isArray(inner)) return inner;
      }
      return [];
    } catch {
      return [];
    }
  },
};
