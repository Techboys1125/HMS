import { useState, useEffect, useCallback } from "react";
import { queueService } from "../services/queue.service";
import type { BaseQueueItem } from "../types/queue.types";

export function useQueue(params?: {
  date?: string;
  departmentId?: string | number;
  doctorId?: string | number;
  status?: string;
}) {
  const [items, setItems] = useState<BaseQueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await queueService.getActiveQueue(params);
      setItems(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [params?.date, params?.departmentId, params?.doctorId, params?.status]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return {
    items,
    loading,
    error,
    refresh: fetchQueue,
  };
}
