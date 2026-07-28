import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patient.service";

export const patientKeys = {
  all: ["patients"] as const,
  list: (query?: string) => [...patientKeys.all, "list", query ?? ""] as const,
  search: (query: string) => [...patientKeys.all, "search", query] as const,
  stats: () => [...patientKeys.all, "stats"] as const,
};

export function usePatients(params?: {
  query?: string;
  page?: number;
  size?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: patientKeys.list(params?.query),
    queryFn: () => patientService.getPatients(params),
  });
}

export function usePatientSearch(query: string) {
  return useQuery({
    queryKey: patientKeys.search(query),
    queryFn: () => patientService.searchPatients(query),
    enabled: query.trim().length >= 2,
  });
}

