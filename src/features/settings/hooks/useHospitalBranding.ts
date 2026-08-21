import { useSyncExternalStore } from "react";
import {
  getStoredHospitalBranding,
  HOSPITAL_BRANDING_CHANGED_EVENT,
  type StoredHospitalBranding,
} from "../services/hospital-branding";

let brandingCache = getStoredHospitalBranding();

function subscribe(callback: () => void): () => void {
  const refresh = () => {
    brandingCache = getStoredHospitalBranding();
    callback();
  };
  window.addEventListener(HOSPITAL_BRANDING_CHANGED_EVENT, refresh);
  window.addEventListener("storage", refresh);

  return () => {
    window.removeEventListener(HOSPITAL_BRANDING_CHANGED_EVENT, refresh);
    window.removeEventListener("storage", refresh);
  };
}

function getSnapshot(): StoredHospitalBranding {
  return brandingCache;
}

export function useHospitalBranding(): StoredHospitalBranding {
  return useSyncExternalStore(subscribe, getSnapshot);
}
