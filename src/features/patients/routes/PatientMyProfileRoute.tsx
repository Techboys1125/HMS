import { useAuthStore } from "../../auth/index";
import { MyProfilePage } from "../pages/MyProfilePage";
import type { Role } from "../utils/patientPermissions";

export function PatientMyProfileRoute() {
  const user = useAuthStore((state) => state.user);

  const role = String(user?.role ?? "ADMIN").toUpperCase();
  let currentRole: Role = "ADMIN";
  if (role === "RECEPTIONIST") currentRole = "RECEPTIONIST";
  else if (role === "DOCTOR") currentRole = "DOCTOR";
  else if (role === "NURSE") currentRole = "NURSE";
  else if (role === "PATIENT") currentRole = "PATIENT";
  else if (role === "ACCOUNTANT") currentRole = "ACCOUNTANT";

  const mrn = String(user?.id ?? "UNKNOWN");

  return <MyProfilePage currentRole={currentRole} mrn={mrn} />;
}
