import { Route } from "react-router";
import { ROUTES } from "./routes";
import { RouteGuard } from "../../permissions/guards";
import { AppointmentManagementCenterScreen } from "../../features/appointments/pages/AppointmentManagementCenterScreen";
import { BookAppointmentScreen } from "../../features/appointments/pages/BookAppointmentScreen";
import { AppointmentDetailPage } from "../../features/appointments/pages/AppointmentDetailPage";
import { PatientCheckInScreen } from "../../features/appointments/pages/PatientCheckInScreen";
import { QueueManagementScreen } from "../../features/appointments/pages/QueueManagementScreen";
import { RecordPatientVitalsScreen } from "../../features/vitals/pages/VitalsManagementScreen";
import { OpdConsultationCenterScreen } from "../../features/opd/pages/OPDConsultationPage";
import { StartConsultationPage as StartOpdConsultationWorkspaceScreen } from "../../features/opd/pages/StartConsultationPage";
import { PrescriptionManagementPage } from "../../features/prescriptions/pages/PrescriptionManagementPage";
import { EncounterPrescriptionPage } from "../../features/prescriptions/pages/EncounterPrescriptionPage";

export function AppointmentRoutes() {
  return (
    <>
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
    </>
  );
}
