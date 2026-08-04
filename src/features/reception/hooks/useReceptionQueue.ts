import { useState, useEffect, useCallback } from "react";
import { receptionService } from "../services/reception.service";
import type { ReceptionQueueItem } from "../types/reception.types";

export function useReceptionQueue(params?: {
  date?: string;
  departmentId?: string;
  doctorId?: string;
  status?: string;
  search?: string;
}) {
  const [items, setItems] = useState<ReceptionQueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorklist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await receptionService.fetchWorklist(params);
      setItems(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch reception queue",
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchWorklist();
  }, [fetchWorklist]);

  return {
    items,
    loading,
    error,
    refresh: fetchWorklist,
  };
}
