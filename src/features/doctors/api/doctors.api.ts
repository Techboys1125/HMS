import { apiClient, axios } from "../../../lib/axios";
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

export const mapDoctorSummaryToDoctorRecord = (u: unknown): DoctorRecord => {
  const userObj = (u && typeof u === "object" ? u : {}) as Record<
    string,
    unknown
  >;
  const profileObj = (
    userObj.doctorProfile && typeof userObj.doctorProfile === "object"
      ? userObj.doctorProfile
      : userObj
  ) as Record<string, unknown>;

  const primaryDept = (
    profileObj?.primaryDepartment &&
    typeof profileObj.primaryDepartment === "object"
      ? profileObj.primaryDepartment
      : {}
  ) as Record<string, unknown>;
  const primarySpec = (
    profileObj?.primarySpecialty &&
    typeof profileObj.primarySpecialty === "object"
      ? profileObj.primarySpecialty
      : {}
  ) as Record<string, unknown>;

  const rawAvail = (
    Array.isArray(profileObj.availability) ? profileObj.availability : []
  ) as ApiAvailabilityItem[];

  const workingDays: string[] = Array.from(
    new Set(
      rawAvail
        .map((a) =>
          String(a?.dayOfWeek ?? "")
            .substring(0, 3)
            .toUpperCase(),
        )
        .filter(Boolean),
    ),
  );

  const rawStatus = String(userObj.status || "ACTIVE").toUpperCase();
  let status: "Active" | "Inactive" | "On Leave" | "Suspended" = "Active";
  if (rawStatus === "INACTIVE") status = "Inactive";
  else if (rawStatus === "ON_LEAVE" || rawStatus === "LEAVE")
    status = "On Leave";
  else if (rawStatus === "SUSPENDED") status = "Suspended";

  const rawDoctorId = profileObj.doctorId ?? userObj.doctorId ?? 0;
  const hasExplicitDoctorId =
    Number.isFinite(rawDoctorId) && Number(rawDoctorId) > 0;
  const rawUserId = hasExplicitDoctorId
    ? (userObj.userId ?? profileObj.userId ?? 0)
    : (userObj.userId ?? userObj.id ?? profileObj.userId ?? profileObj.id ?? 0);
  const finalDoctorId = hasExplicitDoctorId ? rawDoctorId : rawUserId;

  return {
    id: `DOC-${finalDoctorId || rawUserId || ""}`,
    userId: rawUserId !== undefined ? Number(rawUserId) : undefined,
    doctorId: finalDoctorId !== undefined ? Number(finalDoctorId) : undefined,
    empId: String(
      userObj.employeeId ||
        profileObj?.employeeId ||
        userObj.empId ||
        profileObj?.empId ||
        "",
    ),
    regNumber: String(
      profileObj?.medicalRegistrationNumber ||
        userObj.medicalRegistrationNumber ||
        profileObj?.regNumber ||
        userObj.regNumber ||
        "",
    ),
    name: (() => {
      const rawName = String(
        userObj.doctorName ??
          userObj.fullName ??
          userObj.name ??
          (rawUserId || finalDoctorId
            ? `Doctor ${rawUserId ?? finalDoctorId}`
            : "Doctor"),
      );
      return rawName.startsWith("Dr.") ? rawName : `Dr. ${rawName}`;
    })(),
    gender: (userObj.gender as "Male" | "Female" | "Other") || "Male",
    department: String(
      userObj.departmentName ??
        userObj.department ??
        primaryDept.departmentName ??
        profileObj?.departmentName ??
        profileObj?.department ??
        userObj.primaryDepartmentName ??
        "",
    ),
    primaryDepartmentId:
      Number(primaryDept.departmentId ?? userObj.departmentId) || undefined,
    specialty: String(
      userObj.specialtyName ??
        userObj.specialty ??
        primarySpec.specialtyName ??
        profileObj?.specialtyName ??
        profileObj?.specialty ??
        userObj.primarySpecialtyName ??
        "",
    ),
    primarySpecialtyId: Number(primarySpec.specialtyId) || undefined,
    qualification: String(
      profileObj?.qualification ?? userObj.qualification ?? "",
    ),
    experienceYrs: Number(
      profileObj?.yearsOfExperience ??
        profileObj?.experienceYrs ??
        userObj.experienceYears ??
        userObj.yearsOfExperience ??
        userObj.experienceYrs ??
        userObj.experience ??
        0,
    ),
    consultationFee: Number(
      (userObj.fees as Record<string, unknown>)?.standardConsultationFee ??
        userObj.consultationFee ??
        profileObj?.consultationFee ??
        0,
    ),
    followUpFee: Number(
      (userObj.fees as Record<string, unknown>)?.followUpFee ??
        profileObj?.followUpFee ??
        0,
    ),
    slotDuration: profileObj?.slotDurationMinutes
      ? `${profileObj.slotDurationMinutes} mins`
      : "",
    slotDurationMinutes: Number(profileObj?.slotDurationMinutes) || 0,
    availability:
      status === "Inactive"
        ? "Out of Office"
        : status === "On Leave"
          ? "On Leave"
          : "Available Today",
    status,
    email: String(userObj.email ?? ""),
    phone: String(userObj.mobile ?? userObj.phone ?? ""),
    address: String(userObj.residentialAddress ?? ""),
    dob: String(userObj.dateOfBirth ?? ""),
    opdRoom: String(userObj.opdRoom ?? ""),
    joinedDate: String(userObj.joinedDate ?? ""),
    shiftTimings:
      rawAvail.length > 0 && rawAvail[0]?.startTime
        ? `${rawAvail[0].startTime} - ${rawAvail[0]?.endTime}`
        : "",
    workingDays: workingDays.length > 0 ? workingDays : [],
    bio: String(userObj.professionalBio ?? ""),
    designation: String(userObj.designation ?? profileObj?.designation ?? ""),
    scheduleExceptions: Array.isArray(profileObj?.scheduleExceptions)
      ? profileObj.scheduleExceptions
      : [],
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
          DoctorApiResponse<unknown[]> | unknown[]
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
      const statusOverrides = JSON.parse(
        localStorage.getItem("doctor_status_overrides") || "{}",
      );
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
    const currentUser = useAuthStore.getState().user;
    const currentUserId = String(currentUser?.id ?? "");
    const currentDoctorId = String(
      currentUser?.doctorId ?? currentUser?.doctorProfile?.doctorId ?? "",
    );

    const fetchMe = async (): Promise<DoctorRecord> => {
      const response = await apiClient.get<
        DoctorApiResponse<ApiUserDoctorRecord> | ApiUserDoctorRecord
      >("/api/v1/auth/me");
      const data =
        (response.data as DoctorApiResponse<ApiUserDoctorRecord>)?.data ||
        (response.data as ApiUserDoctorRecord);
      if (!data || (!data.fullName && !data.email)) {
        throw new Error("Current user profile not found");
      }
      const anyData = data as unknown as Record<string, unknown>;
      const hasDoctorProfile =
        anyData.doctorProfile ||
        anyData.departmentName ||
        anyData.specialtyName ||
        anyData.yearsOfExperience ||
        anyData.qualification;
      if (!hasDoctorProfile) {
        throw new Error("Auth/me response lacks doctorProfile details");
      }
      return mapApiUserToDoctorRecord(data);
    };

    const fetchAdmin = async (targetUserId?: string): Promise<DoctorRecord> => {
      const adminId = targetUserId || numericUserId;
      try {
        const response = await apiClient.get<
          DoctorApiResponse<ApiUserDoctorRecord>
        >(`/api/v1/admin/users/${adminId}`);
        const data =
          response.data?.data ||
          (response.data as unknown as ApiUserDoctorRecord);
        if (data && (data.userId || data.id || data.fullName || data.name)) {
          return mapApiUserToDoctorRecord(data);
        }
      } catch {
        // Handled silently
      }
      throw new Error(`User ${id} not found in response`);
    };

    const fetchDoctorFacing = async (): Promise<DoctorRecord> => {
      try {
        const response = await apiClient.get<
          DoctorApiResponse<ApiUserDoctorRecord> | ApiUserDoctorRecord
        >(`/api/v1/doctors/${numericUserId}`);
        const data = response.data?.data || response.data;
        if (data && (data.userId || data.fullName || data.name || data.id)) {
          if (data.userId || data.fullName || data.name) {
            return mapApiUserToDoctorRecord(data);
          }
          return mapDoctorSummaryToDoctorRecord(data);
        }
      } catch {
        // Handled silently
      }
      throw new Error(`Doctor ${id} not found in response`);
    };

    const fallbackRecord = (): DoctorRecord => {
      if (currentUser) {
        return mapApiUserToDoctorRecord(
          currentUser as unknown as ApiUserDoctorRecord,
        );
      }
      return mapDoctorSummaryToDoctorRecord({ id: numericUserId });
    };

    const isSelfFetch =
      !numericUserId ||
      numericUserId === "me" ||
      numericUserId === currentUserId ||
      numericUserId === currentDoctorId;

    if (isSelfFetch) {
      try {
        return await fetchMe();
      } catch {
        // Continue
      }
    }

    try {
      return await fetchAdmin(numericUserId);
    } catch {
      try {
        return await fetchDoctorFacing();
      } catch {
        return fallbackRecord();
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
    let userId: string;
    let doctorId: string;
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
      console.log(err);

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
      const rawData = response.data?.data || response.data;
      const list = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.content)
          ? rawData.content
          : [];
      return list.map((item: ApiScheduleExceptionItem) => ({
        id: item.exceptionId || item.id,
        doctorId: Number(doctorId),
        exceptionDate: item.date || item.exceptionDate || item.startDate || "",
        startDate: item.startDate || item.date || "",
        endDate: item.endDate || item.date || "",
        reason: item.reason || "",
        exceptionType:
          item.exceptionType ||
          item.type ||
          (item.isAvailable === false ? "VACATION" : "OTHER"),
        isFullDay: item.isFullDay ?? item.fullDay ?? true,
        action: item.action || "BLOCK_APPOINTMENTS",
        status: item.status || "ACTIVE",
      }));
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
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          console.error("[doctorsApi] Queue fetch failed:", data.message);
          throw new Error(data.message, { cause: error });
        }
      }
      console.error("[doctorsApi] Queue fetch failed:", error);
      throw error;
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
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        if (data?.message) {
          throw new Error(data.message, { cause: error });
        }
      }
      throw error;
    }
  },
};
