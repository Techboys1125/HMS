import { apiClient, axios } from "../../../lib/axios";
import type { User, ApiResponse } from "../../auth/types/auth.types";
import type {
  AdminCreateStaffData,
  AdminCreateStaffResponse,
  AdminUpdateStaffData,
  UserDetailData,
} from "../types/users.types";

export const usersApi = {
  // 1. Admin Creates Staff User (POST /api/v1/admin/users)
  /**
   * cURL:
   * curl -X POST http://192.168.1.44:8081/api/v1/admin/users \
   *   -H "Content-Type: application/json" \
   *   -H "Authorization: Bearer <ACCESS_TOKEN>" \
   *   -d '{"email":"doctor@gmail.com","password":"Password@123","fullName":"Dr. Arjun Mehta","role":"DOCTOR","mobile":"+919876543210","gender":"MALE","dateOfBirth":"1980-05-15","residentialAddress":"123 Main St, City","doctorProfile":{"medicalRegistrationNumber":"MED12345","qualification":"MBBS, MD","yearsOfExperience":15,"primaryDepartmentId":2,"primarySpecialtyId":1,"consultationFee":800,"followUpFee":500,"slotDurationMinutes":15,"availability":[{"dayOfWeek":"MONDAY","startTime":"09:00","endTime":"17:00"}]}}'
   */
  adminCreateStaff: async (
    data: AdminCreateStaffData,
  ): Promise<AdminCreateStaffResponse> => {
    try {
      const response = await apiClient.post<AdminCreateStaffResponse>(
        "/api/v1/admin/users",
        data,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data as
          { message?: string } | undefined;
        if (resData?.message) {
          throw new Error(resData.message, { cause: error });
        }
      }
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to create staff account";
      throw new Error(msg, { cause: error });
    }
  },

  // 2. Admin Deactivates User (PATCH /api/v1/admin/users/{userId}/deactivate)
  adminDeactivateUser: async (
    userId: number | string,
    reason: string,
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse>(
        `/api/v1/admin/users/${userId}/deactivate`,
        { reason },
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data as
          { message?: string } | undefined;
        if (resData?.message) {
          throw new Error(resData.message, { cause: error });
        }
      }
      const msg =
        error instanceof Error ? error.message : "Failed to deactivate user";
      throw new Error(msg, { cause: error });
    }
  },

  // 3. Admin Activates User (PATCH /api/v1/admin/users/{userId}/activate)
  adminActivateUser: async (userId: number | string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse>(
        `/api/v1/admin/users/${userId}/activate`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data as
          { message?: string } | undefined;
        if (resData?.message) {
          throw new Error(resData.message, { cause: error });
        }
      }
      const msg =
        error instanceof Error ? error.message : "Failed to activate user";
      throw new Error(msg, { cause: error });
    }
  },

  // 4. Admin Updates Staff Profile (PUT /api/v1/admin/users/{userId})
  adminUpdateStaff: async (
    userId: number | string,
    data: AdminUpdateStaffData,
  ): Promise<ApiResponse<UserDetailData>> => {
    try {
      const response = await apiClient.put<ApiResponse<UserDetailData>>(
        `/api/v1/admin/users/${userId}`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data as
          { message?: string } | undefined;
        if (resData?.message) {
          throw new Error(resData.message, { cause: error });
        }
      }
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to update staff profile";
      throw new Error(msg, { cause: error });
    }
  },

  // 5. Admin Resets User Password (POST /api/v1/admin/users/{userId}/reset-password)
  adminResetPassword: async (
    userId: number | string,
  ): Promise<ApiResponse<{ temporaryPassword: string }>> => {
    try {
      const response = await apiClient.post<
        ApiResponse<{ temporaryPassword: string }>
      >(`/api/v1/admin/users/${userId}/reset-password`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data as
          { message?: string } | undefined;
        if (resData?.message) {
          throw new Error(resData.message, { cause: error });
        }
      }
      const msg =
        error instanceof Error ? error.message : "Failed to reset password";
      throw new Error(msg, { cause: error });
    }
  },

  // 6. Admin Gets All Users (GET /api/v1/admin/users)
  adminGetUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<User[]> | User[]>(
        "/api/v1/admin/users",
      );
      const resData = response.data;
      if (Array.isArray(resData)) {
        return {
          success: true,
          data: resData,
          message: "",
        };
      }
      if (
        resData &&
        typeof resData === "object" &&
        "data" in resData &&
        Array.isArray(resData.data)
      ) {
        return {
          success: resData.success !== false,
          data: resData.data,
          message: resData.message,
        };
      }
      return {
        success: true,
        data: [],
        message: "",
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data as
          { message?: string } | undefined;
        if (resData?.message) {
          throw new Error(resData.message, { cause: error });
        }
      }
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to retrieve user accounts";
      throw new Error(msg, { cause: error });
    }
  },

  // 7. Admin Gets User By ID (GET /api/v1/admin/users/{userId})
  adminGetUserById: async (
    userId: number | string,
  ): Promise<ApiResponse<UserDetailData>> => {
    try {
      const response = await apiClient.get<ApiResponse<UserDetailData>>(
        `/api/v1/admin/users/${userId}`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data as
          { message?: string } | undefined;
        if (resData?.message) {
          throw new Error(resData.message, { cause: error });
        }
      }
      const msg =
        error instanceof Error ? error.message : "Failed to fetch user details";
      throw new Error(msg, { cause: error });
    }
  },
};
