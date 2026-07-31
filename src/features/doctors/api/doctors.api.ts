import { apiClient } from "../../../lib/axios";
import type {
  DoctorRecord,
  DoctorApiResponse,
  PaginatedResponse,
  ApiUserDoctorRecord,
  CreateDoctorPayload,
  UpdateDoctorPayload,
  DoctorDailyAvailabilityData,
  ApiScheduleExceptionItem,
} from "../types/doctors.types";
export const mapApiUserToDoctorRecord = (u: ApiUserDoctorRecord): DoctorRecord => {
  const profile = u.doctorProfile;
  const primaryDept = profile?.primaryDepartment?.departmentName || "General Medicine";
  const primarySpec = profile?.primarySpecialty?.specialtyName || "General Physician";
  
  const rawAvail = profile?.availability || [];
  const workingDays = Array.from(
    new Set(rawAvail.map((a) => a.dayOfWeek.substring(0, 3).toUpperCase()))
  );

  let shiftTimings = "09:00 AM - 05:00 PM";
  if (rawAvail.length > 0 && rawAvail[0].startTime && rawAvail[0].endTime) {
    shiftTimings = `${rawAvail[0].startTime} - ${rawAvail[0].endTime}`;
  }

  const rawStatus = (u.status || "ACTIVE").toUpperCase();
  let status: "Active" | "Inactive" | "On Leave" | "Suspended" = "Active";
  if (rawStatus === "INACTIVE") status = "Inactive";
  else if (rawStatus === "ON_LEAVE" || rawStatus === "LEAVE") status = "On Leave";
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
    slotDuration: profile?.slotDurationMinutes ? `${profile.slotDurationMinutes} mins` : "15 mins",
    slotDurationMinutes: profile?.slotDurationMinutes || 15,
    availability: status === "Inactive" ? "Out of Office" : status === "On Leave" ? "On Leave" : "Available Today",
    status,
    email: u.email,
    phone: u.mobile || "N/A",
    address: u.residentialAddress || "",
    dob: u.dateOfBirth || "",
    opdRoom: "OPD-101",
    joinedDate: "2024-01-15",
    shiftTimings,
    workingDays: workingDays.length > 0 ? workingDays : ["MON", "TUE", "WED", "THU", "FRI"],
    bio: u.professionalBio || "",
    scheduleExceptions: profile?.scheduleExceptions || [],
    rawAvailability: rawAvail,
  };
};

export const doctorsApi = {
  /**
   * cURL command for testing GET Doctor/Staff List:
   * curl -X 'GET' \
   *   'https://safe-hands-hms-backend.onrender.com/api/v1/admin/users?role=DOCTOR' \
   *   -H 'accept: application/json' \
   *   -H 'Authorization: Bearer <TOKEN>'
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
  }): Promise<PaginatedResponse<DoctorRecord>> => {
    try {
      const response = await apiClient.get<DoctorApiResponse<ApiUserDoctorRecord[]>>(
        "/api/v1/admin/users?role=DOCTOR"
      );
      const apiUsers = response.data.data || [];
      let records = apiUsers.map(mapApiUserToDoctorRecord);

      if (params?.search) {
        const q = params.search.toLowerCase();
        records = records.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q) ||
            d.empId.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q)
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

  /**
   * cURL command for testing GET Doctor Detail by User ID:
   * curl -X 'GET' \
   *   'https://safe-hands-hms-backend.onrender.com/api/v1/admin/users/1' \
   *   -H 'accept: application/json' \
   *   -H 'Authorization: Bearer <TOKEN>'
   */
  getById: async (id: string): Promise<DoctorRecord> => {
    const numericUserId = id.startsWith("DOC-") ? id.replace("DOC-", "") : id;
    const response = await apiClient.get<DoctorApiResponse<ApiUserDoctorRecord>>(
      `/api/v1/admin/users/${numericUserId}`
    );
    if (response.data.data) {
      return mapApiUserToDoctorRecord(response.data.data);
    }
    throw new Error(`User ${id} not found in response`);
  },

  /**
   * cURL command for testing POST Create Staff Account (Doctor):
   * curl -X 'POST' \
   *   'https://safe-hands-hms-backend.onrender.com/api/v1/admin/users' \
   *   -H 'accept: application/json' \
   *   -H 'Authorization: Bearer <TOKEN>' \
   *   -H 'Content-Type: application/json' \
   *   -d '{
   *     "fullName": "Dr. Arjun Mehta",
   *     "email": "arjun.mehta@citygeneral.org",
   *     "mobile": "+15552345678",
   *     "gender": "Male",
   *     "dateOfBirth": "1985-05-14",
   *     "role": "DOCTOR",
   *     "medicalRegistrationNumber": "MCI-REG-847291",
   *     "qualification": "MBBS, MD, DM (Cardiology)",
   *     "yearsOfExperience": 14,
   *     "primaryDepartmentId": 1,
   *     "primarySpecialtyId": 5,
   *     "consultationFee": 150,
   *     "followUpFee": 80,
   *     "slotDurationMinutes": 15,
   *     "availability": [
   *       { "availabilityId": 1, "dayOfWeek": "MONDAY", "startTime": "09:00:00", "endTime": "16:00:00" }
   *     ],
   *     "scheduleExceptions": [
   *       { "exceptionDate": "2026-08-15", "reason": "National Independence Day Hospital Holiday" }
   *     ],
   *     "sendCredentials": true
   *   }'
   */
  create: async (payload: CreateDoctorPayload): Promise<DoctorRecord> => {
    const response = await apiClient.post<DoctorApiResponse<ApiUserDoctorRecord>>(
      "/api/v1/admin/users",
      payload
    );
    if (response.data.data) {
      return mapApiUserToDoctorRecord(response.data.data);
    }
    throw new Error("Failed to create doctor staff account");
  },

  /**
   * cURL command for testing PUT Update Doctor Detail:
   * curl -X 'PUT' \
   *   'https://safe-hands-hms-backend.onrender.com/api/v1/admin/users/1' \
   *   -H 'accept: application/json' \
   *   -H 'Authorization: Bearer <TOKEN>' \
   *   -H 'Content-Type: application/json' \
   *   -d '{
   *     "fullName": "Dr. Arjun Mehta",
   *     "email": "arjun.mehta@citygeneral.org",
   *     "consultationFee": 160,
   *     "followUpFee": 90,
   *     "changeReason": "Updated fee structure"
   *   }'
   */
  update: async (
    userId: number | string,
    payload: UpdateDoctorPayload
  ): Promise<DoctorApiResponse<unknown>> => {
    const numericUserId = typeof userId === "string" && userId.startsWith("DOC-")
      ? userId.replace("DOC-", "")
      : userId;

    const response = await apiClient.put<DoctorApiResponse<unknown>>(
      `/api/v1/admin/users/${numericUserId}`,
      payload
    );
    return response.data;
  },

  /**
   * cURL command for testing GET Daily Doctor Availability Slots:
   * curl -X 'GET' \
   *   'https://safe-hands-hms-backend.onrender.com/api/v1/doctors/1/availability?date=2026-07-29' \
   *   -H 'accept: application/json' \
   *   -H 'Authorization: Bearer <TOKEN>'
   */
  getDailyAvailability: async (
    doctorId: number | string,
    date: string
  ): Promise<DoctorDailyAvailabilityData | null> => {
    try {
      const response = await apiClient.get<DoctorApiResponse<DoctorDailyAvailabilityData>>(
        `/api/v1/doctors/${doctorId}/availability?date=${date}`
      );
      return response.data.data || null;
    } catch (error) {
      console.warn(`[doctorsApi] Daily availability fetch failed for doctorId ${doctorId}:`, error);
      return null;
    }
  },

  /**
   * cURL command for testing GET Doctor Schedule Exceptions:
   * curl -X 'GET' \
   *   'https://safe-hands-hms-backend.onrender.com/api/v1/doctors/1/schedule-exceptions' \
   *   -H 'accept: application/json' \
   *   -H 'Authorization: Bearer <TOKEN>'
   */
  getScheduleExceptions: async (
    doctorId: number | string
  ): Promise<ApiScheduleExceptionItem[]> => {
    try {
      const response = await apiClient.get<DoctorApiResponse<ApiScheduleExceptionItem[]>>(
        `/api/v1/doctors/${doctorId}/schedule-exceptions`
      );
      return response.data.data || [];
    } catch (error) {
      console.warn(`[doctorsApi] Schedule exceptions fetch failed for doctorId ${doctorId}:`, error);
      return [];
    }
  },

  delete: async (id: string): Promise<boolean> => {
    await apiClient.delete(`/api/v1/doctors/${id}`);
    return true;
  },

  deactivate: async (id: string): Promise<DoctorRecord> => {
    const response = await apiClient.patch<DoctorApiResponse<DoctorRecord>>(
      `/api/v1/doctors/${id}/deactivate`
    );
    return response.data.data as DoctorRecord;
  },
};
