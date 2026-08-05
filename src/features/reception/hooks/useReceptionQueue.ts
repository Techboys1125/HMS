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

  const paramsKey = JSON.stringify(params || {});
  const [prevParamsKey, setPrevParamsKey] = useState<string>("");

  if (paramsKey !== prevParamsKey) {
    setPrevParamsKey(paramsKey);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    receptionService
      .fetchWorklist(params)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch reception queue",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params, paramsKey]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
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

  return {
    items,
    loading,
    error,
    refresh,
  };
}
