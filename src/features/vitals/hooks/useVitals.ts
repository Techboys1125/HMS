import { useState, useEffect, useCallback } from "react";
import { vitalsService } from "../services/vitals.service";
import type {
  NurseWaitingPatient,
  RecordedVitalsData,
  NurseVitalsPayload,
} from "../types/vitals.types";

export function useVitals() {
  const [waitingPatients, setWaitingPatients] = useState<NurseWaitingPatient[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWaitingPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await vitalsService.getWaitingPatients();
      setWaitingPatients(list);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch waiting patients for vitals");
    } finally {
      setLoading(false);
    }
  }, []);

  const recordVitals = useCallback(
    async (
      appointmentId: string | number,
      formData:
        | NurseVitalsPayload
        | (RecordedVitalsData & {
            chiefComplaint?: string;
            symptoms?: string;
            diagnosis?: string;
            clinicalNotes?: string;
            notes?: string;
          }),
    ) => {
      try {
        setSubmitting(true);
        setError(null);
        const success = await vitalsService.submitVitals(
          appointmentId,
          formData,
        );
        if (success) {
          await fetchWaitingPatients();
        }
        return success;
      } catch (err: any) {
        setError(err?.message || "Failed to record vitals");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchWaitingPatients],
  );

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchWaitingPatients();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchWaitingPatients]);

  return {
    waitingPatients,
    loading,
    submitting,
    error,
    refresh: fetchWaitingPatients,
    recordVitals,
  };
}
