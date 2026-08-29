import { useParams, useNavigate } from "react-router";
import { DoctorProfilePage } from "./DoctorProfilePage";
import { DoctorProfileScreen } from "../components/DoctorProfileScreen";
import { CommonProfilePage } from "../../users/pages/CommonProfilePage";
import { useAuthStore } from "../../auth/store/auth.store";
import { useState, useEffect } from "react";
import { ROUTES } from "../../../app/routes/routes";
import { normalizeRole } from "../utils/doctorPermissions";
import { doctorProfileService } from "../services/doctorProfile.service";
import type { DoctorRecord } from "../types/doctors.types";
import type { Role } from "../utils/doctorPermissions";

function DoctorDetailPage({
  doctorId,
  currentRole,
  onBack,
}: {
  doctorId: string;
  currentRole: Role | string;
  onBack: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const userDoctorId =
    user?.doctorId ?? user?.doctorProfile?.doctorId ?? user?.id ?? "";
  const isOwnRecord =
    String(currentRole).toUpperCase() === "DOCTOR"
      ? !doctorId ||
        doctorId === "me" ||
        String(doctorId) === String(userDoctorId)
      : String(doctorId) === String(userDoctorId);
  const hasCompleteInitialDoctor = false;

  const [doctor, setDoctor] = useState<DoctorRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    doctorProfileService
      .getDoctorProfile(doctorId)
      .then((record) => {
        if (!cancelled && record) setDoctor(record);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [doctorId, hasCompleteInitialDoctor]);

  return (
    <DoctorProfileScreen
      doctor={doctor ?? undefined}
      doctorId={doctorId}
      currentRole={currentRole}
      isOwnRecord={isOwnRecord}
      onBack={onBack}
    />
  );
}

export function DoctorProfileRoute() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const currentRole = normalizeRole(user?.role ?? "DOCTOR");

  const userDoctorId =
    user?.doctorId ?? user?.doctorProfile?.doctorId ?? user?.id ?? "";

  const isMeProfile =
    !doctorId || doctorId === "me" || String(doctorId) === String(userDoctorId);

  useEffect(() => {
    const role = String(user?.role ?? "ADMIN").toUpperCase();
    if (role === "DOCTOR" && doctorId && doctorId !== "me") {
      if (String(doctorId) !== String(userDoctorId)) {
        navigate(ROUTES.DOCTOR_ME_PROFILE, { replace: true });
      }
    } else if (role !== "DOCTOR" && (!doctorId || doctorId === "me")) {
      navigate(ROUTES.DOCTORS, { replace: true });
    }
  }, [doctorId, userDoctorId, user?.role, navigate]);

  if (isMeProfile) {
    return <CommonProfilePage />;
  }

  const resolvedDoctorId = doctorId || String(userDoctorId);
  if (!resolvedDoctorId) return null;

  return (
    <DoctorDetailPage
      doctorId={String(resolvedDoctorId)}
      currentRole={currentRole}
      onBack={() => {}}
    />
  );
}
