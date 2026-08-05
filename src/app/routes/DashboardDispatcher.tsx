import { useAuthStore } from "../../features/auth";
import {
  SuperAdminDashboard,
  HospitalAdminDashboard,
  DoctorDashboard,
  NurseDashboard,
  ReceptionDashboard,
  AccountantDashboard,
  PatientDashboard,
} from "../../features/dashboard";
import { usePatientPortal } from "../../features/patients/context/PatientPortalContext";

export function DashboardDispatcher() {
  const user = useAuthStore((s) => s.user);
  const portal = usePatientPortal();

  if (!user || !user.role) {
    return <HospitalAdminDashboard />;
  }

  const role = String(user.role).toUpperCase();

  switch (role) {
    case "SUPER_ADMIN":
    case "SUPER-ADMIN":
      return <SuperAdminDashboard />;

    case "ADMIN":
    case "HOSPITAL_ADMIN":
    case "HOSPITAL-ADMIN":
      return <HospitalAdminDashboard />;

    case "DOCTOR":
      return <DoctorDashboard />;

    case "NURSE":
      return <NurseDashboard />;

    case "RECEPTIONIST":
      return <ReceptionDashboard />;

    case "ACCOUNTANT":
      return <AccountantDashboard />;

    case "PATIENT":
      return (
        <PatientDashboard
          activePatient={portal?.activePatient || undefined}
          familyMembers={portal?.familyMembers || []}
          onSwitchPatient={(member) => portal?.switchToPatient(member)}
        />
      );

    default:
      return <HospitalAdminDashboard />;
  }
}

export default DashboardDispatcher;
