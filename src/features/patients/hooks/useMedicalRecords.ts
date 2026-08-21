/**
 * useMedicalRecords – React Query hook for patient medical records
 * Uses real backend APIs: prescriptions + billing
 */
import { useQuery } from "@tanstack/react-query";
import { medicalRecordService } from "../services/medicalRecord.service";

export const medicalRecordKeys = {
  all: ["medicalRecords"] as const,
  summary: (mrn: string) => [...medicalRecordKeys.all, "summary", mrn] as const,
  prescriptions: (mrn: string) =>
    [...medicalRecordKeys.all, "prescriptions", mrn] as const,
  billing: (mrn: string) =>
    [...medicalRecordKeys.all, "billing", mrn] as const,
};

export function useMedicalRecords(mrn: string) {
  return useQuery({
    queryKey: medicalRecordKeys.summary(mrn),
    queryFn: () => medicalRecordService.getMedicalSummary(mrn),
    enabled: !!mrn,
  });
}

export function usePrescriptionHistory(mrn: string) {
  return useQuery({
    queryKey: medicalRecordKeys.prescriptions(mrn),
    queryFn: () => medicalRecordService.getPrescriptionHistory(mrn),
    enabled: !!mrn,
  });
}

export function useBillingHistory(mrn: string) {
  return useQuery({
    queryKey: medicalRecordKeys.billing(mrn),
    queryFn: () => medicalRecordService.getBillingHistory(mrn),
    enabled: !!mrn,
  });
}
