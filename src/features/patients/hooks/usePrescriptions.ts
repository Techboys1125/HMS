/**
 * usePrescriptions – React Query hooks for patient prescriptions
 */
import { useQuery } from "@tanstack/react-query";
import { patientsApi } from "../api/patient.api";

export const prescriptionKeys = {
  all: ["patientPrescriptions"] as const,
  list: (mrn: string) => [...prescriptionKeys.all, "list", mrn] as const,
  detail: (id: string) => [...prescriptionKeys.all, "detail", id] as const,
};

export function usePrescriptions(mrn: string) {
  return useQuery({
    queryKey: prescriptionKeys.list(mrn),
    queryFn: () => patientsApi.getPrescriptions(mrn),
    enabled: !!mrn,
  });
}

export function usePrescriptionDetail(id: string) {
  return useQuery({
    queryKey: prescriptionKeys.detail(id),
    queryFn: () => patientsApi.getPrescriptionById(id),
    enabled: !!id,
  });
}
