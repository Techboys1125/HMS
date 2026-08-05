import { useMemo } from "react";
import type { Patient } from "../types/patient.types";
import { usePatientPortal } from "../context/PatientPortalContext";
import { PatientBillingTab } from "../components/tabs/BillingTab";

/**
 * PatientBillingScreen – Billing & Payments for the logged-in patient
 * (or the currently switched family member). Reuses the same PatientBillingTab
 * that powers the My Profile page.
 */
export function PatientBillingScreen() {
  const portal = usePatientPortal();
  const active = portal?.activePatient;

  const patient = useMemo<Patient>(
    () => ({
      insuranceDetails: null,
      mrn: active?.mrn || portal?.activeMrn || "",
      fullName: active?.patientName || "Patient",
      name: active?.patientName,
      patientName: active?.patientName,
      gender: active?.gender || "Other",
      age: active?.age,
      mobileNumber: active?.registeredMobile,
      phone: active?.registeredMobile,
      relationship: active?.relationship,
    }),
    [active, portal?.activeMrn],
  );

  return <PatientBillingTab patient={patient} canEdit={false} isOwnProfile />;
}
