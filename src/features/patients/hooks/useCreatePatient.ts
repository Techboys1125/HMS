import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "./usePatients";
import { patientService } from "../services/patient.service";
import type { CreatePatientRequest } from "../types/patient.types";

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientRequest) =>
      patientService.createPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}
