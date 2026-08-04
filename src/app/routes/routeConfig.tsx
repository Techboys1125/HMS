import { Routes, Route, Navigate } from "react-router";
import { ROUTES } from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { RouteGuard } from "../../permissions";

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
  PatientAppointmentsScreen,
  PatientMedicalRecordsScreen,
  PatientPrescriptionsScreen,
  PatientDoctorSearchScreen,
  PatientQueueStatusScreen,
  PatientNotificationsScreen,
  PatientListPageRoute,
  PatientProfileRoute,
  DoctorAssignedPatientsRoute,
  NurseVitalsWorklistPage,
  PatientMyProfileRoute,
  AccountantPatientBillingPage,
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
import { DoctorProfileRoute } from "../../features/doctors/pages/DoctorProfileRoute";
import { DoctorDirectoryPage } from "../../features/doctors/pages/DoctorDirectoryPage";
import { ReceptionistDoctorListPage } from "../../features/doctors/pages/ReceptionistDoctorListPage";
import { MyProfilePage as DoctorMyProfilePage } from "../../features/doctors/pages/MyProfilePage";
import { useAuthStore } from "../../features/auth";

function DoctorsRouteDispatcher() {
  const role = useAuthStore((s) => s.user?.role);
  const r = String(role ?? "").toUpperCase();
  if (r === "RECEPTIONIST") return <ReceptionistDoctorListPage />;
  if (r === "PATIENT") return <DoctorDirectoryPage />;
  if (r === "DOCTOR") return <DoctorMyProfilePage />;
  return <DoctorManagementCenterScreen />;
}
import { DoctorScheduleScreen } from "../../features/doctors/components/DoctorScheduleScreen";
import { DoctorQueueScreen } from "../../features/doctors/components/DoctorQueueScreen";
import { DoctorPatientsScreen } from "../../features/doctors/components/DoctorPatientsScreen";
import { DoctorMedicalRecordsScreen } from "../../features/doctors/components/DoctorMedicalRecordsScreen";
import { DoctorAppointmentsScreen } from "../../features/doctors/components/DoctorAppointmentsScreen";
import { DoctorConsultationScreen } from "../../features/doctors/components/DoctorConsultationScreen";
import { UserManagementCenterScreen } from "../../features/users";
import { BillingDashboardScreen } from "../../BillingManagement";
import { ReportsDashboardScreen } from "../../ReportsManagement";
import { SettingsWorkspace } from "../../SettingsWorkspace";
import AuditLogsManagementScreen from "../../AuditLogsManagement";
import { NotificationCenterManagement } from "../../NotificationCenterManagement";

// Main HMS Layout shell
import { HMSAppShell } from "../../components/layout/HMSAppShell";
import { useNavigate } from "react-router";

function FamilyMembersRouteWrapper() {
  const navigate = useNavigate();
  return (
    <FamilyMembersManagement
      onAddFamilyMember={() => navigate(ROUTES.PATIENT_REGISTER)}
    />
  );
}

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
        <Route
          path={ROUTES.PATIENTS}
          element={
            <RouteGuard requiredPermission="PATIENT_VIEW">
              <PatientProfileCenterScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_REGISTER}
          element={
            <RouteGuard requiredPermission="PATIENT_CREATE">
              <RegisterPatientScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.FAMILY_MEMBERS}
          element={
            <RouteGuard requiredPermission="FAMILY_MEMBER_VIEW">
              <FamilyMembersRouteWrapper />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_APPOINTMENTS}
          element={
            <RouteGuard requiredPermission="APPOINTMENT_VIEW">
              <PatientAppointmentsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_MEDICAL_RECORDS}
          element={
            <RouteGuard requiredPermission="MEDICAL_HISTORY_VIEW">
              <PatientMedicalRecordsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_PRESCRIPTIONS}
          element={
            <RouteGuard requiredPermission="PRESCRIPTION_VIEW">
              <PatientPrescriptionsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_NOTIFICATIONS}
          element={
            <RouteGuard requiredPermission="NOTIFICATION_VIEW">
              <PatientNotificationsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_LIST}
          element={
            <RouteGuard requiredPermission="PATIENT_VIEW">
              <PatientListPageRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_PROFILE}
          element={
            <RouteGuard requiredPermission="PATIENT_VIEW">
              <PatientProfileRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_MY_PROFILE}
          element={
            <RouteGuard requiredPermission="PATIENT_VIEW">
              <PatientMyProfileRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_DOCTOR_ASSIGNED}
          element={
            <RouteGuard requiredPermission="DOCTOR_VIEW">
              <DoctorAssignedPatientsRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_NURSE_VITALS}
          element={
            <RouteGuard requiredPermission="VITALS_CREATE">
              <NurseVitalsWorklistPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_ACCOUNTANT_BILLING}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <AccountantPatientBillingPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_DOCTORS}
          element={
            <RouteGuard requiredPermission="DOCTOR_VIEW">
              <PatientDoctorSearchScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_QUEUE}
          element={
            <RouteGuard requiredPermission="QUEUE_VIEW">
              <PatientQueueStatusScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_NOTIFICATIONS}
          element={
            <RouteGuard requiredPermission="NOTIFICATION_VIEW">
              <PatientNotificationsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_MY_SCHEDULE}
          element={
            <RouteGuard requiredPermission="DOCTOR_SCHEDULE_VIEW">
              <DoctorScheduleScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_MY_QUEUE}
          element={
            <RouteGuard requiredPermission="QUEUE_VIEW">
              <DoctorQueueScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_PATIENTS}
          element={
            <RouteGuard requiredPermission="PATIENT_VIEW">
              <DoctorPatientsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_MEDICAL_RECORDS}
          element={
            <RouteGuard requiredPermission="MEDICAL_HISTORY_VIEW">
              <DoctorMedicalRecordsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_APPOINTMENTS}
          element={
            <RouteGuard requiredPermission="APPOINTMENT_VIEW">
              <DoctorAppointmentsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_CONSULTATION}
          element={
            <RouteGuard requiredPermission="OPD_VIEW">
              <DoctorConsultationScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_PRESCRIPTIONS}
          element={
            <RouteGuard requiredPermission="PRESCRIPTION_VIEW">
              <DoctorPrescriptionsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.APPOINTMENTS}
          element={
            <RouteGuard requiredPermission="APPOINTMENT_VIEW">
              <AppointmentManagementCenterScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BOOK_APPOINTMENT}
          element={
            <RouteGuard requiredPermission="APPOINTMENT_CREATE">
              <BookAppointmentScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.QUEUE}
          element={
            <RouteGuard requiredPermission="QUEUE_VIEW">
              <QueueManagementScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.VITALS}
          element={
            <RouteGuard requiredPermission="VITALS_CREATE">
              <RecordPatientVitalsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.CONSULTATION}
          element={
            <RouteGuard requiredPermission="OPD_VIEW">
              <OpdConsultationCenterScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PRESCRIPTIONS}
          element={
            <RouteGuard requiredPermission="PRESCRIPTION_VIEW">
              <DoctorPrescriptionsScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <BillingDashboardScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTORS}
          element={
            <RouteGuard requiredPermission="DOCTOR_VIEW">
              <DoctorsRouteDispatcher />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_PROFILE}
          element={
            <RouteGuard requiredPermission="DOCTOR_PROFILE_VIEW">
              <DoctorProfileRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_DIRECTORY}
          element={
            <RouteGuard requiredPermission="DOCTOR_VIEW">
              <DoctorDirectoryPage />
            </RouteGuard>
          }
        />

        <Route
          path={ROUTES.REPORTS}
          element={
            <RouteGuard requiredPermission="REPORT_VIEW">
              <ReportsDashboardScreen />
            </RouteGuard>
          }
        />
        <Route path={ROUTES.SETTINGS} element={<SettingsWorkspace />} />
        <Route
          path={ROUTES.PROFILE}
          element={
            <RouteGuard requiredPermission="PROFILE_VIEW">
              <DoctorMyProfilePage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.USER_MANAGEMENT}
          element={
            <RouteGuard requiredPermission="USER_VIEW">
              <UserManagementCenterScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.AUDIT_LOGS}
          element={
            <RouteGuard requiredPermission="USER_VIEW">
              <AuditLogsManagementScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.NOTIFICATIONS}
          element={<NotificationCenterManagement />}
        />
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
