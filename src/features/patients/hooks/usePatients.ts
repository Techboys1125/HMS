import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Patient, PatientStatus } from "../types/patient.types";
import { patientApi } from "../api/patientApi";
import { mapApiPatientToPatientRecord } from "../api/mapApiPatientToPatientRecord";

interface AuditEntry {
  action: string;
  timestamp: string;
  performedBy: string;
  details: string;
}

export const patientKeys = {
  all: ["patients"] as const,
  list: (query?: string) => [...patientKeys.all, "list", query ?? ""] as const,
  search: (query: string) => [...patientKeys.all, "search", query] as const,
  detail: (mrn: string) => [...patientKeys.all, "detail", mrn] as const,
  stats: () => [...patientKeys.all, "stats"] as const,
  audit: (mrn: string) => [...patientKeys.all, "audit", mrn] as const,
};

export function usePatients(params?: {
  query?: string;
  page?: number;
  size?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: patientKeys.list(params?.query),
    queryFn: () => patientApi.listPatients(params),
  });
}

export function usePatient(mrn: string) {
  return useQuery({
    queryKey: patientKeys.detail(mrn),
    queryFn: () => patientApi.getPatientByMrn(mrn),
    enabled: !!mrn,
  });
}

export function usePatientSearch(query: string) {
  return useQuery({
    queryKey: patientKeys.search(query),
    queryFn: () => patientApi.listPatients({ query }),
    enabled: query.trim().length >= 2,
  });
}

export function useRegisterPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      patientApi.registerPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useUpdatePatient(mrn: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      patientApi.updatePatient(mrn, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(mrn) });
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function usePatientAudit(mrn: string) {
  return useQuery({
    queryKey: patientKeys.audit(mrn),
    queryFn: () => patientApi.getPatientAudit(mrn),
    enabled: !!mrn,
  });
}