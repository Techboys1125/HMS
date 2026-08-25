import { Route } from "react-router";
import { ROUTES } from "./routes";
import PublicRoute from "./PublicRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { ForgotPasswordPage } from "../../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage";
import { PatientRegisterPage } from "../../features/auth/pages/PatientRegisterPage";

export function PublicAuthRoutes() {
  return (
    <>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <PatientRegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.RESET_PASSWORD}
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
    </>
  );
}
