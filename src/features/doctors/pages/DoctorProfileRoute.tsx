import { useParams, useNavigate } from "react-router";
import { DoctorProfilePage } from "./DoctorProfilePage";
import { useAuthStore } from "../../auth/index";
import { useEffect } from "react";
import { ROUTES } from "../../../app/routes/routes";
import { normalizeRole } from "../utils/doctorPermissions";

export function DoctorProfileRoute() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const currentRole = normalizeRole(user?.role);

  const userDoctorId =
    user?.doctorId ?? user?.doctorProfile?.doctorId ?? user?.id ?? "";

  const resolvedDoctorId =
    !doctorId || doctorId === "me" ? String(userDoctorId) : doctorId;

  useEffect(() => {
    const role = String(user?.role ?? "ADMIN").toUpperCase();
    if (role === "DOCTOR" && doctorId && doctorId !== "me") {
      if (String(doctorId) !== String(userDoctorId)) {
        navigate(ROUTES.DOCTOR_ME_PROFILE, {
          replace: true,
        });
      }
    } else if (role !== "DOCTOR" && (!doctorId || doctorId === "me")) {
      navigate(ROUTES.DOCTORS, { replace: true });
    }
  }, [doctorId, userDoctorId, user?.role, navigate]);

  if (!resolvedDoctorId) return null;

  return (
    <DoctorProfilePage
      doctorId={String(resolvedDoctorId)}
      currentRole={currentRole}
      onBack={() => {}}
    />
  );
}
