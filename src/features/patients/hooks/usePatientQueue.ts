import { useState, useEffect, useCallback } from "react";
import { patientQueueService } from "../services/patientQueue.service";
import type { PatientQueueData } from "../types/patient.types";

export function usePatientQueue() {
  const [queue, setQueue] = useState<PatientQueueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientQueueService.getPatientQueue();
      setQueue(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load patient queue",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    patientQueueService
      .getPatientQueue()
      .then((data) => {
        if (!cancelled) {
          setQueue(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load patient queue",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    queue,
    loading,
    error,
    refresh,
  };
}
