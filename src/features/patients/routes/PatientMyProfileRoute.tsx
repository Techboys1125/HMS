import { useAuthStore } from "../../auth/index";
import { MyProfilePage } from "../pages/MyProfilePage";
import { usePatientPortal } from "../context/PatientPortalContext";
import type { Role } from "../utils/patientPermissions";
import { useEffect, useState } from "react";

export function PatientMyProfileRoute() {
  const user = useAuthStore((state) => state.user);
  const portal = usePatientPortal();
  const [currentRole, setCurrentRole] = useState<Role>("ADMIN");
  const [mrn, setMrn] = useState<string>("");

  useEffect(() => {
    const role = String(user?.role ?? "ADMIN").toUpperCase();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (role === "RECEPTIONIST") setCurrentRole("RECEPTIONIST");
    else if (role === "DOCTOR") setCurrentRole("DOCTOR");
    else if (role === "NURSE") setCurrentRole("NURSE");
    else if (role === "PATIENT") setCurrentRole("PATIENT");
    else if (role === "ACCOUNTANT") setCurrentRole("ACCOUNTANT");
    else setCurrentRole("ADMIN");
  }, [user?.role]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMrn(
      portal?.primaryMrn || String(user?.patientId || user?.id || "UNKNOWN"),
    );
  }, [portal?.primaryMrn, user?.patientId, user?.id]);

  return <MyProfilePage currentRole={currentRole} mrn={mrn} />;
}
