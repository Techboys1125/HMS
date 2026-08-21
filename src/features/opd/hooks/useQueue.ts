import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { queueApi, type QueueListResult } from "../api/queueApi";
import type { QueueListParams, QueueStatus } from "../types/queue.types";

export const QUEUE_QUERY_KEY = ["queue", "list"];

export interface UseQueueOptions {
  doctorId?: number;
  date?: string;
  status?: QueueStatus;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export function useQueue(options: UseQueueOptions = {}) {
  const queryClient = useQueryClient();
  const {
    doctorId,
    date,
    status,
    search,
    page = 0,
    size = 50,
    enabled = true,
  } = options;

  const params = useMemo<QueueListParams>(
    () => ({ doctorId, date, status, search, page, size }),
    [doctorId, date, status, search, page, size],
  );

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<QueueListResult>({
    queryKey: [...QUEUE_QUERY_KEY, params],
    queryFn: () => queueApi.getQueueList(params),
    enabled,
    staleTime: 30_000,
    refetchInterval: 15_000,
  });

  const updateParams = useCallback(() => {}, []);

  const callPatientMutation = useMutation({
    mutationFn: (appointmentId: number) => queueApi.callPatient(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY });
    },
  });

  const callNextMutation = useMutation({
    mutationFn: (doctorId: number | string) => queueApi.callNext(doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUEUE_QUERY_KEY });
    },
  });

  return {
    items: data?.content ?? [],
    summary: data?.summary ?? { completed: 0, waiting: 0, called: 0, inConsultation: 0 },
    page: data?.page ?? { size: 20, totalElements: 0, page: 0 },
    isLoading,
    isFetching,
    error,
    refetch,
    params,
    updateParams,
    callPatient: callPatientMutation.mutateAsync,
    callNext: callNextMutation.mutateAsync,
    isCalling: callPatientMutation.isPending || callNextMutation.isPending,
  };
}
