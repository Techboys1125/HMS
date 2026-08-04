import { PatientListPage } from "../pages/PatientListPage";
import { useAuthStore } from "../../auth/index";
import { useState, useEffect } from "react";

export function PatientListPageRoute() {
  const user = useAuthStore((state) => state.user);
  const [currentRole, setCurrentRole] = useState<string>("ADMIN");

  useEffect(() => {
    const role = String(user?.role ?? "ADMIN").toUpperCase();
    if (role === "RECEPTIONIST") setCurrentRole("RECEPTIONIST");
    else if (role === "DOCTOR") setCurrentRole("DOCTOR");
    else if (role === "NURSE") setCurrentRole("NURSE");
    else if (role === "PATIENT") setCurrentRole("PATIENT");
    else if (role === "ACCOUNTANT") setCurrentRole("ACCOUNTANT");
    else setCurrentRole("ADMIN");
  }, [user?.role]);

  return <PatientListPage currentRole={currentRole as any} />;
}
