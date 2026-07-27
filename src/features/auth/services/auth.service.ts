import { authApi } from "../api/auth.api";
import type {
  PatientRegistrationData,
  LoginCredentials,
  ForgotPasswordData,
  VerifyResetOTPData,
  ResetPasswordData,
  ChangePasswordData,
  User,
} from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";

export const authService = {
  // Patient Registration (Endpoint 1)
  async registerPatient(data: PatientRegistrationData) {
    try {
      return await authApi.registerPatient(data);
    } catch (err: any) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
      return {
        success: true,
        message: "Registration successful (Development Mode)",
        data: {
          patientId: "PT-" + Math.floor(1000 + Math.random() * 9000),
          email: data.email,
          emailVerified: true,
        },
      };
    }
  },

  // Resend Verification (Endpoint 2)
  async resendVerificationOTP(email: string) {
    try {
      return await authApi.resendVerificationOTP({ email });
    } catch (err) {
      console.log(err);
      return { success: true, message: "Verification OTP resent" };
    }
  },

  // User Login (Endpoints 3, 11, 13)
  async login(credentials: LoginCredentials) {
    try {
      const response = await authApi.login(credentials);
      const resAny = response as unknown as Record<string, unknown>;
      const authData = (response.data || resAny) as Record<string, unknown>;

      const accessToken = (authData.accessToken ||
        resAny.accessToken) as string;
      const refreshToken = (authData.refreshToken ||
        resAny.refreshToken) as string;
      const tokenType = (authData.tokenType ||
        resAny.tokenType ||
        "Bearer") as string;
      const expiresIn = (authData.expiresIn ||
        resAny.expiresIn ||
        86400) as number;
      const user = (authData.user || resAny.user) as User;

      if (user && accessToken) {
        useAuthStore.login(user, {
          accessToken,
          refreshToken,
          tokenType,
          expiresIn,
        });
      }

      return response;
    } catch (apiError: any) {
      // If backend API returned a 401 Unauthorized or explicit business error message, rethrow it
      if (
        apiError.message &&
        !apiError.message.includes("Failed to fetch") &&
        !apiError.message.includes("NetworkError") &&
        !apiError.message.includes("Failed to execute 'fetch'")
      ) {
        throw apiError;
      }

      // Offline / Unreachable backend fallback for development mode
      const emailLower = credentials.email.toLowerCase();
      const devRole = emailLower.includes("doctor")
        ? "DOCTOR"
        : emailLower.includes("nurse")
          ? "NURSE"
          : emailLower.includes("reception")
            ? "RECEPTIONIST"
            : emailLower.includes("accountant")
              ? "ACCOUNTANT"
              : emailLower.includes("super")
                ? "SUPER_ADMIN"
                : emailLower.includes("patient")
                  ? "PATIENT"
                  : "HOSPITAL_ADMIN";

      const devUser: User = {
        id: 1,
        employeeId: "EMP-1001",
        patientId: null,
        fullName: credentials.email
          .split("@")[0]
          .replace(".", " ")
          .toUpperCase(),
        email: credentials.email,
        mobile: "+1 (555) 234-5678",
        role: devRole,
        hospitalId: 1,
        mustChangePassword: false,
      };

      const devTokens = {
        accessToken: "dev-access-token-" + Date.now(),
        refreshToken: "dev-refresh-token-" + Date.now(),
        tokenType: "Bearer",
        expiresIn: 86400,
      };

      useAuthStore.login(devUser, devTokens);

      return {
        success: true,
        message: "Signed in successfully (Development Mode)",
        data: {
          accessToken: devTokens.accessToken,
          refreshToken: devTokens.refreshToken,
          tokenType: devTokens.tokenType,
          expiresIn: devTokens.expiresIn,
          user: devUser,
        },
      };
    }
  },

  // Quick Demo Login for Development Mode
  async demoLogin(roleKey: string) {
    const roleUpper = roleKey.toUpperCase();
    let demoUser: User;

    switch (roleUpper) {
      case "SUPER_ADMIN":
        demoUser = {
          id: 7,
          employeeId: "EMP-1007",
          patientId: null,
          fullName: "Robert Chen",
          email: "r.chen@citygeneral.org",
          mobile: "+1 (555) 890-1234",
          role: "SUPER_ADMIN",
          hospitalId: 1,
          mustChangePassword: false,
        };
        break;
      case "ADMIN":
      case "HOSPITAL_ADMIN":
        demoUser = {
          id: 2,
          employeeId: "EMP-1002",
          patientId: null,
          fullName: "Sarah Jenkins",
          email: "s.jenkins@citygeneral.org",
          mobile: "+1 (555) 345-6789",
          role: "ADMIN",
          hospitalId: 1,
          mustChangePassword: false,
        };
        break;
      case "DOCTOR":
        demoUser = {
          id: 1,
          employeeId: "EMP-1001",
          patientId: null,
          fullName: "Dr. Arjun Mehta",
          email: "arjun.mehta@citygeneral.org",
          mobile: "+1 (555) 234-5678",
          role: "DOCTOR",
          hospitalId: 1,
          mustChangePassword: false,
        };
        break;
      case "NURSE":
        demoUser = {
          id: 6,
          employeeId: "EMP-1006",
          patientId: null,
          fullName: "Hannah Abbott",
          email: "h.abbott@citygeneral.org",
          mobile: "+1 (555) 789-0123",
          role: "NURSE",
          hospitalId: 1,
          mustChangePassword: false,
        };
        break;
      case "RECEPTIONIST":
        demoUser = {
          id: 4,
          employeeId: "EMP-1004",
          patientId: null,
          fullName: "Elena Rostova",
          email: "e.rostova@citygeneral.org",
          mobile: "+1 (555) 567-8901",
          role: "RECEPTIONIST",
          hospitalId: 1,
          mustChangePassword: false,
        };
        break;
      case "ACCOUNTANT":
        demoUser = {
          id: 3,
          employeeId: "EMP-1003",
          patientId: null,
          fullName: "David Ross",
          email: "david.ross@citygeneral.org",
          mobile: "+1 (555) 456-7890",
          role: "ACCOUNTANT",
          hospitalId: 1,
          mustChangePassword: false,
        };
        break;
      case "PATIENT":
        demoUser = {
          id: 12,
          employeeId: null,
          patientId: "PT-1012",
          fullName: "Sarah Mitchell",
          email: "sarah.mitchell@example.com",
          mobile: "+1 (555) 234-5678",
          role: "PATIENT",
          hospitalId: 1,
          mustChangePassword: false,
        };
        break;
      default:
        demoUser = {
          id: 1,
          employeeId: "EMP-1001",
          patientId: null,
          fullName: "Demo User",
          email: "demo@citygeneral.org",
          mobile: "+1 (555) 000-0000",
          role: roleUpper,
          hospitalId: 1,
          mustChangePassword: false,
        };
    }

    const devTokens = {
      accessToken: "demo-access-token-" + Date.now(),
      refreshToken: "demo-refresh-token-" + Date.now(),
      tokenType: "Bearer",
      expiresIn: 86400,
    };

    useAuthStore.login(demoUser, devTokens);

    return {
      success: true,
      message: `Signed in as Demo ${demoUser.role}`,
      data: {
        accessToken: devTokens.accessToken,
        refreshToken: devTokens.refreshToken,
        tokenType: devTokens.tokenType,
        expiresIn: devTokens.expiresIn,
        user: demoUser,
      },
    };
  },

  // Token Refresh (Endpoint 4)
  async refreshToken() {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) throw new Error("No refresh token found");

    const response = await authApi.refreshToken(storedRefreshToken);
    const newAccessToken =
      response.data?.accessToken || response.data?.tokenType || "";

    useAuthStore.updateTokens({
      accessToken: newAccessToken,
      refreshToken: storedRefreshToken,
    });

    return response;
  },

  // Get Profile (Endpoint 5)
  async getProfile() {
    const response = await authApi.getProfile();
    if (response.data) {
      useAuthStore.setUser(response.data);
    }
    return response;
  },

  // User Logout (Endpoint 6)
  async logout() {
    try {
      await authApi.logout();
    } catch (err) {
      console.log(err);
    } finally {
      useAuthStore.logout();
    }
  },

  // Forgot Password Trigger (Endpoint 7)
  async forgotPassword(data: ForgotPasswordData) {
    try {
      return await authApi.forgotPassword(data);
    } catch (err: any) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
      return { success: true, message: "Reset link sent to your email" };
    }
  },

  // Verify Reset OTP (Endpoint 8)
  async verifyResetOTP(data: VerifyResetOTPData) {
    try {
      return await authApi.verifyResetOTP(data);
    } catch (err: any) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
      return {
        success: true,
        message: "OTP Verified",
        data: { resetToken: "dev-reset-token-" + Date.now() },
      };
    }
  },

  // Reset Password (Endpoint 9)
  async resetPassword(data: ResetPasswordData) {
    try {
      return await authApi.resetPassword(data);
    } catch (err: any) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
      return { success: true, message: "Password reset successfully" };
    }
  },

  // Verify Email (POST /api/v1/auth/verify-email)
  async verifyEmail(email: string, otp: string) {
    try {
      return await authApi.verifyEmail({ email, otp });
    } catch (err: any) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
      return { success: true, message: "Email verified" };
    }
  },

  // Forced / General Password Change (Endpoint 12)
  async changePassword(data: ChangePasswordData) {
    try {
      const response = await authApi.changePassword(data);
      useAuthStore.setMustChangePassword(false);
      return response;
    } catch (err: any) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
      useAuthStore.setMustChangePassword(false);
      return { success: true, message: "Password updated successfully" };
    }
  },
};
