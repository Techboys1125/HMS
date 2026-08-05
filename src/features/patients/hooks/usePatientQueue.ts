import { useState, useEffect } from "react";
import { patientQueueService } from "../services/patientQueue.service";
import { usePatientPortal } from "../context/PatientPortalContext";
import type { PatientQueueData } from "../types/patient.types";

export function usePatientQueue() {
  const portal = usePatientPortal();
  const [queue, setQueue] = useState<PatientQueueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await patientQueueService.getPatientQueue(
          portal?.activeMrn || undefined,
        );
        if (!cancelled) setQueue(data);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load patient queue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [portal?.activeMrn]);

  const refresh = async () => {
    let cancelled = false;
    try {
      setLoading(true);
      setError(null);
      const data = await patientQueueService.getPatientQueue(
        portal?.activeMrn || undefined,
      );
      if (!cancelled) setQueue(data);
    } catch (err: unknown) {
      if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load patient queue");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  return {
    queue,
    loading,
    error,
    refresh,
  };
}
