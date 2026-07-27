import { apiClient, axios } from "../../../lib/axios";
import type {
  PatientRegistrationData,
  PatientRegistrationResponse,
  ResendVerificationData,
  LoginCredentials,
  LoginResponse,
  TokenRefreshResponse,
  ForgotPasswordData,
  VerifyResetOTPData,
  VerifyResetOTPResponse,
  ResetPasswordData,
  ChangePasswordData,
  ApiResponse,
  User,
  VerifyEmailData,
} from "../types/auth.types";

export const authApi = {
  // 1. Patient Registration (POST /api/v1/auth/patient/register)
  registerPatient: async (
    data: PatientRegistrationData
  ): Promise<PatientRegistrationResponse> => {
    try {
      const response = await apiClient.post<PatientRegistrationResponse>(
        "/api/v1/auth/patient/register",
        data
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to register patient");
    }
  },

  // 2. Resend Verification OTP (POST /api/v1/auth/resend-verification)
  resendVerificationOTP: async (
    data: ResendVerificationData
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/api/v1/auth/resend-verification",
        data
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to resend verification OTP");
    }
  },

  // 3. User / Doctor / Patient Login (POST /api/v1/auth/login)
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/api/v1/auth/login",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Invalid email or password");
    }
  },

  // 4. Access Token Refresh (POST /api/v1/auth/refresh)
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    try {
      const response = await apiClient.post<TokenRefreshResponse>(
        "/api/v1/auth/refresh",
        { refreshToken }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to refresh token");
    }
  },

  // 5. Get Profile Details (GET /api/v1/auth/me)
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response =
        await apiClient.get<ApiResponse<User>>("/api/v1/auth/me");
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to retrieve profile details");
    }
  },

  // 6. User Logout (POST /api/v1/auth/logout)
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>("/api/v1/auth/logout");
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to logout");
    }
  },

  // 7. Forgot Password Trigger (POST /api/v1/auth/forgot-password)
  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/api/v1/auth/forgot-password",
        data
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to send reset instructions");
    }
  },

  // 8. Verify Forgot Password OTP (POST /api/v1/auth/verify-reset-otp)
  verifyResetOTP: async (
    data: VerifyResetOTPData
  ): Promise<VerifyResetOTPResponse> => {
    try {
      const response = await apiClient.post<VerifyResetOTPResponse>(
        "/api/v1/auth/verify-reset-otp",
        data
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to verify OTP");
    }
  },

  // 9. Reset Password using Reset Token (POST /api/v1/auth/reset-password)
  resetPassword: async (data: ResetPasswordData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/api/v1/auth/reset-password",
        data
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to reset password");
    }
  },

  // 10. Verify Email (POST /api/v1/auth/verify-email)
  verifyEmail: async (data: VerifyEmailData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/api/v1/auth/verify-email",
        data
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to verify email");
    }
  },

  // 11. Forced / General Password Change (POST /api/v1/auth/change-password)
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/api/v1/auth/change-password",
        data
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message as string);
      }
      throw new Error(error?.message || "Failed to change password");
    }
  },
};
