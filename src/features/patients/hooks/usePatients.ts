import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsApi } from "../api/patient.api";

export const patientKeys = {
  all: ["patients"] as const,
  list: (query?: string) => [...patientKeys.all, "list", query ?? ""] as const,
  search: (query: string) => [...patientKeys.all, "search", query] as const,
  detail: (mrn: string) => [...patientKeys.all, "detail", mrn] as const,
  stats: () => [...patientKeys.all, "stats"] as const,
  audit: (mrn: string) => [...patientKeys.all, "audit", mrn] as const,
};

export function usePatients(
  params?: {
    query?: string;
    page?: number;
    size?: number;
    status?: string;
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: patientKeys.list(params?.query),
    queryFn: () => patientsApi.listPatients(params),
    enabled: options?.enabled,
  });
}

export function usePatient(mrn: string) {
  return useQuery({
    queryKey: patientKeys.detail(mrn),
    queryFn: () => patientsApi.getPatientByMrn(mrn),
    enabled: !!mrn,
  });
}

export function usePatientSearch(
  query: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: patientKeys.search(query),
    queryFn: async () => {
      const list = await patientsApi.getAll({ query });
      return { items: list || [] };
    },
    enabled: options?.enabled ?? query.trim().length >= 2,
  });
}

export function useUpdatePatient(mrn: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      patientsApi.updatePatient(mrn, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(mrn) });
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useDoctorPatients(
  params?: {
    page?: number;
    size?: number;
    search?: string;
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...patientKeys.all, "doctor", params?.search ?? ""],
    queryFn: () => patientsApi.getDoctorPatients(undefined, params),
    enabled: options?.enabled,
  });
}
