import { apiClient, axios } from "../../../lib/axios";
import type { User, ApiResponse } from "../../auth/types/auth.types";
import type {
  AdminCreateStaffData,
  AdminCreateStaffResponse,
  AdminUpdateStaffData,
} from "../types/users.types";

export const usersApi = {
  // 1. Admin Creates Staff User (POST /api/v1/admin/users)
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
  ): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
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
      const response = await apiClient.get<ApiResponse<User[]>>(
        "/api/v1/admin/users",
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
          : "Failed to retrieve user accounts";
      throw new Error(msg, { cause: error });
    }
  },

  // 7. Admin Gets User By ID (GET /api/v1/admin/users/{userId})
  adminGetUserById: async (
    userId: number | string,
  ): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
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
