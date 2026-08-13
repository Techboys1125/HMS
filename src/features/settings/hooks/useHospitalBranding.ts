import { useEffect, useState } from "react";
import {
  getStoredHospitalBranding,
  HOSPITAL_BRANDING_CHANGED_EVENT,
  type StoredHospitalBranding,
} from "../services/hospital-branding";

export function useHospitalBranding(): StoredHospitalBranding {
  const [branding, setBranding] = useState<StoredHospitalBranding>(() =>
    getStoredHospitalBranding(),
  );

  useEffect(() => {
    const refresh = () => setBranding(getStoredHospitalBranding());
    window.addEventListener(HOSPITAL_BRANDING_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    refresh();

    return () => {
      window.removeEventListener(HOSPITAL_BRANDING_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return branding;
}
