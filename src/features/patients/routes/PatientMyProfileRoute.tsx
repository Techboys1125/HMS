import { useAuthStore } from "../../auth/store/auth.store";
import { MyProfilePage } from "../pages/MyProfilePage";
import { usePatientPortal } from "../context/usePatientPortal";
import type { Role } from "../utils/patientPermissions";

export function PatientMyProfileRoute() {
  const user = useAuthStore((state) => state.user);
  const portal = usePatientPortal();

  const role = String(user?.role ?? "ADMIN").toUpperCase();
  const currentRole: Role =
    role === "RECEPTIONIST" ? "RECEPTIONIST"
    : role === "DOCTOR" ? "DOCTOR"
    : role === "NURSE" ? "NURSE"
    : role === "PATIENT" ? "PATIENT"
    : role === "ACCOUNTANT" ? "ACCOUNTANT"
    : "ADMIN";

  const mrn = portal?.primaryMrn || String(user?.patientId || user?.id || "UNKNOWN");

  return <MyProfilePage currentRole={currentRole} mrn={mrn} />;
}
