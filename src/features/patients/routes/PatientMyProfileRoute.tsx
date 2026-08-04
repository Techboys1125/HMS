import { useAuthStore } from "../../auth/index";
import { useState, useEffect } from "react";
import { MyProfilePage } from "../pages/MyProfilePage";

export function PatientMyProfileRoute() {
  const user = useAuthStore((state) => state.user);
  const [currentRole, setCurrentRole] = useState<string>("ADMIN");
  const [mrn, setMrn] = useState<string>("");

  useEffect(() => {
    const role = String(user?.role ?? "ADMIN").toUpperCase();
    if (role === "RECEPTIONIST") setCurrentRole("RECEPTIONIST");
    else if (role === "DOCTOR") setCurrentRole("DOCTOR");
    else if (role === "NURSE") setCurrentRole("NURSE");
    else if (role === "PATIENT") setCurrentRole("PATIENT");
    else if (role === "ACCOUNTANT") setCurrentRole("ACCOUNTANT");
    else setCurrentRole("ADMIN");
  }, [user?.role]);

  useEffect(() => {
    setMrn(String(user?.id ?? "UNKNOWN"));
  }, [user?.id]);

  return <MyProfilePage currentRole={currentRole as any} mrn={mrn} />;
}
