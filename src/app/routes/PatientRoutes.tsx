import { Route } from "react-router";
import { ROUTES } from "./routes";
import { RouteGuard } from "../../permissions/guards";
import { PatientListPageRoute } from "../../features/patients/routes/PatientListPageRoute";
import { RegisterPatientScreen } from "../../features/patients/pages/RegisterPatientScreen";
import { PatientOnboardingRoute } from "../../features/patients/routes/PatientOnboardingRoute";
import { PatientAppointmentsScreen } from "../../features/patients/pages/PatientAppointmentsScreen";
import { PatientMedicalRecordsScreen } from "../../features/patients/pages/PatientMedicalRecordsScreen";
import { PrescriptionManagementPage } from "../../features/prescriptions/pages/PrescriptionManagementPage";
import { PatientNotificationsPage } from "../../features/notification/pages/PatientNotificationsPage";
import { PatientProfileRoute } from "../../features/patients/routes/PatientProfileRoute";
import { PatientMyProfileRoute } from "../../features/patients/routes/PatientMyProfileRoute";
import { DoctorAssignedPatientsRoute } from "../../features/patients/routes/DoctorAssignedPatientsRoute";
import { NurseVitalsWorklistPage } from "../../features/patients/pages/NurseVitalsWorklistPage";
import { BillingManagementPage } from "../../features/billing/pages/BillingManagementPage";
import { PatientDoctorSearchScreen } from "../../features/patients/pages/PatientDoctorSearchScreen";
import { PatientQueueStatusScreen } from "../../features/patients/pages/PatientQueueStatusScreen";
import { PatientMyBillsPage } from "../../features/billing/pages/PatientMyBillsPage";
import { useAuthStore } from "../../features/auth/store/auth.store";

// We need the wrapper and dispatcher
import { FamilyMembersRouteWrapper } from "./routeConfig"; // We'll export this from routeConfig

function PatientBillingRouteDispatcher() {
  const role = useAuthStore((s) => s.user?.role);
  const isPatient = String(role || "").toUpperCase() === "PATIENT";
  if (isPatient) {
    return <PatientMyBillsPage />;
  }
  return <BillingManagementPage />;
}

export function PatientRoutes() {
  return (
    <>
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
    </>
  );
}
