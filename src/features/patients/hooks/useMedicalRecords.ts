/**
 * useMedicalRecords – React Query hook for patient medical records
 * Fetches from existing OPD/Vitals endpoints
 */
import { useQuery } from "@tanstack/react-query";
import { medicalRecordService } from "../services/medicalRecord.service";

export const medicalRecordKeys = {
  all: ["medicalRecords"] as const,
  summary: (mrn: string) => [...medicalRecordKeys.all, "summary", mrn] as const,
  consultations: (mrn: string) =>
    [...medicalRecordKeys.all, "consultations", mrn] as const,
  vitals: (mrn: string) => [...medicalRecordKeys.all, "vitals", mrn] as const,
  diagnoses: (mrn: string) =>
    [...medicalRecordKeys.all, "diagnoses", mrn] as const,
};

export function useMedicalRecords(mrn: string) {
  return useQuery({
    queryKey: medicalRecordKeys.summary(mrn),
    queryFn: () => medicalRecordService.getMedicalSummary(mrn),
    enabled: !!mrn,
  });
}

export function useConsultations(mrn: string) {
  return useQuery({
    queryKey: medicalRecordKeys.consultations(mrn),
    queryFn: () => medicalRecordService.getConsultations(mrn),
    enabled: !!mrn,
  });
}

export function useVitals(mrn: string) {
  return useQuery({
    queryKey: medicalRecordKeys.vitals(mrn),
    queryFn: () => medicalRecordService.getVitals(mrn),
    enabled: !!mrn,
  });
}
