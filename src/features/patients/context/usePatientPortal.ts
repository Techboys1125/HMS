import { useContext } from "react";
import {
  PatientPortalContext,
  type PatientPortalContextValue,
} from "./PatientPortalContext";

export function usePatientPortal(): PatientPortalContextValue | null {
  return useContext(PatientPortalContext);
}
