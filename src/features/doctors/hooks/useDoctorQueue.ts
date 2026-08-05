import { useState, useEffect, useCallback, useRef } from "react";
import { doctorQueueService } from "../services/doctorQueue.service";
import type {
  DoctorQueueItem,
  DoctorQueueSummary,
} from "../types/doctors.types";

export function useDoctorQueue(doctorId?: number | string) {
  const [items, setItems] = useState<DoctorQueueItem[]>([]);
  const [summary, setSummary] = useState<DoctorQueueSummary>({});
  const [currentPatient, setCurrentPatient] = useState<DoctorQueueItem | null>(
    null,
  );
  const [nextPatient, setNextPatient] = useState<DoctorQueueItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const doctorIdRef = useRef(doctorId);

  const [prevDoctorId, setPrevDoctorId] = useState<number | string | undefined>(
    undefined,
  );
  if (doctorId !== prevDoctorId) {
    setPrevDoctorId(doctorId);
    setLoading(Boolean(doctorId));
    setError(null);
  }

  const fetchQueue = useCallback(async () => {
    const id = doctorIdRef.current;
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await doctorQueueService.getDoctorQueue(id);
      setItems(res.content);
      setSummary(res.summary);
      setCurrentPatient(res.currentPatient);
      setNextPatient(res.nextPatient);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load doctor queue",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doctorIdRef.current = doctorId;
    if (!doctorId) return;
    let cancelled = false;

    doctorQueueService
      .getDoctorQueue(doctorId)
      .then((res) => {
        if (cancelled) return;
        setItems(res.content);
        setSummary(res.summary);
        setCurrentPatient(res.currentPatient);
        setNextPatient(res.nextPatient);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load doctor queue",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

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
