import { useState, useEffect } from "react";
import { patientQueueService } from "../services/patientQueue.service";
import { usePatientPortal } from "../context/PatientPortalContext";
import type { PatientQueueData } from "../types/patient.types";

export function usePatientQueue() {
  const portal = usePatientPortal();
  const [queue, setQueue] = useState<PatientQueueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeMrn = portal?.activeMrn;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        if (!activeMrn) {
          setQueue(null);
          return;
        }
        const data = await patientQueueService.getPatientQueue(activeMrn);
        if (!cancelled) setQueue(data);
      } catch (err: unknown) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load patient queue",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [activeMrn]);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!activeMrn) {
        setQueue(null);
        return;
      }
      const data = await patientQueueService.getPatientQueue(activeMrn);
      setQueue(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load patient queue",
      );
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
