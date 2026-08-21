import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import type { EncounterPrescriptionResponse } from "../types/prescription.types";

interface ApiEnvelope<T> {
  success?: boolean;
  code?: string;
  message?: string;
  timestamp?: string;
  data?: T;
}

export const encounterPrescriptionKeys = {
  all: ["encounter-prescriptions"] as const,
  detail: (encounterId: string | number) =>
    ["encounter-prescriptions", String(encounterId)] as const,
};

export async function fetchEncounterPrescription(
  encounterId: string | number,
): Promise<EncounterPrescriptionResponse | null> {
  if (!encounterId) return null;
  try {
    const response = await apiClient.get<
      ApiEnvelope<EncounterPrescriptionResponse> | EncounterPrescriptionResponse
    >(`/api/v1/encounters/${encounterId}/prescription`);

    const body = response.data;
    if (body && typeof body === "object" && "data" in body && body.data) {
      return body.data;
    }
    return body as EncounterPrescriptionResponse;
  } catch (error) {
    console.error("Error fetching encounter prescription:", error);
    throw error;
  }
}

export function useEncounterPrescription(
  encounterId: string | number | null | undefined,
  options?: { enabled?: boolean },
) {
  const queryEnabled = Boolean(encounterId) && (options?.enabled ?? true);

  return useQuery({
    queryKey: encounterPrescriptionKeys.detail(encounterId || ""),
    queryFn: () => fetchEncounterPrescription(encounterId!),
    enabled: queryEnabled,
    staleTime: 30_000,
    retry: 1,
  });
}
