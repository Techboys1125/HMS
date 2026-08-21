import { PatientListPage } from "../pages/PatientListPage";
import { useAuthStore } from "../../auth/store/auth.store";
import type { Role } from "../utils/patientPermissions";

export function PatientListPageRoute() {
  const user = useAuthStore((state) => state.user);

  const role = String(user?.role ?? "ADMIN").toUpperCase();
  let currentRole: Role = "ADMIN";
  if (role === "RECEPTIONIST") currentRole = "RECEPTIONIST";
  else if (role === "DOCTOR") currentRole = "DOCTOR";
  else if (role === "NURSE") currentRole = "NURSE";
  else if (role === "PATIENT") currentRole = "PATIENT";
  else if (role === "ACCOUNTANT") currentRole = "ACCOUNTANT";

  return <PatientListPage currentRole={currentRole} />;
}
