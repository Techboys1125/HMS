import { apiClient } from "../../../lib/axios";
import type {
  DoctorApiResponse,
  PaginatedResponse,
  ApiUserDoctorRecord,
  CreateDoctorPayload,
  UpdateDoctorPayload,
  DoctorDailyAvailabilityData,
  DoctorMonthlyAvailabilityData,
  ApiScheduleExceptionItem,
  ApiWeeklyScheduleData,
  UpdateScheduleDayPayload,
  CreateScheduleExceptionPayload,
  UpdateScheduleExceptionPayload,
  DoctorAppointment,
} from "../types/doctors.types";

export const doctorApi = {
  listDoctors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    departmentId?: number;
    activeOnly?: boolean;
  }): Promise<PaginatedResponse<ApiUserDoctorRecord>> => {
    try {
      const endpoint = params?.departmentId
        ? `/api/v1/doctors?departmentId=${params.departmentId}`
        : "/api/v1/doctors";
      const response = await apiClient.get<
        DoctorApiResponse<ApiUserDoctorRecord[]> | ApiUserDoctorRecord[]
      >(endpoint);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      return {
        items: data,
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(data.length / (params?.limit || 10)) || 1,
      };
    } catch {
      const response = await apiClient.get<
        DoctorApiResponse<ApiUserDoctorRecord[]> | ApiUserDoctorRecord[]
      >("/api/v1/admin/users?role=DOCTOR");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      return {
        items: data,
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(data.length / (params?.limit || 10)) || 1,
      };
    }
  },

  getDoctorById: async (
    userId: number | string,
  ): Promise<ApiUserDoctorRecord> => {
    const response = await apiClient.get<
      DoctorApiResponse<ApiUserDoctorRecord>
    >(`/api/v1/admin/users/${userId}`);
    const data =
      response.data?.data || (response.data as unknown as ApiUserDoctorRecord);
    if (!data) throw new Error(`Doctor user ${userId} not found`);
    return data;
  },

  createDoctor: async (
    payload: CreateDoctorPayload,
  ): Promise<ApiUserDoctorRecord> => {
    const response = await apiClient.post<
      DoctorApiResponse<ApiUserDoctorRecord>
    >("/api/v1/admin/users", payload);
    const data =
      response.data?.data || (response.data as unknown as ApiUserDoctorRecord);
    if (!data) throw new Error("Failed to create doctor user");
    return data;
  },

  updateDoctor: async (
    userId: number | string,
    payload: UpdateDoctorPayload,
  ): Promise<DoctorApiResponse<unknown>> => {
    const response = await apiClient.put<DoctorApiResponse<unknown>>(
      `/api/v1/admin/users/${userId}`,
      payload,
    );
    return response.data;
  },

  deactivateDoctor: async (
    doctorId: number | string,
  ): Promise<DoctorApiResponse<unknown>> => {
    const response = await apiClient.patch<DoctorApiResponse<unknown>>(
      `/api/v1/doctors/${doctorId}/deactivate`,
    );
    return response.data;
  },

  activateDoctor: async (
    userId: number | string,
  ): Promise<DoctorApiResponse<unknown>> => {
    const response = await apiClient.patch<DoctorApiResponse<unknown>>(
      `/api/v1/admin/users/${userId}/activate`,
    );
    return response.data;
  },

  getWeeklySchedule: async (
    doctorId: number | string,
  ): Promise<ApiWeeklyScheduleData | null> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<ApiWeeklyScheduleData>
      >(`/api/v1/doctors/${doctorId}/schedules`);
      const rawData = response.data?.data || response.data;
      if (!rawData) return null;
      const scheduleData =
        "weeklySchedule" in rawData
          ? (rawData as unknown as ApiWeeklyScheduleData)
          : (rawData as unknown as ApiWeeklyScheduleData);
      if (Array.isArray(scheduleData.weeklySchedule)) {
        return scheduleData;
      }
      if (Array.isArray(rawData)) {
        return {
          doctorId: Number(doctorId),
          doctorName: "",
          weeklySchedule: rawData,
        };
      }
      return scheduleData;
    } catch {
      return null;
    }
  },

  updateWeeklySchedule: async (
    doctorId: number | string,
    payload: UpdateScheduleDayPayload,
  ): Promise<boolean> => {
    try {
      const response = await apiClient.put<DoctorApiResponse<unknown>>(
        `/api/v1/doctors/${doctorId}/schedules`,
        payload,
      );
      return response.data?.success !== false;
    } catch {
      return false;
    }
  },

  deleteScheduleDay: async (
    doctorId: number | string,
    scheduleId: number | string,
  ): Promise<boolean> => {
    try {
      await apiClient.delete(
        `/api/v1/doctors/${doctorId}/schedules/${scheduleId}`,
      );
      return true;
    } catch {
      return false;
    }
  },

  getScheduleExceptions: async (
    doctorId: number | string,
  ): Promise<ApiScheduleExceptionItem[]> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<ApiScheduleExceptionItem[]>
      >(`/api/v1/doctors/${doctorId}/schedule-exceptions`);
      const rawData = response.data?.data || response.data;
      const list = Array.isArray(rawData)
        ? rawData
        : Array.isArray((rawData as unknown as { content?: unknown[] })?.content)
          ? ((rawData as unknown as { content: unknown[] }).content)
          : [];
      return list.map((item: ApiScheduleExceptionItem) => ({
        id: item.id || Number(doctorId),
        doctorId: Number(doctorId),
        exceptionDate:
          item.exceptionDate || item.startDate || item.endDate || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        reason: item.reason || "",
        exceptionType:
          item.exceptionType || item.type || "OTHER",
        isFullDay: item.isFullDay ?? item.fullDay ?? true,
        action: item.action || "BLOCK_APPOINTMENTS",
        status: item.status || "ACTIVE",
      }));
    } catch {
      return [];
    }
  },

  createScheduleException: async (
    doctorId: number | string,
    payload: CreateScheduleExceptionPayload,
  ): Promise<ApiScheduleExceptionItem | null> => {
    try {
      const response = await apiClient.post<
        DoctorApiResponse<ApiScheduleExceptionItem>
      >(`/api/v1/doctors/${doctorId}/schedule-exceptions`, payload);
      return (
        response.data?.data ||
        (response.data as unknown as ApiScheduleExceptionItem) ||
        null
      );
    } catch {
      return null;
    }
  },

  updateScheduleException: async (
    doctorId: number | string,
    exceptionId: number | string,
    payload: UpdateScheduleExceptionPayload,
  ): Promise<ApiScheduleExceptionItem | null> => {
    try {
      const response = await apiClient.put<
        DoctorApiResponse<ApiScheduleExceptionItem>
      >(
        `/api/v1/doctors/${doctorId}/schedule-exceptions/${exceptionId}`,
        payload,
      );
      return (
        response.data?.data ||
        (response.data as unknown as ApiScheduleExceptionItem) ||
        null
      );
    } catch {
      return null;
    }
  },

  deleteScheduleException: async (
    doctorId: number | string,
    exceptionId: number | string,
  ): Promise<boolean> => {
    try {
      await apiClient.delete(
        `/api/v1/doctors/${doctorId}/schedule-exceptions/${exceptionId}`,
      );
      return true;
    } catch {
      return false;
    }
  },

  getDailyAvailability: async (
    doctorId: number | string,
    date: string,
  ): Promise<DoctorDailyAvailabilityData | null> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<DoctorDailyAvailabilityData>
      >(`/api/v1/doctors/${doctorId}/availability?date=${date}`);
      const rawData = response.data?.data || response.data;
      if (!rawData) return null;
      const dailyData = rawData as DoctorDailyAvailabilityData;
      return {
        doctorId: dailyData.doctorId || Number(doctorId),
        date: dailyData.date || date,
        scheduleStatus: dailyData.scheduleStatus || "AVAILABLE",
        slots: Array.isArray(dailyData.slots) ? dailyData.slots : [],
      };
    } catch {
      return null;
    }
  },

  getMonthlyCalendarAvailability: async (
    doctorId: number | string,
    month: string,
  ): Promise<DoctorMonthlyAvailabilityData | null> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<DoctorMonthlyAvailabilityData>
      >(`/api/v1/doctors/${doctorId}/availability/calendar?month=${month}`);
      const rawData = response.data?.data || response.data;
      if (!rawData) return null;
      const monthlyData = rawData as DoctorMonthlyAvailabilityData;
      return {
        doctorId: monthlyData.doctorId || Number(doctorId),
        month: monthlyData.month || month,
        days: Array.isArray(monthlyData.days) ? monthlyData.days : [],
      };
    } catch {
      return null;
    }
  },

  getDoctorAppointments: async (
    doctorId: number | string,
  ): Promise<DoctorAppointment[]> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<DoctorAppointment[]>
      >(`/api/v1/doctors/${doctorId}/appointments`);
      const rawData = response.data?.data || response.data;
      const list = Array.isArray(rawData)
        ? rawData
        : Array.isArray((rawData as unknown as { content?: unknown[] })?.content)
          ? ((rawData as unknown as { content: unknown[] }).content)
          : [];
      return list.map((item: DoctorAppointment) => ({
        id: String(item.id || ""),
        patientId: String(item.patientId || item.patientName || ""),
        patientName: item.patientName || "Patient",
        gender: item.gender || "Unknown",
        age: item.age || 0,
        date: item.date || "",
        time: item.time || "",
        type: item.type || "General Consultation",
        status: item.status || "BOOKED",
        complaint: item.complaint || "General Checkup",
      }));
    } catch {
      return [];
    }
  },

  getUpcomingAppointmentCount: async (
    doctorId: number | string,
  ): Promise<number> => {
    try {
      const appointments = await doctorApi.getDoctorAppointments(doctorId);
      const now = new Date();
      return appointments.filter((a) => {
        const apptDate = new Date(a.date);
        return (
          apptDate >= now &&
          a.status !== "Cancelled" &&
          a.status !== "Completed"
        );
      }).length;
    } catch {
      return 0;
    }
  },

  getDoctorAudit: async (
    doctorId: number | string,
  ): Promise<
    Array<{
      action: string;
      timestamp: string;
      performedBy: string;
      details: string;
    }>
  > => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<
          Array<{
            action: string;
            timestamp: string;
            performedBy: string;
            details: string;
          }>
        >
      >(`/api/v1/doctors/${doctorId}/audit`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch {
      return [];
    }
  },
};
