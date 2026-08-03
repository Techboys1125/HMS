import { useState, useEffect, useCallback } from "react";
import { doctorQueueService } from "../services/doctorQueue.service";
import type { DoctorQueueItem, DoctorQueueSummary } from "../types/doctors.types";

export function useDoctorQueue(doctorId?: number | string) {
  const [items, setItems] = useState<DoctorQueueItem[]>([]);
  const [summary, setSummary] = useState<DoctorQueueSummary>({});
  const [currentPatient, setCurrentPatient] = useState<DoctorQueueItem | null>(null);
  const [nextPatient, setNextPatient] = useState<DoctorQueueItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await doctorQueueService.getDoctorQueue(doctorId);
      setItems(res.content);
      setSummary(res.summary);
      setCurrentPatient(res.currentPatient);
      setNextPatient(res.nextPatient);
    } catch (err: any) {
      setError(err?.message || "Failed to load doctor queue");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return {
    items,
    summary,
    currentPatient,
    nextPatient,
    loading,
    error,
    refresh: fetchQueue,
  };
}
