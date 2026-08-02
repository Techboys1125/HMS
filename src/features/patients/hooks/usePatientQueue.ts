import { useState, useEffect, useCallback } from "react";
import { patientQueueService } from "../services/patientQueue.service";
import type { PatientQueueData } from "../types/patient.types";

export function usePatientQueue() {
  const [queue, setQueue] = useState<PatientQueueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientQueueService.getPatientQueue();
      setQueue(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load patient queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return {
    queue,
    loading,
    error,
    refresh: fetchQueue,
  };
}
