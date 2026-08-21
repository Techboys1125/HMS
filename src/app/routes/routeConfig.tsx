import { Routes, Route, Navigate } from "react-router";
import { useState, useCallback } from "react";
import { ROUTES } from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { RouteGuard } from "../../permissions/guards";

// Auth Feature Pages
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { ForgotPasswordPage } from "../../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage";
import { ChangePasswordPage } from "../../features/auth/pages/ChangePasswordPage";
import { PatientRegisterPage } from "../../features/auth/pages/PatientRegisterPage";

// Application Feature Modules
import DashboardDispatcher from "./DashboardDispatcher";
import { RegisterPatientScreen } from "../../features/patients/pages/RegisterPatientScreen";
import { FamilyMembersManagement } from "../../features/patients/pages/FamilyMembersManagement";
import { PatientAppointmentsScreen } from "../../features/patients/pages/PatientAppointmentsScreen";
import { PatientMedicalRecordsScreen } from "../../features/patients/pages/PatientMedicalRecordsScreen";
import { PatientDoctorSearchScreen } from "../../features/patients/pages/PatientDoctorSearchScreen";
import { PatientQueueStatusScreen } from "../../features/patients/pages/PatientQueueStatusScreen";
import { PatientListPageRoute } from "../../features/patients/routes/PatientListPageRoute";
import { PatientProfileRoute } from "../../features/patients/routes/PatientProfileRoute";
import { DoctorAssignedPatientsRoute } from "../../features/patients/routes/DoctorAssignedPatientsRoute";
import { NurseVitalsWorklistPage } from "../../features/patients/pages/NurseVitalsWorklistPage";
import { PatientMyProfileRoute } from "../../features/patients/routes/PatientMyProfileRoute";
import { UserProfileRoute } from "../../features/patients/routes/UserProfileRoute";
import { PatientPortalProvider } from "../../features/patients/context/PatientPortalContext.tsx";
import { usePatientPortal } from "../../features/patients/context/usePatientPortal";
import { PatientOnboardingRoute } from "../../features/patients/routes/PatientOnboardingRoute";
import { patientsApi } from "../../features/patients/api/patient.api";
import AppointmentManagementCenterScreen from "../../features/appointments/pages/AppointmentManagementCenterScreen";
import { QueueManagementScreen } from "../../features/appointments/pages/QueueManagementScreen";
import { BookAppointmentScreen } from "../../features/appointments/pages/BookAppointmentScreen";
import { PatientCheckInScreen } from "../../features/appointments/pages/PatientCheckInScreen";
import { AppointmentDetailPage } from "../../features/appointments/pages/AppointmentDetailPage";
import { RecordPatientVitalsScreen } from "../../features/vitals/pages/VitalsManagementScreen";
import { OpdConsultationCenterScreen } from "../../features/opd/pages/OpdConsultationCenterScreen";
import { StartConsultationPage as StartOpdConsultationWorkspaceScreen } from "../../features/opd/pages/StartConsultationPage";
import { PrescriptionManagementPage } from "../../features/prescriptions/pages/PrescriptionManagementPage";
import { EncounterPrescriptionPage } from "../../features/prescriptions/pages/EncounterPrescriptionPage";
import { DoctorManagementPage } from "../../features/doctors/pages/DoctorManagementPage";
import { DoctorProfileRoute } from "../../features/doctors/pages/DoctorProfileRoute";
import { DoctorDirectoryPage } from "../../features/doctors/pages/DoctorDirectoryPage";
import { useAuthStore } from "../../features/auth/store/auth.store";

function DoctorsRouteDispatcher() {
  const role = useAuthStore((s) => s.user?.role);
  const r = String(role ?? "").toUpperCase();
  if (r === "PATIENT") return <DoctorDirectoryPage />;
  return <DoctorManagementPage />;
}
import { DoctorScheduleScreen } from "../../features/doctors/components/DoctorScheduleScreen";
import { DoctorQueueScreen } from "../../features/doctors/components/DoctorQueueScreen";
import { DoctorPatientsScreen } from "../../features/doctors/components/DoctorPatientsScreen";
import { DoctorMedicalRecordsScreen } from "../../features/doctors/components/DoctorMedicalRecordsScreen";
import { DoctorAppointmentsScreen } from "../../features/doctors/components/DoctorAppointmentsScreen";
import { UserManagementCenterScreen } from "../../features/users/pages/UserManagementCenterScreen";
import { BillingManagementPage } from "../../features/billing/pages/BillingManagementPage";
import { BillingConfigurationPage } from "../../features/billing/pages/BillingConfigurationPage";
import { InvoiceDetailsPage } from "../../features/billing/pages/InvoiceDetailsPage";
import { PaymentHistoryPage } from "../../features/billing/pages/PaymentHistoryPage";
import { CreateInvoiceWorkspacePage } from "../../features/billing/pages/CreateInvoiceWorkspacePage";
import { CollectPaymentWorkspacePage } from "../../features/billing/pages/CollectPaymentWorkspacePage";
import { InvoicePrintPreviewPage } from "../../features/billing/pages/InvoicePrintPreviewPage";
import { ReceptionistPaymentCollectionPage } from "../../features/billing/pages/ReceptionistPaymentCollectionPage";
import { PatientMyBillsPage } from "../../features/billing/pages/PatientMyBillsPage";
import { DailyBillingReportPage } from "../../features/reports/pages/DailyBillingReport";
import { ReportsDashboardPage as ReportsDashboardScreen } from "../../features/reports/pages/ReportsDashboardPage";
import { SettingsPage } from "../../features/settings/pages/SettingsPage";
import { AuditLogManagementPage } from "../../features/auditlog/pages/AuditLogManagementPage";
import { NotificationCenterPage } from "../../features/notification/pages/NotificationCenterPage";
import { PatientNotificationsPage } from "../../features/notification/pages/PatientNotificationsPage";

// Main HMS Layout shell
import { HMSAppShell } from "../../components/layout/HMSAppShell";

function PatientBillingRouteDispatcher() {
  const role = useAuthStore((s) => s.user?.role);
  const isPatient = String(role || "").toUpperCase() === "PATIENT";
  if (isPatient) {
    return <PatientMyBillsPage />;
  }
  return <BillingManagementPage />;
}

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
          localStorage.setItem("hms-active-patient-mrn:v1", primaryMrn);
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
              <PatientListPageRoute />
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
                <PatientBillingRouteDispatcher />
              </RouteGuard>
            }
          />
          <Route
            path={ROUTES.PATIENT_NOTIFICATIONS}
            element={
              <RouteGuard requiredPermission="NOTIFICATION_VIEW">
                <PatientNotificationsPage />
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
            path="/patients/:mrn"
            element={
              <RouteGuard requiredPermission="PATIENT_VIEW">
                <PatientProfileRoute />
              </RouteGuard>
            }
          />
          <Route
            path={ROUTES.PATIENT_MY_PROFILE}
            element={
              <RouteGuard requiredPermission="PROFILE_VIEW">
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
              <PatientNotificationsPage />
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
          path={ROUTES.APPOINTMENT_DETAILS}
          element={
            <RouteGuard requiredPermission="APPOINTMENT_VIEW">
              <AppointmentDetailPage />
            </RouteGuard>
          }
        />
        <Route
          path="/appointments/checkin"
          element={
            <RouteGuard requiredPermission="APPOINTMENT_VIEW">
              <PatientCheckInScreen />
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
          path={ROUTES.ENCOUNTER_PRESCRIPTION}
          element={
            <RouteGuard requiredPermission="PRESCRIPTION_VIEW">
              <EncounterPrescriptionPage />
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
          path={ROUTES.PATIENT_PORTAL_BILLING}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <PatientMyBillsPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_PORTAL_BILLING_DETAIL}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <InvoiceDetailsPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PATIENT_PORTAL_BILLING_RECEIPT}
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <InvoicePrintPreviewPage />
            </RouteGuard>
          }
        />
        <Route
          path="/patients/billing/:billId"
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <InvoiceDetailsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/patients/billing/:billId/receipt"
          element={
            <RouteGuard requiredPermission="BILLING_VIEW">
              <InvoicePrintPreviewPage />
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
        <Route
          path={ROUTES.SETTINGS}
          element={
            <RouteGuard requiredPermission="USER_VIEW">
              <SettingsPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.DOCTOR_ME_PROFILE}
          element={
            <RouteGuard requiredPermission="PROFILE_VIEW">
              <UserProfileRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <RouteGuard requiredPermission="PROFILE_VIEW">
              <UserProfileRoute />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.MY_PROFILE}
          element={
            <RouteGuard requiredPermission="PROFILE_VIEW">
              <UserProfileRoute />
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
              <AuditLogManagementPage />
            </RouteGuard>
          }
        />
        <Route
          path={ROUTES.NOTIFICATIONS}
          element={
            <RouteGuard requiredPermission="NOTIFICATION_VIEW">
              <NotificationCenterPage />
            </RouteGuard>
          }
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
