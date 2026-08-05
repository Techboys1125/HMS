import { useParams } from "react-router";
import { DoctorProfilePage } from "./DoctorProfilePage";
import { useAuthStore } from "../../auth/index";
import type { Role } from "../utils/doctorPermissions";

export function DoctorProfileRoute() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const user = useAuthStore((state) => state.user);

  const role = String(user?.role ?? "ADMIN").toUpperCase();
  let currentRole: Role = "ADMIN";
  if (role === "RECEPTIONIST") currentRole = "RECEPTIONIST";
  else if (role === "DOCTOR") currentRole = "DOCTOR";
  else if (role === "NURSE") currentRole = "NURSE";
  else if (role === "PATIENT") currentRole = "PATIENT";

  if (!doctorId) return null;

  return (
    <DoctorProfilePage
      doctorId={doctorId}
      currentRole={currentRole}
      onBack={() => {}}
    />
  );
}
