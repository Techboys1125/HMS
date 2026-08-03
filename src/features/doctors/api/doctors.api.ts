import { apiClient } from "../../../lib/axios";
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
} from "../types/doctors.types";

export const mapApiUserToDoctorRecord = (
  u: ApiUserDoctorRecord,
): DoctorRecord => {
  const profile = u.doctorProfile;
  const primaryDept =
    profile?.primaryDepartment?.departmentName || "General Medicine";
  const primarySpec =
    profile?.primarySpecialty?.specialtyName || "General Physician";

  const rawAvail = profile?.availability || [];
  const workingDays = Array.from(
    new Set(rawAvail.map((a) => a.dayOfWeek.substring(0, 3).toUpperCase())),
  );

  let shiftTimings = "09:00 AM - 05:00 PM";
  if (rawAvail.length > 0 && rawAvail[0].startTime && rawAvail[0].endTime) {
    shiftTimings = `${rawAvail[0].startTime} - ${rawAvail[0].endTime}`;
  }

  const rawStatus = (u.status || "ACTIVE").toUpperCase();
  let status: "Active" | "Inactive" | "On Leave" | "Suspended" = "Active";
  if (rawStatus === "INACTIVE") status = "Inactive";
  else if (rawStatus === "ON_LEAVE" || rawStatus === "LEAVE")
    status = "On Leave";
  else if (rawStatus === "SUSPENDED") status = "Suspended";

  return {
    id: `DOC-${u.userId}`,
    userId: u.userId,
    doctorId: profile?.doctorId,
    empId: u.employeeId || `EMP-${u.userId}`,
    regNumber: profile?.medicalRegistrationNumber || "N/A",
    name: u.fullName.startsWith("Dr.") ? u.fullName : `Dr. ${u.fullName}`,
    gender: (u.gender as "Male" | "Female" | "Other") || "Male",
    department: primaryDept,
    primaryDepartmentId: profile?.primaryDepartment?.departmentId,
    specialty: primarySpec,
    primarySpecialtyId: profile?.primarySpecialty?.specialtyId,
    qualification: profile?.qualification || "MBBS",
    experienceYrs: profile?.yearsOfExperience || 5,
    consultationFee: profile?.consultationFee || 100,
    followUpFee: profile?.followUpFee || 50,
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
    email: u.email,
    phone: u.mobile || "N/A",
    address: u.residentialAddress || "",
    dob: u.dateOfBirth || "",
    opdRoom: "OPD-101",
    joinedDate: "2024-01-15",
    shiftTimings,
    workingDays:
      workingDays.length > 0
        ? workingDays
        : ["MON", "TUE", "WED", "THU", "FRI"],
    bio: u.professionalBio || "",
    scheduleExceptions: profile?.scheduleExceptions || [],
    rawAvailability: rawAvail,
  };
};

export const doctorsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
  }): Promise<PaginatedResponse<DoctorRecord>> => {
    try {
      const response = await apiClient.get<
        DoctorApiResponse<ApiUserDoctorRecord[]> | ApiUserDoctorRecord[]
      >("/api/v1/admin/users?role=DOCTOR");

      const apiUsers = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      let records = apiUsers.map(mapApiUserToDoctorRecord);

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
    const response = await apiClient.get<
      DoctorApiResponse<ApiUserDoctorRecord>
    >(`/api/v1/admin/users/${numericUserId}`);
    const data =
      response.data?.data || (response.data as unknown as ApiUserDoctorRecord);
    if (data) {
      return mapApiUserToDoctorRecord(data);
    }
    throw new Error(`User ${id} not found in response`);
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
    userId: number | string,
    payload: UpdateDoctorPayload,
  ): Promise<DoctorApiResponse<unknown>> => {
    const numericUserId =
      typeof userId === "string" && userId.startsWith("DOC-")
        ? userId.replace("DOC-", "")
        : userId;

    const response = await apiClient.put<DoctorApiResponse<unknown>>(
      `/api/v1/admin/users/${numericUserId}`,
      payload,
    );
    return response.data;
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

  delete: async (id: string): Promise<boolean> => {
    const numericId = id.startsWith("DOC-") ? id.replace("DOC-", "") : id;
    await apiClient.delete(`/api/v1/doctors/${numericId}`);
    return true;
  },

  deactivate: async (id: string): Promise<DoctorRecord> => {
    const numericId = id.startsWith("DOC-") ? id.replace("DOC-", "") : id;
    const response = await apiClient.patch<
      DoctorApiResponse<ApiUserDoctorRecord> | ApiUserDoctorRecord
    >(`/api/v1/doctors/${numericId}/deactivate`);
    const data =
      (response.data as DoctorApiResponse<ApiUserDoctorRecord>)?.data ||
      (response.data as ApiUserDoctorRecord);
    return mapApiUserToDoctorRecord(data);
  },

  /**
   * GET /api/v1/doctors/{doctorId}/queue
   */
  getQueue: async (
    doctorId: number | string,
  ): Promise<{
    summary: any;
    content: any[];
    page: any;
  }> => {
    try {
      const numericId =
        typeof doctorId === "string" && doctorId.startsWith("DOC-")
          ? doctorId.replace("DOC-", "")
          : doctorId;
      const response = await apiClient.get<any>(
        `/api/v1/doctors/${numericId}/queue`,
      );
      const data = response.data?.data || response.data;
      return {
        summary: data?.summary || {},
        content: Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
            ? data
            : [],
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

  /**
   * POST /api/v1/doctors/{doctorId}/queue/call-next
   */
  callNext: async (doctorId: number | string): Promise<any> => {
    try {
      const numericId =
        typeof doctorId === "string" && doctorId.startsWith("DOC-")
          ? doctorId.replace("DOC-", "")
          : doctorId;
      const response = await apiClient.post<any>(
        `/api/v1/doctors/${numericId}/queue/call-next`,
      );
      return response.data;
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
