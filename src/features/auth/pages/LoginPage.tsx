import React, { useState, useRef } from "react";
import { getToken, removeToken } from "../../../lib/cookie-token-storage";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { ROUTES } from "../../../app/routes/routes";
import { BrandingPanel } from "../components/BrandingPanel";
import { LoginForm } from "../components/LoginForm";
import { PatientRegisterForm } from "../components/PatientRegisterForm";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { OTPPage } from "./OTPPage";
import { ResetPasswordPage } from "./ResetPasswordPage";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { SuccessPage } from "./SuccessPage";
import type {
  AuthScreen,
  LoginResponse,
  PatientRegistrationResponse,
  User,
  AuthTokens,
} from "../types/auth.types";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>(() => {
    if (getToken("force_change_password") === "true") {
      removeToken("force_change_password");
      return "change-password";
    }
    return "login";
  });

  const [resetEmail, setResetEmail] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const pendingUserRef = useRef<User | null>(null);
  const pendingTokensRef = useRef<AuthTokens | null>(null);

  const handleLoginSuccess = (response: LoginResponse) => {
    const resAny = response as unknown as Record<string, unknown>;
    const authData = (response.data || resAny) as Record<string, unknown>;
    const rawUser = (authData.user || resAny.user || {}) as Record<
      string,
      unknown
    >;

    let loggedInUser: User | null;
    if (rawUser && rawUser.id) {
      const docId =
        rawUser.doctorId ??
        (rawUser.doctorProfile as { doctorId?: number })?.doctorId;
      loggedInUser = {
        ...rawUser,
        doctorId: docId ? Number(docId) : undefined,
        doctorProfile:
          (rawUser.doctorProfile as { doctorId?: number }) ||
          (docId ? { doctorId: Number(docId) } : undefined),
      } as User;
    } else {
      loggedInUser = useAuthStore.getState().user;
    }

    if (loggedInUser) {
      pendingUserRef.current = loggedInUser;
      pendingTokensRef.current = {
        accessToken: String(authData.accessToken || resAny.accessToken || ""),
        refreshToken: String(
          authData.refreshToken || resAny.refreshToken || "",
        ),
        tokenType: String(authData.tokenType || resAny.tokenType || "Bearer"),
        expiresIn: Number(authData.expiresIn || resAny.expiresIn || 86400),
      };
    }

    if (!loggedInUser) {
      setCurrentScreen("success");
      return;
    }

    // Endpoint 11 Check: Forced Password Change required
    if (loggedInUser.mustChangePassword) {
      setCurrentScreen("change-password");
      return;
    }

    setSuccessInfo({
      title: `Welcome back, ${loggedInUser.fullName}!`,
      message: `Signed in successfully as ${loggedInUser.role} (${loggedInUser.email}).`,
    });
    setCurrentScreen("success");
  };

  const handlePatientRegisterSuccess = (
    response: PatientRegistrationResponse,
  ) => {
    // Backend may return `accountId` at the root instead of a `data` object
    const email = response.data?.email || "your registered email";
    const patientId =
      response.data?.patientId ||
      (response as unknown as Record<string, string | number>).accountId ||
      "your new ID";

    setSuccessInfo({
      title: "Registration Successful!",
      message:
        response.message ||
        `Account created for ${email} with Patient ID ${patientId}. Please check your inbox for verification.`,
    });
    setCurrentScreen("success");
  };

  return (
    <div className="auth-page-container min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] overflow-y-auto lg:overflow-hidden font-body">
      {/* Left Branding Panel (50% width, full height) */}
      <BrandingPanel />

      {/* Right Form Area (50% width, centered container layout) */}
      <main className="auth-right-panel w-full lg:w-1/2 min-h-screen lg:h-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-50 relative overflow-y-auto lg:overflow-hidden">
        {/* Soft glowing ambient backgrounds */}
        <div className="absolute top-0 right-0 w-120 h-120 bg-[#0D47A1]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-120 h-120 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Container wrapper for form screens */}
        <div className="auth-card w-full max-w-xl bg-white rounded-2xl border border-slate-100/80 shadow-xl shadow-slate-200/50 p-4 sm:p-6 md:p-7 relative z-10 transition-colors duration-300 my-auto">
          {/* 1. Login Screen */}
          {currentScreen === "login" && (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onForgotPassword={() => setCurrentScreen("forgot")}
              onGoToRegister={() => setCurrentScreen("register")}
            />
          )}

          {/* 2. Register Screen */}
          {currentScreen === "register" && (
            <PatientRegisterForm
              onSuccess={handlePatientRegisterSuccess}
              onGoToLogin={() => setCurrentScreen("login")}
            />
          )}

          {/* 3. Forgot Password Screen */}
          {currentScreen === "forgot" && (
            <ForgotPasswordPage
              onBackToLogin={() => setCurrentScreen("login")}
              onSendOTP={(email) => {
                setResetEmail(email);
                setCurrentScreen("otp");
              }}
            />
          )}

          {/* 4. OTP Verification Screen */}
          {currentScreen === "otp" && (
            <OTPPage
              email={resetEmail}
              onBack={() => setCurrentScreen("forgot")}
              onVerified={() => {
                setCurrentScreen("reset");
              }}
            />
          )}

          {/* 5. Reset Password Screen */}
          {currentScreen === "reset" && (
            <ResetPasswordPage
              onSuccess={() => {
                setSuccessInfo({
                  title: "Password Reset Successfully!",
                  message:
                    "Your password has been updated. You can now sign in with your new password.",
                });
                setCurrentScreen("success");
              }}
            />
          )}

          {/* 6. Forced Password Change Screen */}
          {currentScreen === "change-password" && (
            <ChangePasswordPage
              onSuccess={() => {
                setSuccessInfo({
                  title: "Password Activated!",
                  message:
                    "Your account password has been updated successfully. You are now fully logged in.",
                });
                setCurrentScreen("success");
              }}
            />
          )}

          {/* 7. Success Screen */}
          {currentScreen === "success" && (
            <SuccessPage
              title={successInfo?.title || "Action Completed!"}
              message={successInfo?.message || "Operation successful."}
              onContinue={() => {
                if (pendingUserRef.current && pendingTokensRef.current) {
                  useAuthStore.login(
                    pendingUserRef.current,
                    pendingTokensRef.current,
                  );
                  pendingUserRef.current = null;
                  pendingTokensRef.current = null;
                }
                const isAuthenticated = useAuthStore.getState().isAuthenticated;
                setSuccessInfo(null);
                if (isAuthenticated) {
                  if (navigate) {
                    navigate(ROUTES.DASHBOARD);
                  }
                } else {
                  setCurrentScreen("login");
                }
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
