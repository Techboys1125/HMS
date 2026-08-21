import { useAuthStore } from "../../auth/store/auth.store";
import { usePatientPortal } from "../context/usePatientPortal";
import { MyProfilePage } from "../pages/MyProfilePage";
import { StaffProfilePage } from "../pages/StaffProfilePage";
import { MyProfilePage as DoctorMyProfilePage } from "../../doctors/pages/MyProfilePage";
import type { Role } from "../utils/patientPermissions";

/**
 * Unified "My Profile" route dispatcher.
 *
 * Detects the logged-in user's role and delegates to the appropriate
 * profile page implementation:
 *
 * - PATIENT      → existing PatientMyProfilePage (PatientProfileCenterScreen)
 * - DOCTOR       → existing Doctor MyProfilePage (schedule, tabs, etc.)
 * - NURSE        → StaffProfilePage
 * - RECEPTIONIST → StaffProfilePage
 * - ACCOUNTANT   → StaffProfilePage
 * - ADMIN        → not expected to reach here (no nav item)
 */
export function UserProfileRoute() {
  const user = useAuthStore((state) => state.user);
  const portal = usePatientPortal();

  const role = String(user?.role ?? "ADMIN").toUpperCase();

  const currentRole: Role =
    role === "PATIENT"
      ? "PATIENT"
      : role === "DOCTOR"
        ? "DOCTOR"
        : role === "NURSE"
          ? "NURSE"
          : role === "RECEPTIONIST"
            ? "RECEPTIONIST"
            : role === "ACCOUNTANT"
              ? "ACCOUNTANT"
              : "ADMIN";

  // ── PATIENT ──
  if (currentRole === "PATIENT") {
    const mrn =
      portal?.primaryMrn || String(user?.patientId || user?.id || "UNKNOWN");
    return <MyProfilePage currentRole={currentRole} mrn={mrn} />;
  }

  // ── DOCTOR ──
  if (currentRole === "DOCTOR") {
    return <DoctorMyProfilePage />;
  }

  // ── NURSE / RECEPTIONIST / ACCOUNTANT ──
  if (
    currentRole === "NURSE" ||
    currentRole === "RECEPTIONIST" ||
    currentRole === "ACCOUNTANT"
  ) {
    return <StaffProfilePage currentRole={currentRole} />;
  }

  // ── ADMIN (should not arrive here, but fallback) ──
  return null;
}
