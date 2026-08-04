import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "./usePatients";
import { patientsApi } from "../api/patient.api";
import type { CreatePatientRequest } from "../types/patient.types";

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientRequest) => patientsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}
