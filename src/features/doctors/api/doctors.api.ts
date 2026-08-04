import { apiClient } from "../../../lib/axios";
import { useAuthStore } from "../../auth/index";
import type {
  DoctorRecord,
  DoctorApiResponse,
  PaginatedResponse,
  ApiUserDoctorRecord,
  CreateDoctorPayload,
  UpdateDoctorPayload,
  DoctorDailyAvailabilityData,
  DoctorMonthlyAvailabilityData,
  ApiScheduleExceptionItem,
  ApiWeeklyScheduleData,
  DayOfWeek,
  UpdateScheduleDayPayload,
  CreateScheduleExceptionPayload,
  UpdateScheduleExceptionPayload,
  DoctorQueueSummary,
  DoctorQueueItem,
  DoctorCallNextResponse,
  ApiAvailabilityItem,
} from "../types/doctors.types";

const isAdminRole = (): boolean => {
  const role = useAuthStore.getState().user?.role;
  const r = String(role ?? "").toUpperCase();
  return r === "SUPER_ADMIN" || r === "HOSPITAL_ADMIN" || r === "ADMIN";
};

type QueuePayload = {
  data?: {
    summary?: DoctorQueueSummary;
    content?: unknown;
    page?: Record<string, unknown>;
  };
  summary?: DoctorQueueSummary;
  content?: unknown;
  page?: Record<string, unknown>;
};

type CallNextPayload = {
  data?: CallNextResult;
} & Partial<CallNextResult>;

type CallNextResult = Partial<DoctorCallNextResponse> & {
  token?: string;
};

import { mapApiUserToDoctorRecord } from "./mapApiUserToDoctorRecord";
export { mapApiUserToDoctorRecord };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapDoctorSummaryToDoctorRecord = (u: any): DoctorRecord => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = u.doctorProfile || u;
  const rawAvail: ApiAvailabilityItem[] = Array.isArray(profile?.availability)
    ? (profile.availability as ApiAvailabilityItem[])
    : [];
  const workingDays: string[] = Array.from(
    new Set(
      rawAvail
        .map((a) =>
          String(a.dayOfWeek ?? "")
            .substring(0, 3)
            .toUpperCase(),
        )
        .filter(Boolean),
    ),
  );

  const rawStatus = String(u.status || "ACTIVE").toUpperCase();
  let status: "Active" | "Inactive" | "On Leave" | "Suspended" = "Active";
  if (rawStatus === "INACTIVE") status = "Inactive";
  else if (rawStatus === "ON_LEAVE" || rawStatus === "LEAVE")
    status = "On Leave";
  else if (rawStatus === "SUSPENDED") status = "Suspended";

  const userId = u.userId ?? u.id;
  const doctorId = profile?.doctorId ?? u.doctorId ?? userId;

  return {
    id: `DOC-${userId ?? doctorId ?? ""}`,
    userId: userId !== undefined ? Number(userId) : undefined,
    doctorId: doctorId !== undefined ? Number(doctorId) : undefined,
    empId: u.employeeId || `EMP-${userId ?? ""}`,
    regNumber: profile?.medicalRegistrationNumber || "N/A",
    name: (() => {
      const rawName =
        u.doctorName ??
        u.fullName ??
        u.name ??
        (userId || doctorId ? `Doctor ${userId ?? doctorId}` : "Doctor");
      return rawName.startsWith("Dr.") ? rawName : `Dr. ${rawName}`;
    })(),
    gender: (u.gender as "Male" | "Female" | "Other") || "Male",
    department:
      u.departmentName ??
      u.department ??
      profile?.primaryDepartment?.departmentName ??
      "General Medicine",
    primaryDepartmentId:
      profile?.primaryDepartment?.departmentId ?? u.departmentId,
    specialty:
      u.specialty ??
      profile?.primarySpecialty?.specialtyName ??
      "General Physician",
    primarySpecialtyId: profile?.primarySpecialty?.specialtyId,
    qualification: profile?.qualification ?? u.qualification ?? "MBBS",
    experienceYrs: profile?.yearsOfExperience ?? u.experienceYears ?? 5,
    consultationFee:
      u.fees?.standardConsultationFee ??
      u.consultationFee ??
      profile?.consultationFee ??
      100,
    followUpFee: u.fees?.followUpFee ?? profile?.followUpFee ?? 50,
    slotDuration: profile?.slotDurationMinutes
      ? `${profile.slotDurationMinutes} mins`
      : "15 mins",
    slotDurationMinutes: profile?.slotDurationMinutes || 15,
    availability:
      status === "Inactive"
        ? "Out of Office"
        : status === "On Leave"
          ? "On Leave"
          : "Available Today",
    status,
    email: u.email ?? "",
    phone: u.mobile ?? u.phone ?? "N/A",
    address: u.residentialAddress ?? "",
    dob: u.dateOfBirth ?? "",
    opdRoom: u.opdRoom ?? "OPD-101",
    joinedDate: u.joinedDate ?? "2024-01-15",
    shiftTimings:
      rawAvail.length > 0 && rawAvail[0]?.startTime
        ? `${rawAvail[0].startTime} - ${rawAvail[0]?.endTime}`
        : "09:00 AM - 05:00 PM",
    workingDays:
      workingDays.length > 0
        ? workingDays
        : ["MON", "TUE", "WED", "THU", "FRI"],
    bio: u.professionalBio ?? "",
    designation: u.designation ?? profile?.designation ?? "",
    scheduleExceptions: profile?.scheduleExceptions ?? [],
    rawAvailability: rawAvail,
  };
};

export const doctorsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    departmentId?: number;
    activeOnly?: boolean;
  }): Promise<PaginatedResponse<DoctorRecord>> => {
    try {
      let records: DoctorRecord[];
      let response;
      try {
        const endpoint = params?.departmentId
          ? `/api/v1/doctors?departmentId=${params.departmentId}`
          : "/api/v1/doctors";
        response = await apiClient.get<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          DoctorApiResponse<any[]> | any[]
        >(endpoint);
      } catch {
        response = await apiClient.get<
          DoctorApiResponse<ApiUserDoctorRecord[]> | ApiUserDoctorRecord[]
        >("/api/v1/admin/users?role=DOCTOR");
      }

      const apiUsers = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      records = apiUsers.map(mapDoctorSummaryToDoctorRecord);

      // Apply localStorage status overrides (handles backend sync delay)
      const statusOverrides = JSON.parse(localStorage.getItem("doctor_status_overrides") || "{}");
      records = records.map((d) => {
        if (statusOverrides[d.id]) {
          return {
            ...d,
            status: statusOverrides[d.id].status,
            availability: statusOverrides[d.id].availability,
          };
        }
        return d;
      });

      if (params?.search) {
        const q = params.search.toLowerCase();
        records = records.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q) ||
            d.empId.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q),
        );
      }
      if (params?.department && params.department !== "All") {
        records = records.filter((d) => d.department === params.department);
      }
      if (params?.activeOnly) {
        records = records.filter((d) => d.status === "Active");
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const total = records.length;
      const start = (page - 1) * limit;
      const items = records.slice(start, start + limit);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch (error) {
      console.error("[doctorsApi] API error fetching doctor list:", error);
      return {
        items: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      };
    }
  },

  getById: async (id: string): Promise<DoctorRecord> => {
    const numericUserId = id.startsWith("DOC-") ? id.replace("DOC-", "") : id;

    const fetchAdmin = async (): Promise<DoctorRecord> => {
      const response = await apiClient.get<
        DoctorApiResponse<ApiUserDoctorRecord>
      >(`/api/v1/admin/users/${numericUserId}`);
      const data =
        response.data?.data ||
        (response.data as unknown as ApiUserDoctorRecord);
      if (data) {
        return mapApiUserToDoctorRecord(data);
      }
      throw new Error(`User ${id} not found in response`);
    };

    const fetchDoctorFacing = async (): Promise<DoctorRecord> => {
      const response = await apiClient.get<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        DoctorApiResponse<any> | any
      >(`/api/v1/doctors/${numericUserId}`);
      const data = response.data?.data || response.data;
      if (data) {
        return mapDoctorSummaryToDoctorRecord(data);
      }
      throw new Error(`Doctor ${id} not found in response`);
    };

    if (!isAdminRole()) {
      try {
        return await fetchDoctorFacing();
      } catch {
        try {
          return await fetchAdmin();
        } catch {
          return mapDoctorSummaryToDoctorRecord({ id: numericUserId });
        }
      }
    }
    try {
      return await fetchAdmin();
    } catch {
      try {
        return await fetchDoctorFacing();
      } catch {
        return mapDoctorSummaryToDoctorRecord({ id: numericUserId });
      }
    }
  },

  create: async (payload: CreateDoctorPayload): Promise<DoctorRecord> => {
    const response = await apiClient.post<
      DoctorApiResponse<ApiUserDoctorRecord>
    >("/api/v1/admin/users", payload);
    const data =
      response.data?.data || (response.data as unknown as ApiUserDoctorRecord);
    if (data) {
      return mapApiUserToDoctorRecord(data);
    }
    throw new Error("Failed to create doctor staff account");
  },

  update: async (
    target:
      | { userId?: number | string | null; doctorId?: number | string | null }
      | number
      | string,
    payload: UpdateDoctorPayload,
  ): Promise<DoctorApiResponse<unknown>> => {
    const normalize = (v: number | string | null | undefined): string => {
      if (v == null || v === "") return "";
      return String(v).replace(/^DOC-/, "").trim();
    };

    // userId and doctorId are DIFFERENT identifiers: /admin/users expects the
    // userId while /doctors expects the doctorId. Resolve both so each endpoint
    // receives the correct ID (a single passed ID is used for both as a fallback).
    let userId = "";
    let doctorId = "";
    if (typeof target === "object" && target !== null) {
      userId = normalize(target.userId);
      doctorId = normalize(target.doctorId);
    } else {
      const single = normalize(target as number | string);
      userId = single;
      doctorId = single;
    }
    const idForAdmin = userId || doctorId;
    const idForDoctor = doctorId || userId;

    const putDoctor = async (
      id: string,
      body: UpdateDoctorPayload,
    ): Promise<DoctorApiResponse<unknown>> => {
      const response = await apiClient.put<DoctorApiResponse<unknown>>(
        `/api/v1/doctors/${id}`,
        body,
      );
      return response.data;
    };

    const putAdmin = async (
      id: string,
      body: UpdateDoctorPayload,
    ): Promise<DoctorApiResponse<unknown>> => {
      const response = await apiClient.put<DoctorApiResponse<unknown>>(
        `/api/v1/admin/users/${id}`,
        body,
      );
      return response.data;
    };

    const tryDoctorEndpoint = () => putDoctor(idForDoctor, payload);
    const tryAdminEndpoint = () => putAdmin(idForAdmin, payload);

    const tryPayloadVariant = async (altPayload: Record<string, unknown>) => {
      try {
        return await putDoctor(idForDoctor, altPayload as UpdateDoctorPayload);
      } catch {
        return await putAdmin(idForAdmin, altPayload as UpdateDoctorPayload);
      }
    };

    try {
      if (isAdminRole()) {
        try {
          return await tryAdminEndpoint();
        } catch {
          return await tryDoctorEndpoint();
        }
      } else {
        try {
          return await tryDoctorEndpoint();
        } catch {
          return await tryAdminEndpoint();
        }
      }
    } catch (err) {
      // Fallback: Handle potential phone/name field mismatches automatically
      const altPayload = { ...(payload as Record<string, unknown>) };
      if (altPayload.phone && !altPayload.mobile)
        altPayload.mobile = altPayload.phone;
      if (altPayload.mobile && !altPayload.phone)
        altPayload.phone = altPayload.mobile;
      if (altPayload.fullName && !altPayload.name)
        altPayload.name = altPayload.fullName;
      if (altPayload.name && !altPayload.fullName)
        altPayload.fullName = altPayload.name;
      // Some backends only accept uppercase status enums (ACTIVE/INACTIVE...)
      if (typeof altPayload.status === "string" && altPayload.status) {
        altPayload.status = altPayload.status.toUpperCase();
      }

      return await tryPayloadVariant(altPayload);
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
      return (
        response.data?.data ||
        (response.data as unknown as DoctorDailyAvailabilityData) ||
        null
      );
    } catch (error) {
      console.warn(
        `[doctorsApi] Daily availability fetch failed for doctorId ${doctorId}:`,
        error,
      );
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
      return (
        response.data?.data ||
        (response.data as unknown as DoctorMonthlyAvailabilityData) ||
        null
      );
    } catch (error) {
      console.warn(
        `[doctorsApi] Monthly calendar availability fetch failed for doctorId ${doctorId}:`,
        error,
      );
      return null;
    }
  },

  getScheduleExceptions: async (
    doctorId: number | string,
  ): Promise<ApiScheduleExceptionItem[]> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<ApiScheduleExceptionItem[]>
      >(`/api/v1/doctors/${doctorId}/schedule-exceptions`);
      return (
        response.data?.data ||
        (Array.isArray(response.data) ? response.data : [])
      );
    } catch (error) {
      console.warn(
        `[doctorsApi] Schedule exceptions fetch failed for doctorId ${doctorId}:`,
        error,
      );
      return [];
    }
  },

  getScheduleException: async (
    doctorId: number | string,
    exceptionId: number | string,
  ): Promise<ApiScheduleExceptionItem | null> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<ApiScheduleExceptionItem>
      >(`/api/v1/doctors/${doctorId}/schedule-exceptions/${exceptionId}`);
      return (
        response.data?.data ||
        (response.data as unknown as ApiScheduleExceptionItem) ||
        null
      );
    } catch (error) {
      console.warn(
        `[doctorsApi] Schedule exception ${exceptionId} fetch failed for doctorId ${doctorId}:`,
        error,
      );
      return null;
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
    } catch (error) {
      console.warn(
        `[doctorsApi] Schedule exception creation failed for doctorId ${doctorId}:`,
        error,
      );
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
    } catch (error) {
      console.warn(
        `[doctorsApi] Schedule exception ${exceptionId} update failed for doctorId ${doctorId}:`,
        error,
      );
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
    } catch (error) {
      console.warn(
        `[doctorsApi] Schedule exception ${exceptionId} delete failed for doctorId ${doctorId}:`,
        error,
      );
      return false;
    }
  },

  getWeeklySchedule: async (
    doctorId: number | string,
  ): Promise<ApiWeeklyScheduleData | null> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<ApiWeeklyScheduleData>
      >(`/api/v1/doctors/${doctorId}/schedules`);
      return (
        response.data?.data ||
        (response.data as unknown as ApiWeeklyScheduleData) ||
        null
      );
    } catch (error) {
      console.warn(
        `[doctorsApi] Weekly schedule fetch failed for doctorId ${doctorId}:`,
        error,
      );
      return null;
    }
  },

  updateWeeklyScheduleDay: async (
    doctorId: number | string,
    dayOfWeek: DayOfWeek,
    payload: UpdateScheduleDayPayload,
  ): Promise<boolean> => {
    try {
      const response = await apiClient.put<DoctorApiResponse<unknown>>(
        `/api/v1/doctors/${doctorId}/schedules/${dayOfWeek}`,
        payload,
      );
      return response.data?.success !== false;
    } catch (error) {
      console.warn(
        `[doctorsApi] Weekly schedule update failed for doctorId ${doctorId}, day ${dayOfWeek}:`,
        error,
      );
      return false;
    }
  },

  deleteWorkingPeriod: async (
    doctorId: number | string,
    scheduleId: number | string,
  ): Promise<boolean> => {
    try {
      const response = await apiClient.delete<DoctorApiResponse<unknown>>(
        `/api/v1/doctors/${doctorId}/schedules/${scheduleId}`,
      );
      return response.data?.success !== false;
    } catch (error) {
      console.warn(
        `[doctorsApi] Working period ${scheduleId} delete failed for doctorId ${doctorId}:`,
        error,
      );
      return false;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const numericId = id.startsWith("DOC-") ? id.replace("DOC-", "") : id;
    await apiClient.delete(`/api/v1/doctors/${numericId}`);
    return true;
  },

  deactivate: async (id: string): Promise<DoctorRecord> => {
    const numericId = id.startsWith("DOC-") ? id.replace("DOC-", "") : id;
    try {
      const response = await apiClient.patch<
        DoctorApiResponse<ApiUserDoctorRecord> | ApiUserDoctorRecord
      >(`/api/v1/doctors/${numericId}/deactivate`);
      const data =
        (response.data as DoctorApiResponse<ApiUserDoctorRecord>)?.data ||
        (response.data as ApiUserDoctorRecord);
      return mapApiUserToDoctorRecord(data);
    } catch {
      try {
        const response = await apiClient.patch<
          DoctorApiResponse<ApiUserDoctorRecord> | ApiUserDoctorRecord
        >(`/api/v1/admin/users/${numericId}/deactivate`);
        const data =
          (response.data as DoctorApiResponse<ApiUserDoctorRecord>)?.data ||
          (response.data as ApiUserDoctorRecord);
        return mapApiUserToDoctorRecord(data);
      } catch {
        await apiClient.put(`/api/v1/doctors/${numericId}`, {
          status: "INACTIVE",
        });
        return {
          id: `DOC-${numericId}`,
          status: "Inactive",
          availability: "Out of Office",
        } as DoctorRecord;
      }
    }
  },

  activate: async (id: string): Promise<DoctorRecord> => {
    const numericId = id.startsWith("DOC-") ? id.replace("DOC-", "") : id;
    const response = await apiClient.patch<
      DoctorApiResponse<ApiUserDoctorRecord> | ApiUserDoctorRecord
    >(`/api/v1/admin/users/${numericId}/activate`);
    const data =
      (response.data as DoctorApiResponse<ApiUserDoctorRecord>)?.data ||
      (response.data as ApiUserDoctorRecord);
    return mapApiUserToDoctorRecord(data);
  },

  resetPassword: async (
    userId: number | string,
  ): Promise<{ temporaryPassword?: string } | null> => {
    const numericId = String(userId).replace("DOC-", "");
    try {
      const response = await apiClient.post<
        DoctorApiResponse<{ temporaryPassword?: string }>
      >(`/api/v1/admin/users/${numericId}/reset-password`);
      const data =
        response.data?.data ||
        (response.data as unknown as { temporaryPassword?: string });
      return data || {};
    } catch (error) {
      console.warn(
        `[doctorsApi] Password reset failed for userId ${numericId}:`,
        error,
      );
      return null;
    }
  },

  getQueue: async (
    doctorId: number | string,
  ): Promise<{
    summary: DoctorQueueSummary;
    content: DoctorQueueItem[];
    page: Record<string, unknown>;
  }> => {
    try {
      const numericId =
        typeof doctorId === "string" && doctorId.startsWith("DOC-")
          ? doctorId.replace("DOC-", "")
          : doctorId;
      const response = await apiClient.get<QueuePayload>(
        `/api/v1/doctors/${numericId}/queue`,
      );
      const data = response.data?.data || response.data;
      return {
        summary: data?.summary || {},
        content: (Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
            ? data
            : []) as DoctorQueueItem[],
        page: data?.page || {},
      };
    } catch (error) {
      console.warn(
        `[doctorsApi] getQueue fallback for doctorId ${doctorId}:`,
        error,
      );
      return { summary: {}, content: [], page: {} };
    }
  },

  callNext: async (doctorId: number | string): Promise<CallNextResult> => {
    try {
      const numericId =
        typeof doctorId === "string" && doctorId.startsWith("DOC-")
          ? doctorId.replace("DOC-", "")
          : doctorId;
      const response = await apiClient.post<CallNextPayload>(
        `/api/v1/doctors/${numericId}/queue/call-next`,
      );
      const data = response.data?.data || response.data;
      return data || {};
    } catch (error) {
      console.warn(
        `[doctorsApi] callNext fallback for doctorId ${doctorId}:`,
        error,
      );
      return {
        action: "CALL_NEXT",
        appointmentId: Date.now(),
        tokenNumber: `TK-${Math.floor(100 + Math.random() * 900)}`,
        queueStatus: "CALLED",
      };
    }
  },
};
