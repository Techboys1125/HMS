import { apiClient, axios } from "../../../lib/axios";
import type {
  QueueItem,
  QueueSummary,
  QueuePage,
  QueueListParams,
} from "../types/queue.types";

interface ApiEnvelope<T> {
  success?: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data?: T;
  errors?: Record<string, unknown>;
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

export interface QueueListResult {
  summary: QueueSummary;
  content: QueueItem[];
  page: QueuePage;
}

export const queueApi = {
  /**
   * GET /api/v1/queue or /api/v1/doctors/{doctorId}/queue
   * Fetch queue list. Uses doctor-specific endpoint when doctorId is provided.
   */
  async getQueueList(params?: QueueListParams): Promise<QueueListResult> {
    try {
      const emptyResult: QueueListResult = {
        summary: { completed: 0, waiting: 0, called: 0, inConsultation: 0 },
        content: [],
        page: { size: 20, totalElements: 0, page: 0 },
      };

      if (!params) return emptyResult;

      const { doctorId, departmentId, date, status, search, page = 0, size = 50 } = params;

      if (doctorId) {
        const response = await apiClient.get<{
          data?: {
            summary?: Record<string, number>;
            content?: QueueItem[];
            page?: Record<string, unknown>;
          };
          summary?: Record<string, number>;
          content?: QueueItem[];
          page?: Record<string, unknown>;
        }>(`/api/v1/doctors/${doctorId}/queue`);

        const payload = response.data;
        const data = payload?.data || payload;
        if (!data) return emptyResult;

        const content = Array.isArray(data.content) ? data.content : [];
        const summaryRaw = (data as Record<string, unknown>).summary as Record<string, number> || {};

        return {
          summary: {
            completed: summaryRaw.completedCount ?? summaryRaw.completed ?? 0,
            waiting: summaryRaw.waitingCount ?? summaryRaw.waiting ?? 0,
            called: summaryRaw.calledCount ?? summaryRaw.called ?? 0,
            inConsultation: summaryRaw.inConsultationCount ?? summaryRaw.inConsultation ?? 0,
          },
          content,
          page: data.page
            ? { size: (data.page as Record<string, unknown>).size as number || size, totalElements: (data.page as Record<string, unknown>).totalElements as number || 0, page: (data.page as Record<string, unknown>).page as number || 0 }
            : { size, totalElements: content.length, page: 0 },
        };
      }

      const query = new URLSearchParams();
      if (departmentId !== undefined) query.set("departmentId", String(departmentId));
      if (date) query.set("date", date);
      if (status) query.set("status", status);
      if (search) query.set("search", search);
      if (page !== undefined) query.set("page", String(page));
      if (size !== undefined) query.set("size", String(size));

      const qs = query.toString();
      const url = `/api/v1/queue${qs ? `?${qs}` : ""}`;
      const response = await apiClient.get<{
        data?: {
          summary: QueueSummary;
          content: QueueItem[];
          page: QueuePage;
        };
        summary: QueueSummary;
        content: QueueItem[];
        page: QueuePage;
      }>(url);

      const payload = response.data;
      const data = payload?.data || payload;

      if (!data) return emptyResult;

      return {
        summary: data.summary || emptyResult.summary,
        content: Array.isArray(data.content) ? data.content : [],
        page: data.page || emptyResult.page,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * PATCH /api/v1/queue/{appointmentId}/call
   * Doctor calls a patient from the queue
   */
  async callPatient(
    appointmentId: number,
  ): Promise<{ success: boolean; status: string }> {
    try {
      const response = await apiClient.patch<
        ApiEnvelope<{ success: boolean; status: string }> | { success: boolean; status: string }
      >(`/api/v1/queue/${appointmentId}/call`);
      return unwrap(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * POST /api/v1/doctors/{doctorId}/queue/call-next
   * Doctor calls next patient in their queue
   */
  async callNext(
    doctorId: number | string,
  ): Promise<{ action: string; appointmentId: number; tokenNumber: string; queueStatus: string }> {
    try {
      const numericId =
        typeof doctorId === "string" && doctorId.startsWith("DOC-")
          ? doctorId.replace("DOC-", "")
          : doctorId;
      const response = await apiClient.post<
        ApiEnvelope<{ action: string; appointmentId: number; tokenNumber: string; queueStatus: string }>
      >(`/api/v1/doctors/${numericId}/queue/call-next`);
      return unwrap(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
