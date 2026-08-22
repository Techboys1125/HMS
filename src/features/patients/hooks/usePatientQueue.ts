import { useState, useEffect } from "react";
import { patientQueueService } from "../services/patientQueue.service";
import { usePatientPortal } from "../context/usePatientPortal";
import { useAuthStore } from "../../auth/store/auth.store";
import { ApiError } from "../../../lib/axios";
import type { PatientQueueData } from "../types/patient.types";

export function usePatientQueue() {
  const portal = usePatientPortal();
  const user = useAuthStore((s) => s.user);
  const [queue, setQueue] = useState<PatientQueueData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const rawMrn =
    portal?.activeMrn || portal?.primaryMrn || user?.patientId || user?.mrn;
  const isValidPatient = Boolean(
    rawMrn &&
    !String(rawMrn).includes("MRN-PATIENT") &&
    !String(rawMrn).includes("Generating"),
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isValidPatient || !rawMrn) {
        setQueue(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await patientQueueService.getPatientQueue(rawMrn);
        if (!cancelled) {
          setQueue(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setQueue(null);
            setError(null);
          } else {
            setQueue(null);
            setError(
              err instanceof Error
                ? err.message
                : "Failed to load patient queue",
            );
          }
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isValidPatient, rawMrn]);

  const refresh = async () => {
    if (!isValidPatient || !rawMrn) {
      setQueue(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await patientQueueService.getPatientQueue(rawMrn);
      setQueue(data);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 404) {
        setQueue(null);
        setError(null);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to load patient queue",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    queue,
    loading,
    error,
    refresh,
  };
}
