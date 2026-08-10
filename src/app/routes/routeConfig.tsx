import { Routes, Route, Navigate } from "react-router";
import { useState, useCallback } from "react";
import { ROUTES } from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { RouteGuard } from "../../permissions";

// Auth Feature Pages
import {
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ChangePasswordPage,
  PatientRegisterPage,
} from "../../features/auth";

// Application Feature Modules
import DashboardDispatcher from "./DashboardDispatcher";
import {
  PatientProfileCenterScreen,
  RegisterPatientScreen,
  FamilyMembersManagement,
  PatientAppointmentsScreen,
  PatientMedicalRecordsScreen,
  PatientDoctorSearchScreen,
  PatientQueueStatusScreen,
  PatientNotificationsScreen,
  PatientListPageRoute,
  PatientProfileRoute,
  DoctorAssignedPatientsRoute,
  NurseVitalsWorklistPage,
  PatientMyProfileRoute,
} from "../../features/patients";
import {
  PatientPortalProvider,
  usePatientPortal,
} from "../../features/patients/context/PatientPortalContext";
import { PatientOnboardingRoute } from "../../features/patients/routes/PatientOnboardingRoute";
import { patientsApi } from "../../features/patients/api/patient.api";
import {
  AppointmentManagementCenterScreen,
  BookAppointmentScreen,
  QueueManagementScreen,
} from "../../features/appointments";
import { RecordPatientVitalsScreen } from "../../features/vitals";
import {
  OpdConsultationCenterScreen,
  StartOpdConsultationWorkspaceScreen,
} from "../../features/opd";
import { DoctorManagementCenterScreen } from "../../features/doctors";
import { PrescriptionManagementPage } from "../../features/prescriptions";
import { DoctorProfileRoute } from "../../features/doctors/pages/DoctorProfileRoute";
import { DoctorDirectoryPage } from "../../features/doctors/pages/DoctorDirectoryPage";
import { ReceptionistDoctorListPage } from "../../features/doctors/pages/ReceptionistDoctorListPage";
import { useAuthStore } from "../../features/auth";

function DoctorsRouteDispatcher() {
  const role = useAuthStore((s) => s.user?.role);
  const r = String(role ?? "").toUpperCase();
  if (r === "RECEPTIONIST") return <ReceptionistDoctorListPage />;
  if (r === "PATIENT") return <DoctorDirectoryPage />;
  if (r === "DOCTOR") return <DoctorProfileRoute />;
  return <DoctorManagementCenterScreen />;
}
import { DoctorScheduleScreen } from "../../features/doctors/components/DoctorScheduleScreen";
import { DoctorQueueScreen } from "../../features/doctors/components/DoctorQueueScreen";
import { DoctorPatientsScreen } from "../../features/doctors/components/DoctorPatientsScreen";
import { DoctorMedicalRecordsScreen } from "../../features/doctors/components/DoctorMedicalRecordsScreen";
import { DoctorAppointmentsScreen } from "../../features/doctors/components/DoctorAppointmentsScreen";
import { UserManagementCenterScreen } from "../../features/users";
import {
  BillingManagementPage,
  BillingConfigurationPage,
  InvoiceDetailsPage,
  PaymentHistoryPage,
  CreateInvoiceWorkspacePage,
  CollectPaymentWorkspacePage,
  InvoicePrintPreviewPage,
  ReceptionistPaymentCollectionPage,
  PatientMyBillsPage,
} from "../../features/billing";
import { DailyBillingReportPage } from "../../features/reports/pages/DailyBillingReport";
import { ReportsDashboardScreen } from "../../ReportsManagement";
import { SettingsWorkspace } from "../../SettingsWorkspace";
import AuditLogsManagementScreen from "../../AuditLogsManagement";
import { NotificationCenterManagement } from "../../NotificationCenterManagement";

// Main HMS Layout shell
import { HMSAppShell } from "../../components/layout/HMSAppShell";

function FamilyMembersRouteWrapper() {
  const [registering, setRegistering] = useState(false);
  const portal = usePatientPortal();
  const user = useAuthStore((state) => state.user);
  const primaryMrn =
    portal?.primaryMrn || String(user?.patientId || user?.id || "");

  const handleViewProfile = useCallback(
    (mrn: string) => {
      const member = (portal?.familyMembers ?? []).find(
        (m) => String(m.mrn) === String(mrn),
      );
      if (member) {
        portal?.switchToPatient(member);
        setRegistering(false);
      }
      portal?.refresh();
    },
    [portal],
  );

  if (registering) {
    return (
      <RegisterPatientScreen
        isFamilyMode
        primaryPatientMrn={primaryMrn}
        onBack={() => {
          setRegistering(false);
          portal?.refresh();
        }}
        onRegistered={() => portal?.refresh()}
        onViewProfile={handleViewProfile}
      />
    );
  }

  return (
    <FamilyMembersManagement
      familyMembers={portal?.familyMembers || []}
      activeFamilyMember={portal?.activePatient || undefined}
      onAddFamilyMember={() => setRegistering(true)}
      onSwitchProfile={(member) => portal?.switchToPatient(member)}
      onRemoveFamilyMember={async (id) => {
        if (!primaryMrn) return;
        const wasActive = String(portal?.activePatient?.id) === String(id);
        const removed = await patientsApi.deleteFamilyMember(primaryMrn, id);
        if (removed && wasActive) {
          localStorage.setItem("hms-active-patient-mrn", primaryMrn);
        }
        if (removed) portal?.refresh();
      }}
      onUpdateRelationship={async (id, relationship) => {
        if (!primaryMrn) return;
        const updated = await patientsApi.updateFamilyMember(primaryMrn, id, {
          relationship,
        });
        if (updated) portal?.refresh();
      }}
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
            <PatientPortalProvider>
              <HMSAppShell />
            </PatientPortalProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route element={<PatientOnboardingRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardDispatcher />} />
        </Route>
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
        <Route element={<PatientOnboardingRoute />}>
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
                <PrescriptionManagementPage />
              </RouteGuard>
            }
          />
          <Route
            path={ROUTES.PATIENT_BILLING}
            element={
              <RouteGuard requiredPermission="BILLING_VIEW">
                <BillingManagementPage />
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
                <BillingManagementPage />
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
        </Route>
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
              <OpdConsultationCenterScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_PRESCRIPTIONS}
          element={
            <RouteGuard requiredPermission="PRESCRIPTION_VIEW">
              <PrescriptionManagementPage />
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
          path={ROUTES.CONSULTATION_WORKSPACE}
          element={
            <RouteGuard requiredPermission="OPD_VIEW">
              <StartOpdConsultationWorkspaceScreen />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PRESCRIPTIONS}
          element={
            <RouteGuard requiredPermission="PRESCRIPTION_VIEW">
              <PrescriptionManagementPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <BillingManagementPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING_CREATE}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <CreateInvoiceWorkspacePage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING_COLLECT_PAYMENT}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <CollectPaymentWorkspacePage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING_PRINT_PREVIEW}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <InvoicePrintPreviewPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING_CONFIGURATION}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <BillingConfigurationPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING_INVOICE}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <InvoiceDetailsPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING_HISTORY}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <PaymentHistoryPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.BILLING_REPORT}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <DailyBillingReportPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.RECEPTIONIST_PAYMENT_COLLECTION}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <ReceptionistPaymentCollectionPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_MY_BILLS}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <PatientMyBillsPage />
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
          path={ROUTES.DOCTOR_ME_PROFILE}
          element={
            <RouteGuard requiredPermission="DOCTOR_PROFILE_VIEW">
              <DoctorProfileRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <RouteGuard requiredPermission="DOCTOR_PROFILE_VIEW">
              <DoctorProfileRoute />
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
