import { useAuthStore } from "../../features/auth/store/auth.store";
import { SuperAdminDashboard } from "../../features/dashboard/pages/SuperAdminDashboard";
import { HospitalAdminDashboard } from "../../features/dashboard/pages/HospitalAdminDashboard";
import { DoctorDashboard } from "../../features/dashboard/pages/DoctorDashboard";
import { NurseDashboard } from "../../features/dashboard/pages/NurseDashboard";
import { ReceptionDashboard } from "../../features/dashboard/pages/ReceptionDashboard";
import { AccountantDashboard } from "../../features/dashboard/pages/AccountantDashboard";
import { PatientDashboard } from "../../features/dashboard/pages/PatientDashboard";
import { usePatientPortal } from "../../features/patients/context/usePatientPortal";

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
