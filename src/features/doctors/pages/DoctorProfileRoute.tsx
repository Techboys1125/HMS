import { useParams } from "react-router";
import { DoctorProfilePage } from "./DoctorProfilePage";
import { useAuthStore } from "../../auth/index";
import { useState, useEffect } from "react";

export function DoctorProfileRoute() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const user = useAuthStore((state) => state.user);
  const [currentRole, setCurrentRole] = useState<string>("ADMIN");

  useEffect(() => {
    const role = String(user?.role ?? "ADMIN").toUpperCase();
    if (role === "RECEPTIONIST") setCurrentRole("RECEPTIONIST");
    else if (role === "DOCTOR") setCurrentRole("DOCTOR");
    else if (role === "NURSE") setCurrentRole("NURSE");
    else if (role === "PATIENT") setCurrentRole("PATIENT");
    else setCurrentRole("ADMIN");
  }, [user?.role]);

  if (!doctorId) return null;

  return (
    <DoctorProfilePage
      doctorId={doctorId}
      currentRole={currentRole as any}
      onBack={() => {}}
    />
  );
}