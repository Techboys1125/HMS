/**
 * PatientPortalContext – Shared patient portal state.
 * Loads the logged-in patient's family members (GET /api/v1/patients/my),
 * tracks the currently active patient (self or switched family member),
 * and persists the active MRN in localStorage so all patient screens
 * stay in sync with the Header profile switcher and the My Profile page.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuthStore } from "../../auth";
import { patientsApi } from "../api/patient.api";
import type { FamilyMember } from "../pages/FamilyMembersManagement";

export const SWITCH_ACCOUNT_STORAGE_KEY = "hms-active-patient-mrn";

interface PatientPortalContextValue {
  familyMembers: FamilyMember[];
  activePatient: FamilyMember | null;
  activeMrn: string | null;
  primaryMrn: string | null;
  isLoading: boolean;
  switchToPatient: (member: FamilyMember) => void;
  refresh: () => void;
}

const PatientPortalContext = createContext<PatientPortalContextValue | null>(
  null,
);

interface PatientPortalPayload {
  id?: string | number;
  mrn?: string;
  patientName?: string;
  fullName?: string;
  relationship?: string;
  age?: number;
  gender?: string;
  mobileNumber?: string;
  phone?: string;
  registeredMobile?: string;
  email?: string;
  photoUrl?: string;
  photo?: string;
  address?: unknown;
  lastAppointment?: string;
  upcomingAppointmentsCount?: number;
  pendingBillsCount?: number;
  pendingBillsAmount?: number;
  activePrescriptionsCount?: number;
  knownAllergies?: string[];
  allergies?: string[];
}

function mapApiToFamilyMember(p: PatientPortalPayload): FamilyMember {
  return {
    id: String(p.id ?? p.mrn ?? Math.random()),
    patientName: p.patientName || p.fullName || "Unknown",
    mrn: p.mrn || "",
    relationship: (p.relationship as FamilyMember["relationship"]) || "Self",
    age: p.age ?? 0,
    gender: (p.gender as FamilyMember["gender"]) || "Other",
    registeredMobile: p.registeredMobile || p.mobileNumber || p.phone || "",
    verificationStatus: "Verified",
    patientStatus: "Active",
    lastAppointment: p.lastAppointment || "",
    upcomingAppointmentsCount: p.upcomingAppointmentsCount ?? 0,
    pendingBillsCount: p.pendingBillsCount ?? 0,
    pendingBillsAmount: p.pendingBillsAmount ?? 0,
    activePrescriptionsCount: p.activePrescriptionsCount ?? 0,
    knownAllergies: p.knownAllergies || p.allergies || [],
  };
}

export function PatientPortalProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const isPatient = String(user?.role ?? "").toUpperCase() === "PATIENT";
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activePatient, setActivePatient] = useState<FamilyMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!isPatient) return;
    let cancelled = false;
    setIsLoading(true);
    patientsApi
      .getMyPatients()
      .then((data) => {
        if (cancelled) return;
        const mapped: FamilyMember[] = (Array.isArray(data) ? data : []).map(
          (p) => mapApiToFamilyMember(p as PatientPortalPayload),
        );
        const self = mapped.find(
          (member) => String(member.relationship).toUpperCase() === "SELF",
        );
        const primary =
          self || mapped.find((member) => member.mrn === user?.patientId);

        setFamilyMembers(mapped);
        const storedMrn = localStorage.getItem(SWITCH_ACCOUNT_STORAGE_KEY);
        setActivePatient((prev) => {
          return (
            mapped.find((m) => String(m.mrn) === storedMrn) ||
            (prev && mapped.some((m) => String(m.mrn) === String(prev.mrn))
              ? prev
              : primary || mapped[0]) ||
            null
          );
        });
      })
      .catch(() => {
        if (cancelled) return;
        setFamilyMembers([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isPatient, user?.patientId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SWITCH_ACCOUNT_STORAGE_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const switchToPatient = useCallback((member: FamilyMember) => {
    const mrn = member.mrn || String(member.id);
    if (mrn) localStorage.setItem(SWITCH_ACCOUNT_STORAGE_KEY, mrn);
    setActivePatient(member);
  }, []);

  const value = useMemo<PatientPortalContextValue>(
    () => ({
      familyMembers,
      activePatient,
      activeMrn: activePatient?.mrn || null,
      primaryMrn:
        familyMembers.find(
          (member) => String(member.relationship).toUpperCase() === "SELF",
        )?.mrn ||
        user?.patientId ||
        null,
      isLoading,
      switchToPatient,
      refresh,
    }),
    [
      familyMembers,
      activePatient,
      user?.patientId,
      isLoading,
      switchToPatient,
      refresh,
    ],
  );

  return (
    <PatientPortalContext.Provider value={value}>
      {children}
    </PatientPortalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePatientPortal(): PatientPortalContextValue | null {
  return useContext(PatientPortalContext);
}
