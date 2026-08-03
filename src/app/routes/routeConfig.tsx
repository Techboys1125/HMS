import { Routes, Route, Navigate } from "react-router";
import { ROUTES } from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Auth Feature Pages
import {
  LoginPage,
  AuthApp,
  ForgotPasswordPage,
  ResetPasswordPage,
  ChangePasswordPage,
} from "../../features/auth";

// Application Feature Modules
import DashboardDispatcher from "./DashboardDispatcher";
import {
  PatientProfileCenterScreen,
  RegisterPatientScreen,
  FamilyMembersManagement,
} from "../../features/patients";
import {
  AppointmentManagementCenterScreen,
  BookAppointmentScreen,
  QueueManagementScreen,
} from "../../features/appointments";
import { RecordPatientVitalsScreen } from "../../features/vitals";
import { OpdConsultationCenterScreen } from "../../features/opd";
import {
  DoctorManagementCenterScreen,
  DoctorPrescriptionsScreen,
} from "../../features/doctors";
import { UserManagementCenterScreen } from "../../features/users";
import { BillingDashboardScreen } from "../../BillingManagement";
import { ReportsDashboardScreen } from "../../ReportsManagement";
import { SettingsWorkspace } from "../../SettingsWorkspace";
import { MyProfileManagement } from "../../MyProfileManagement";
import AuditLogsManagementScreen from "../../AuditLogsManagement";
import { NotificationCenterManagement } from "../../NotificationCenterManagement";

// Main HMS Layout shell
import { HMSAppShell } from "../../components/layout/HMSAppShell";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
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
            <AuthApp />
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

      {/* Protected Password Change Route */}
      <Route
        path={ROUTES.CHANGE_PASSWORD}
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Feature-Based Routes with App Shell Layout */}
      <Route
        element={
          <ProtectedRoute>
            <HMSAppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardDispatcher />} />
        <Route path={ROUTES.PATIENTS} element={<PatientProfileCenterScreen />} />
        <Route path={ROUTES.PATIENT_REGISTER} element={<RegisterPatientScreen />} />
        <Route path={ROUTES.FAMILY_MEMBERS} element={<FamilyMembersManagement />} />
        <Route path={ROUTES.APPOINTMENTS} element={<AppointmentManagementCenterScreen />} />
        <Route path={ROUTES.BOOK_APPOINTMENT} element={<BookAppointmentScreen />} />
        <Route path={ROUTES.QUEUE} element={<QueueManagementScreen />} />
        <Route path={ROUTES.VITALS} element={<RecordPatientVitalsScreen />} />
        <Route path={ROUTES.CONSULTATION} element={<OpdConsultationCenterScreen />} />
        <Route path={ROUTES.PRESCRIPTIONS} element={<DoctorPrescriptionsScreen />} />
        <Route path={ROUTES.BILLING} element={<BillingDashboardScreen />} />
        <Route path={ROUTES.DOCTORS} element={<DoctorManagementCenterScreen />} />
        <Route path={ROUTES.REPORTS} element={<ReportsDashboardScreen />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsWorkspace />} />
        <Route path={ROUTES.PROFILE} element={<MyProfileManagement />} />
        <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagementCenterScreen />} />
        <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogsManagementScreen />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationCenterManagement />} />
      </Route>

      {/* Catch-all fallback */}
      <Route
        path={ROUTES.NOT_FOUND}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
