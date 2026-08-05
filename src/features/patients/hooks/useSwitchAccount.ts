/**
 * useSwitchAccount – Hook for switching between patient and family member accounts
 * Updates the active MRN and triggers data reload across all tabs
 */
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { patientsApi } from "../api/patient.api";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";
import type { Patient, SwitchAccountContext } from "../types/patient.types";
import type { FamilyMember } from "../types/family.types";

const SWITCH_ACCOUNT_STORAGE_KEY = "hms-active-patient-mrn";

export function useSwitchAccount(primaryMrn: string) {
  const queryClient = useQueryClient();

  const [context, setContext] = useState<SwitchAccountContext>(() => {
    const storedMrn = localStorage.getItem(SWITCH_ACCOUNT_STORAGE_KEY);
    return {
      activeMrn: storedMrn || primaryMrn,
      primaryMrn,
      activePatientName: "",
      isFamilyMember: storedMrn ? storedMrn !== primaryMrn : false,
    };
  });

  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevActiveMrn, setPrevActiveMrn] = useState<string | null>(null);

  if (context.activeMrn !== prevActiveMrn) {
    setPrevActiveMrn(context.activeMrn);
    if (context.activeMrn) {
      setIsLoading(true);
    }
  }

  /**
   * Switch back to the primary (self) account
   */
  const switchToPrimary = useCallback(() => {
    localStorage.setItem(SWITCH_ACCOUNT_STORAGE_KEY, primaryMrn);
    setContext({
      activeMrn: primaryMrn,
      primaryMrn,
      activePatientName: "",
      isFamilyMember: false,
    });
    queryClient.invalidateQueries();
  }, [primaryMrn, queryClient]);

  // Load active patient data
  useEffect(() => {
    if (!context.activeMrn) return;
    patientsApi
      .getPatientByMrn(context.activeMrn)
      .then((raw) => {
        const mapped = mapApiPatientToPatientRecord(raw);
        setActivePatient(mapped);
        setContext((prev) => ({
          ...prev,
          activePatientName: mapped.fullName || "",
        }));
      })
      .catch(() => {
        // If family member MRN fails, fallback to primary
        if (context.activeMrn !== primaryMrn) {
          switchToPrimary();
        }
      })
      .finally(() => setIsLoading(false));
  }, [context.activeMrn, primaryMrn, switchToPrimary]);

  /**
   * Switch to a family member's account
   */
  const switchToFamilyMember = useCallback(
    (member: FamilyMember) => {
      const newMrn = member.mrn || String(member.id);
      localStorage.setItem(SWITCH_ACCOUNT_STORAGE_KEY, newMrn);
      setContext({
        activeMrn: newMrn,
        primaryMrn,
        activePatientName: member.name || member.fullName || "",
        isFamilyMember: true,
      });
      // Invalidate all cached data so tabs reload with new MRN
      queryClient.invalidateQueries();
    },
    [primaryMrn, queryClient],
  );

  return {
    context,
    activePatient,
    isLoading,
    switchToFamilyMember,
    switchToPrimary,
    activeMrn: context.activeMrn,
    isFamilyMember: context.isFamilyMember,
  };
}
